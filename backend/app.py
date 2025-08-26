"""
Simplified Text-to-Query API with Supabase Integration
Converts natural language to SQL queries and executes them on Supabase
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import os
import logging
from dotenv import load_dotenv
from gemini_sql import GeminiTextToSQL
from supabase_manager import SupabaseManager
from datetime import datetime

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Simple Text-to-Query API",
    description="Convert natural language to SQL queries and execute on Supabase",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://generativelanguage.googleapis.com", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Initialize services
supabase_manager = SupabaseManager()
gemini_sql = GeminiTextToSQL()

# Pydantic models
class SimpleQueryRequest(BaseModel):
    """Simple query request"""
    query: str = Field(..., description="Natural language query")
    max_results: int = Field(default=10, description="Maximum results to return")
    explain: bool = Field(default=True, description="Include AI explanation of the SQL")

class SimpleQueryResponse(BaseModel):
    """Simple query response"""
    success: bool
    query: str
    generated_sql: str = ""
    results: List[Dict[str, Any]]
    explanation: Optional[str] = None
    execution_time: float
    row_count: int
    error: Optional[str] = None

# Helper Functions
def _get_fallback_sql(query: str) -> Optional[str]:
    """Generate simple fallback SQL for common queries when AI is unavailable"""
    query_lower = query.lower().strip()
    
    # Customer queries
    if 'show' in query_lower and 'customer' in query_lower:
        return "SELECT * FROM customers LIMIT 10"
    elif 'count' in query_lower and 'customer' in query_lower:
        return "SELECT COUNT(*) as count FROM customers"
    elif 'list' in query_lower and 'customer' in query_lower:
        return "SELECT * FROM customers LIMIT 10"
    elif 'all customer' in query_lower:
        return "SELECT * FROM customers"
    elif 'customer' in query_lower and ('high' in query_lower or 'revenue' in query_lower):
        return "SELECT * FROM customers WHERE revenue > 10000 ORDER BY revenue DESC LIMIT 10"
    elif 'customer' in query_lower:
        return "SELECT * FROM customers LIMIT 10"
    
    # Order queries  
    elif 'show' in query_lower and 'order' in query_lower:
        return "SELECT * FROM orders LIMIT 10"
    elif 'count' in query_lower and 'order' in query_lower:
        return "SELECT COUNT(*) as count FROM orders"
    elif 'list' in query_lower and 'order' in query_lower:
        return "SELECT * FROM orders LIMIT 10"
    elif 'all order' in query_lower:
        return "SELECT * FROM orders"
    elif 'order' in query_lower:
        return "SELECT * FROM orders LIMIT 10"
    
    # Generic patterns
    elif 'show' in query_lower:
        return "SELECT * FROM customers LIMIT 5"
    elif 'count' in query_lower:
        return "SELECT COUNT(*) as count FROM customers"
    elif 'list' in query_lower:
        return "SELECT * FROM customers LIMIT 5"
    else:
        return None

# API Endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "simple-text-to-query"
    }

@app.post("/simple-query")
async def simple_text_to_query(request: SimpleQueryRequest) -> SimpleQueryResponse:
    """
    Simple text-to-query endpoint that works directly with Supabase
    No complex configuration required - perfect for testing!
    """
    start_time = datetime.utcnow()
    
    try:
        logger.info(f"Processing query: {request.query}")
        
        # Try to generate SQL using Gemini
        generated_sql = ""
        try:
            generated_sql = gemini_sql.generate_sql(request.query)
            logger.info(f"Generated SQL using Gemini: {generated_sql}")
        except Exception as e:
            # Handle API quota or other Gemini errors
            logger.warning(f"Gemini API failed: {str(e)[:100]}...")
            if "quota" in str(e).lower() or "429" in str(e):
                # Try simple query patterns when AI is unavailable
                fallback_sql = _get_fallback_sql(request.query)
                if fallback_sql:
                    generated_sql = fallback_sql
                    logger.info(f"Using fallback SQL: {fallback_sql}")
                else:
                    return SimpleQueryResponse(
                        success=False,
                        query=request.query,
                        generated_sql="",
                        results=[{
                            "error": "AI service temporarily unavailable",
                            "message": "Please try again in a moment, or use simpler queries",
                            "suggestions": [
                                "Try: 'show customers'",
                                "Try: 'count customers'", 
                                "Try: 'list all customers'",
                                "Try: 'show orders'"
                            ]
                        }],
                        execution_time=0,
                        row_count=1,
                        error="AI quota exceeded - try simpler queries or wait a moment"
                    )
            else:
                # For other errors, try fallback first
                fallback_sql = _get_fallback_sql(request.query)
                if fallback_sql:
                    generated_sql = fallback_sql
                    logger.info(f"Using fallback SQL due to other error: {fallback_sql}")
                else:
                    raise e
        
        # Ensure we have valid SQL
        if not generated_sql or "ERROR:" in generated_sql or "Failed to generate" in generated_sql:
            # Use fallback SQL if no valid SQL generated
            fallback_sql = _get_fallback_sql(request.query)
            if fallback_sql:
                generated_sql = fallback_sql
                logger.info(f"Using fallback SQL as final option: {fallback_sql}")
            else:
                generated_sql = "SELECT 'Query pattern not recognized' as message, 'Try: show customers, count customers, show orders' as suggestion"
        
        # Execute the query directly on Supabase
        results = await supabase_manager.execute_sql_query(generated_sql, request.max_results)
        
        execution_time = (datetime.utcnow() - start_time).total_seconds()
        
        response = SimpleQueryResponse(
            success=True,
            query=request.query,
            generated_sql=generated_sql,
            results=results,
            execution_time=execution_time,
            row_count=len(results)
        )
        
        # Add explanation if requested and AI is available
        if request.explain:
            try:
                explanation = gemini_sql.explain_sql(generated_sql)
                response.explanation = explanation
            except:
                response.explanation = "AI explanation temporarily unavailable"
        
        logger.info(f"Query executed successfully - {len(results)} rows in {execution_time:.2f}s")
        return response
        
    except Exception as e:
        execution_time = (datetime.utcnow() - start_time).total_seconds()
        logger.error(f"Query processing failed: {str(e)}")
        
        return SimpleQueryResponse(
            success=False,
            query=request.query,
            generated_sql="",
            results=[],
            execution_time=execution_time,
            row_count=0,
            error=str(e)
        )

# Startup
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
