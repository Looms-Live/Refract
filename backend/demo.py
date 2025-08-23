"""
Demo script for Vanna.ai Text-to-Query with Convex Integration
* Not for production only for debugging and testing purposes*
"""

import httpx
import json
import asyncio
from typing import Dict, Any

# Configuration
API_BASE_URL = "http://localhost:8000"
API_KEY = "your-secret-api-key"  # Replace with your API key
CONVEX_CONFIG = {
    "url": "https://your-deployment.convex.cloud",  # Replace with your Convex URL
    "token": "your-convex-token",  # Replace with your Convex token
    "database_name": "main"
}

async def test_health():
    """Test if the API is running"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{API_BASE_URL}/health")
            if response.status_code == 200:
                print("✓ API is healthy")
                return True
            else:
                print(f"✗ API health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"✗ Cannot connect to API: {e}")
            return False

async def test_schema():
    """Test loading database schema from Convex"""
    async with httpx.AsyncClient() as client:
        try:
            params = {
                "convex_url": CONVEX_CONFIG["url"],
                "convex_token": CONVEX_CONFIG["token"],
                "database_name": CONVEX_CONFIG["database_name"]
            }
            
            response = await client.get(
                f"{API_BASE_URL}/schema",
                headers={"Authorization": f"Bearer {API_KEY}"},
                params=params
            )
            
            if response.status_code == 200:
                schema = response.json()
                print("✓ Schema loaded successfully")
                print(f"  Found {len(schema.get('tables', []))} tables")
                for table in schema.get('tables', [])[:3]:  # Show first 3 tables
                    print(f"  - {table.get('name', 'Unknown')} ({len(table.get('schema', {}).get('columns', []))} columns)")
                return True
            else:
                error_data = response.json()
                print(f"✗ Schema loading failed: {error_data.get('detail', 'Unknown error')}")
                return False
                
        except Exception as e:
            print(f"✗ Schema test error: {e}")
            return False

async def test_query(natural_language_query: str):
    """Test natural language to SQL conversion and execution"""
    async with httpx.AsyncClient() as client:
        try:
            request_data = {
                "query": natural_language_query,
                "convex_config": CONVEX_CONFIG,
                "max_results": 10,
                "explain": True
            }
            
            response = await client.post(
                f"{API_BASE_URL}/query",
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json"
                },
                json=request_data,
                timeout=30.0
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✓ Query processed successfully")
                print(f"  Natural Language: {natural_language_query}")
                print(f"  Generated SQL: {result.get('generated_sql', 'N/A')}")
                print(f"  Success: {result.get('success', False)}")
                print(f"  Execution Time: {result.get('execution_time', 0):.3f}s")
                print(f"  Row Count: {result.get('row_count', 0)}")
                
                if result.get('explanation'):
                    print(f"  AI Explanation: {result['explanation']}")
                
                if result.get('error'):
                    print(f"  Error: {result['error']}")
                elif result.get('results'):
                    print(f"  Sample Results: {json.dumps(result['results'][:2], indent=2)}")
                
                return True
            else:
                error_data = response.json()
                print(f"✗ Query failed: {error_data.get('detail', 'Unknown error')}")
                return False
                
        except Exception as e:
            print(f"✗ Query test error: {e}")
            return False

async def test_training():
    """Test training Vanna with additional examples"""
    async with httpx.AsyncClient() as client:
        try:
            training_data = {
                "convex_config": CONVEX_CONFIG,
                "sql_examples": [
                    "SELECT COUNT(*) FROM users WHERE active = true",
                    "SELECT name, email FROM customers ORDER BY created_at DESC"
                ],
                "documentation": [
                    "The users table contains user account information with an active boolean field",
                    "The customers table stores customer contact information and registration dates"
                ]
            }
            
            response = await client.post(
                f"{API_BASE_URL}/train",
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json"
                },
                json=training_data
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✓ Training completed successfully")
                print(f"  Items trained: {result.get('trained_items', 0)}")
                print(f"  Message: {result.get('message', 'N/A')}")
                return True
            else:
                error_data = response.json()
                print(f"✗ Training failed: {error_data.get('detail', 'Unknown error')}")
                return False
                
        except Exception as e:
            print(f"✗ Training test error: {e}")
            return False

async def run_demo():
    """Run the complete demo"""
    print("🚀 Vanna.ai Text-to-Query Demo")
    print("=" * 50)
    
    # Check if API is running
    print("\n1. Testing API Health...")
    if not await test_health():
        print("❌ API is not running. Please start it with: uvicorn app:app --reload")
        return
    
    # Test schema loading
    print("\n2. Testing Schema Loading...")
    if not await test_schema():
        print("⚠️ Schema loading failed. Check your Convex configuration.")
    
    # Test queries
    print("\n3. Testing Natural Language Queries...")
    test_queries = [
        "Show me all users",
        "What are the top 5 customers by registration date?",
        "How many active users do we have?",
        "List all orders from the last 30 days"
    ]
    
    for query in test_queries:
        print(f"\nTesting: '{query}'")
        await test_query(query)
    
    # Test training
    print("\n4. Testing Vanna Training...")
    await test_training()
    
    print("\n✅ Demo completed!")
    print("\n" + "=" * 50)
    print("Next steps:")
    print("1. Update CONVEX_CONFIG with your actual Convex deployment details")
    print("2. Set your OpenAI API key in the .env file")
    print("3. Use the frontend component to interact with your database")
    print("4. Train Vanna with your specific queries and documentation")

async def simple_query_test():
    """Simple query test for debugging"""
    query = "show me all users"
    print(f"Testing simple query: {query}")
    
    # Test without actual Convex (mock response)
    print("Note: This will fail without proper Convex configuration")
    await test_query(query)

if __name__ == "__main__":
    print("Vanna.ai Text-to-Query Demo")
    print("Make sure to:")
    print("1. Start the API server: uvicorn app:app --reload")
    print("2. Update CONVEX_CONFIG with your details")
    print("3. Set your API_KEY")
    print("4. Set OPENAI_API_KEY in .env file")
    print()
    
    # Run the demo
    asyncio.run(run_demo())
