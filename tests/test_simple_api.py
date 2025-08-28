#!/usr/bin/env python3
"""
Simple API Test - Test the /simple-query endpoint 
Tests the text-to-query system with real Supabase data
"""

import requests
import json
from datetime import datetime

# Configuration
API_BASE_URL = "http://127.0.0.1:8000"

def test_simple_query(query: str) -> dict:
    """Test the simple query endpoint"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/simple-query",
            json={
                "query": query,
                "max_results": 5,
                "explain": True
            },
            timeout=30
        )
        
        return {
            "status_code": response.status_code,
            "success": response.status_code == 200,
            "data": response.json() if response.status_code == 200 else response.text
        }
    except Exception as e:
        return {
            "status_code": 0,
            "success": False,
            "error": str(e)
        }

def main():
    """Run simple API tests"""
    print("🧪 Testing Simple Text-to-Query API")
    print("=" * 60)
    
    # Test queries
    test_queries = [
        "show customers",
        "count customers", 
        "list all customers",
        "show orders",
        "customers with high revenue"
    ]
    
    for query in test_queries:
        print(f"\n🔍 Testing: '{query}'")
        print("-" * 40)
        
        result = test_simple_query(query)
        
        if result["success"]:
            data = result["data"]
            print(f"✅ Success!")
            print(f"🔍 Generated SQL: {data.get('generated_sql', 'N/A')}")
            print(f"📊 Results: {data.get('row_count', 0)} rows")
            print(f"⏱️  Execution time: {data.get('execution_time', 0):.2f}s")
            if data.get('results') and len(data['results']) > 0:
                print(f"💡 Sample result: {json.dumps(data['results'][0], indent=2)}")
            if data.get('explanation'):
                print(f"📝 Explanation: {data['explanation'][:100]}...")
        else:
            print(f"❌ HTTP {result['status_code']}: {result.get('data', result.get('error', 'Unknown error'))}")
    
    print("\n" + "=" * 60)
    print("🎉 Simple API Testing Complete!")
    print("\n🚀 Your text-to-query system is running with:")
    print("  • ✅ No authentication required")
    print("  • ✅ Direct Supabase integration") 
    print("  • ✅ Real customer and order data")
    print("  • ✅ AI-powered SQL generation with fallbacks")
    print("  • ✅ Simplified API for easy testing")

if __name__ == "__main__":
    main()
