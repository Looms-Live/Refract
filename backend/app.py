"""
Text-to-Query API with Vanna.ai RAG and Convex Integration
Converts natural language to SQL queries using RAG from client database schema with Gemini 2.0 Flash
"""

from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import os
import logging
from dotenv import load_dotenv
import vanna
from vanna.chromadb import ChromaDB_VectorStore
from vanna.base import VannaBase
import google.generativeai as genai
import httpx
import asyncio
from datetime import datetime
import structlog

# Load environment variables from .env.local
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Initialize FastAPI app
app = FastAPI(
    title="Vanna.ai Text-to-Query API",
    description="Convert natural language to SQL queries using RAG from Convex database",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Pydantic models
class ConvexConfig(BaseModel):
    """Configuration for Convex database connection"""
    url: str = Field(..., description="Convex deployment URL")
    token: str = Field(..., description="Convex authentication token")
    database_name: str = Field(default="main", description="Database name in Convex")

class QueryRequest(BaseModel):
    """Request model for text-to-query conversion"""
    query: str = Field(..., min_length=1, max_length=1000, description="Natural language query")
    convex_config: ConvexConfig = Field(..., description="Convex database configuration")
    max_results: Optional[int] = Field(default=100, ge=1, le=1000, description="Maximum number of results")
    explain: Optional[bool] = Field(default=False, description="Include query explanation")

class QueryResponse(BaseModel):
    """Response model for query results"""
    success: bool
    query: str
    generated_sql: str
    results: List[Dict[str, Any]]
    explanation: Optional[str] = None
    execution_time: float
    row_count: int
    error: Optional[str] = None

class SchemaInfo(BaseModel):
    """Database schema information"""
    tables: List[Dict[str, Any]]
    relationships: List[Dict[str, Any]]
    
# Global Vanna instance (will be initialized per request based on client config)
vanna_instances = {}

class GeminiChat:
    """Custom Gemini chat implementation for Vanna"""
    def __init__(self, config=None):
        self.config = config or {}
        # Configure Gemini
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(
            model_name=self.config.get('model', 'gemini-2.0-flash-exp')
        )
        
    def submit_prompt(self, prompt: str, **kwargs) -> str:
        """Submit a prompt to Gemini and get response"""
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error("Error generating content with Gemini", error=str(e))
            raise e

class VannaRAG(ChromaDB_VectorStore, GeminiChat):
    """Custom Vanna class combining ChromaDB for RAG and Google Gemini for chat"""
    def __init__(self, config=None):
        ChromaDB_VectorStore.__init__(self, config=config)
        GeminiChat.__init__(self, config=config)

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """Verify authentication token"""
    token = credentials.credentials
    # In production, implement proper token verification
    # For now, we'll use a simple API key check
    expected_token = os.getenv("API_KEY", "your-secret-api-key")
    if token != expected_token:
        raise HTTPException(status_code=401, detail="Invalid authentication token")
    return token

async def get_convex_schema(convex_config: ConvexConfig) -> Dict[str, Any]:
    """Retrieve database schema from Convex"""
    try:
        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"Bearer {convex_config.token}",
                "Content-Type": "application/json"
            }
            
            # Get schema information from Convex
            schema_response = await client.post(
                f"{convex_config.url}/api/query",
                headers=headers,
                json={
                    "function": "_system:describe_database",
                    "args": {"database": convex_config.database_name}
                }
            )
            
            if schema_response.status_code != 200:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Failed to fetch schema from Convex: {schema_response.text}"
                )
            
            return schema_response.json()
            
    except httpx.RequestError as e:
        logger.error("Failed to connect to Convex", error=str(e))
        raise HTTPException(status_code=500, detail=f"Convex connection error: {str(e)}")

async def setup_vanna_rag(convex_config: ConvexConfig, schema_data: Dict[str, Any]) -> VannaRAG:
    """Initialize and train Vanna with RAG from Convex schema"""
    config_key = f"{convex_config.url}_{convex_config.database_name}"
    
    if config_key in vanna_instances:
        return vanna_instances[config_key]
    
    # Initialize Vanna with RAG capabilities using Gemini
    vn = VannaRAG(config={
        'api_key': os.getenv('GEMINI_API_KEY'),
        'model': 'gemini-2.0-flash-exp',
        'path': f'./vanna_cache_{hash(config_key)}'
    })
    
    # Train Vanna with database schema
    for table in schema_data.get('tables', []):
        table_name = table.get('name', '')
        table_schema = table.get('schema', {})
        
        # Add table documentation
        table_doc = f"""
        Table: {table_name}
        Columns: {', '.join([f"{col['name']} ({col['type']})" for col in table_schema.get('columns', [])])}
        Description: {table.get('description', 'No description available')}
        """
        
        vn.train(documentation=table_doc)
        
        # Add sample queries for this table
        sample_queries = [
            f"SELECT * FROM {table_name} LIMIT 10",
            f"SELECT COUNT(*) FROM {table_name}",
        ]
        
        for sql in sample_queries:
            vn.train(sql=sql)
    
    # Add relationship information
    for relationship in schema_data.get('relationships', []):
        rel_doc = f"""
        Relationship: {relationship.get('from_table')} -> {relationship.get('to_table')}
        Foreign Key: {relationship.get('foreign_key')} references {relationship.get('primary_key')}
        """
        vn.train(documentation=rel_doc)
    
    vanna_instances[config_key] = vn
    logger.info("Vanna RAG initialized", config_key=config_key)
    
    return vn

