# Vanna.ai Text-to-Query with Convex Integration

This is a complete rewrite of the text-to-query feature using **Vanna.ai** for RAG-based text-to-SQL conversion and **Convex** for database access. 

## ✅ What's New


### ✅ Added (Real AI Implementation)
- **Vanna.ai integration** with ChromaDB for RAG (Retrieval Augmented Generation)
- **Gemini** for natural language processing
- **Convex database integration** for real client databases
- **Dynamic schema loading** from client databases
- **Proper authentication** and security
- **Real-time training** capabilities for domain-specific queries

## Architecture

```
Frontend (Next.js) 
    ↓ (Natural Language Query + Convex Config)
Backend (FastAPI + Vanna.ai)
    ↓ (RAG-enhanced SQL Generation)
Convex Database (Client's Data)
    ↓ (Query Execution)
Results (Displayed to User)
```

## How It Works

1. **Client Configuration**: User provides Convex deployment URL and authentication token
2. **Schema Discovery**: System automatically loads database schema via Convex API
3. **RAG Training**: Vanna.ai uses ChromaDB to store and retrieve relevant schema information
4. **Query Processing**: Natural language is converted to SQL using OpenAI + RAG context
5. **Execution**: SQL is executed on the client's Convex database
6. **Results**: Data and explanations are returned to the frontend

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file:
```env
OPENAI_API_KEY=your-openai-api-key-here
API_KEY=your-secure-api-key-here
HOST=127.0.0.1
PORT=8000
```

Start the server:
```bash
uvicorn app:app --reload
```

### 2. Frontend Integration

The new frontend component (`TextToQueryNew.tsx`) includes:
- Convex configuration inputs
- API key authentication
- Schema viewer
- Real-time query processing
- Results display with explanations

### 3. Client Configuration

Each client needs to provide:
- **Convex Deployment URL**: `https://your-deployment.convex.cloud`
- **Convex Authentication Token**: From their Convex dashboard
- **Database Name**: Usually "main" or custom name

## API Endpoints

### `POST /query`
Convert natural language to SQL and execute on Convex database

**Request:**
```json
{
  "query": "Show me all customers from California",
  "convex_config": {
    "url": "https://client-deployment.convex.cloud",
    "token": "client-auth-token",
    "database_name": "main"
  },
  "max_results": 100,
  "explain": true
}
```

**Response:**
```json
{
  "success": true,
  "query": "Show me all customers from California",
  "generated_sql": "SELECT * FROM customers WHERE state = 'CA'",
  "results": [...],
  "explanation": "This query filters customers by state...",
  "execution_time": 0.245,
  "row_count": 15
}
```

### `GET /schema`
Load database schema from Convex

### `POST /train`
Train Vanna with additional SQL examples and documentation

## Key Features

### 🤖 AI-Powered Query Generation
- Uses OpenAI GPT-4 for natural language understanding
- RAG (Retrieval Augmented Generation) with ChromaDB for context
- Learns from database schema and training examples

### 🔗 Convex Integration
- Direct connection to client Convex databases
- Real-time schema discovery
- Secure token-based authentication

### 📚 Continuous Learning
- Train with domain-specific queries
- Add documentation for better context
- Improve accuracy over time

### 🔒 Security
- API key authentication
- Token-based Convex access
- No data persistence (queries processed in real-time)

## Testing

Run the demo script:
```bash
python demo.py
```

This will test:
- API connectivity
- Schema loading from Convex
- Natural language query processing
- Training capabilities

## Example Queries

The system can handle various types of queries:

- **Simple**: "Show me all users"
- **Aggregation**: "What are the total sales by customer?"
- **Filtering**: "Find customers in California" 
- **Sorting**: "Top 10 customers by revenue"
- **Joins**: "Show user orders with product details"
- **Date ranges**: "Orders from last 30 days"

## Deployment

### Production Considerations

1. **Environment Variables**:
   - Set proper OpenAI API key
   - Configure secure API keys
   - Set appropriate CORS origins

2. **Rate Limiting**: Built-in rate limiting for API calls

3. **Caching**: Vanna instances are cached per client configuration

4. **Logging**: Structured logging with timestamps and context

### Scaling

- Each client gets their own Vanna instance (cached)
- ChromaDB handles vector storage for RAG
- Async processing for better performance

## Troubleshooting

### Common Issues

1. **"Cannot connect to Convex"**
   - Check Convex URL format
   - Verify authentication token
   - Ensure database name is correct

2. **"Could not generate SQL"**
   - Check OpenAI API key
   - Train with more examples
   - Verify schema is loaded

3. **"Query execution failed"**
   - Check SQL syntax in generated query
   - Verify table/column names
   - Review Convex permissions

### Debug Mode

Set `LOG_LEVEL=DEBUG` in `.env` for detailed logging.

## Migration Guide

If you were using the old hardcoded version:

1. **Update Frontend**: Replace `TextToQuery.tsx` with `TextToQueryNew.tsx`
2. **Configure Convex**: Add client database configuration
3. **Set API Keys**: Add OpenAI and authentication keys
4. **Test Queries**: Start with simple queries to verify setup
5. **Train System**: Add domain-specific examples

## Next Steps

1. **Connect Your Database**: Configure Convex with your actual data
2. **Customize Training**: Add business-specific queries and documentation
3. **Deploy**: Set up production environment with proper security
4. **Monitor**: Track query performance and accuracy
5. **Iterate**: Continuously improve with user feedback

---

**Note**: This implementation requires active OpenAI API access and Convex database configuration. The old hardcoded approach has been completely removed in favor of real AI-powered text-to-SQL conversion.