async def execute_convex_query(convex_config: ConvexConfig, sql: str, max_results: int) -> List[Dict[str, Any]]:
    """Execute SQL query on Convex database"""
    try:
        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"Bearer {convex_config.token}",
                "Content-Type": "application/json"
            }
            
            # Execute query via Convex
            query_response = await client.post(
                f"{convex_config.url}/api/query",
                headers=headers,
                json={
                    "function": "_system:execute_sql",
                    "args": {
                        "sql": sql,
                        "database": convex_config.database_name,
                        "limit": max_results
                    }
                },
                timeout=30.0
            )
            
            if query_response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail=f"Query execution failed: {query_response.text}"
                )
            
            result = query_response.json()
            return result.get('data', [])
            
    except httpx.TimeoutException:
        logger.error("Query execution timeout")
        raise HTTPException(status_code=408, detail="Query execution timeout")
    except httpx.RequestError as e:
        logger.error("Query execution error", error=str(e))
        raise HTTPException(status_code=500, detail=f"Query execution error: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "vanna-text-to-query"
    }

@app.get("/schema")
async def get_database_schema(
    convex_url: str,
    convex_token: str,
    database_name: str = "main",
    token: str = Depends(verify_token)
) -> SchemaInfo:
    """Get database schema from Convex"""
    convex_config = ConvexConfig(
        url=convex_url,
        token=convex_token,
        database_name=database_name
    )
    
    schema_data = await get_convex_schema(convex_config)
    
    return SchemaInfo(
        tables=schema_data.get('tables', []),
        relationships=schema_data.get('relationships', [])
    )

@app.post("/query")
async def text_to_query(
    request: QueryRequest,
    token: str = Depends(verify_token)
) -> QueryResponse:
    """Convert natural language query to SQL and execute it"""
    start_time = datetime.utcnow()
    
    try:
        logger.info("Processing text-to-query request", query=request.query)
        
        # Get database schema from Convex
        schema_data = await get_convex_schema(request.convex_config)
        
        # Setup Vanna RAG for this client
        vn = await setup_vanna_rag(request.convex_config, schema_data)
        
        # Generate SQL from natural language using Vanna RAG
        generated_sql = vn.ask(request.query)
        
        if not generated_sql or not isinstance(generated_sql, str):
            raise HTTPException(
                status_code=400,
                detail="Could not generate valid SQL from the query"
            )
        
        logger.info("Generated SQL", sql=generated_sql)
        
        # Execute the query on Convex
        results = await execute_convex_query(
            request.convex_config,
            generated_sql,
            request.max_results
        )
        
        execution_time = (datetime.utcnow() - start_time).total_seconds()
        
        response = QueryResponse(
            success=True,
            query=request.query,
            generated_sql=generated_sql,
            results=results,
            execution_time=execution_time,
            row_count=len(results)
        )
        
        # Add explanation if requested
        if request.explain:
            explanation = vn.ask(f"Explain this SQL query: {generated_sql}")
            response.explanation = explanation
        
        logger.info("Query executed successfully", 
                   row_count=len(results), 
                   execution_time=execution_time)
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        execution_time = (datetime.utcnow() - start_time).total_seconds()
        logger.error("Query processing failed", error=str(e), execution_time=execution_time)
        
        return QueryResponse(
            success=False,
            query=request.query,
            generated_sql="",
            results=[],
            execution_time=execution_time,
            row_count=0,
            error=str(e)
        )

@app.post("/train")
async def train_vanna(
    convex_config: ConvexConfig,
    sql_examples: List[str] = None,
    documentation: List[str] = None,
    token: str = Depends(verify_token)
):
    """Train Vanna with additional SQL examples and documentation"""
    try:
        # Get schema and setup Vanna
        schema_data = await get_convex_schema(convex_config)
        vn = await setup_vanna_rag(convex_config, schema_data)
        
        # Train with provided examples
        training_count = 0
        
        if sql_examples:
            for sql in sql_examples:
                vn.train(sql=sql)
                training_count += 1
        
        if documentation:
            for doc in documentation:
                vn.train(documentation=doc)
                training_count += 1
        
        logger.info("Vanna training completed", training_count=training_count)
        
        return {
            "success": True,
            "trained_items": training_count,
            "message": f"Successfully trained Vanna with {training_count} items"
        }
        
    except Exception as e:
        logger.error("Training failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    
    logger.info("Starting Vanna Text-to-Query API", host=host, port=port)
    
    uvicorn.run(
        "app:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
