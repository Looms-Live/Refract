"""
Simple test for Supabase connection and real data
Tests the cleaned backend with actual Supabase tables
"""

import os
import sys
import asyncio
from pathlib import Path

# Add parent directory to path to import our modules
parent_dir = Path(__file__).parent
sys.path.append(str(parent_dir))

from supabase_manager import SupabaseManager
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(parent_dir.parent, '.env.local'))

async def test_supabase_connection():
    """Test Supabase connection and real data queries"""
    print("🔗 Testing Supabase Real Data Connection")
    print("=" * 60)
    
    # Initialize Supabase manager
    sb = SupabaseManager()
    
    if not sb.is_connected():
        print("❌ Supabase not connected - check .env.local credentials")
        return False
    
    print(f"✅ Connected to Supabase: {sb.url[:30]}...")
    
    # Test queries
    test_queries = [
        ("SELECT * FROM customers LIMIT 5", "Show first 5 customers"),
        ("SELECT COUNT(*) as count FROM customers", "Count all customers"),
        ("SELECT * FROM customers WHERE revenue > 10000", "High revenue customers"),
        ("SELECT * FROM orders LIMIT 3", "Show first 3 orders"),
        ("SELECT COUNT(*) as count FROM orders", "Count all orders"),
    ]
    
    print("\n📊 Testing Real Data Queries:")
    print("-" * 60)
    
    for sql, description in test_queries:
        try:
            print(f"\n🔍 {description}")
            print(f"SQL: {sql}")
            
            results = await sb.execute_sql_query(sql, max_results=5)
            
            if results and len(results) > 0:
                print(f"✅ Results: {len(results)} rows")
                
                # Show first result
                first_result = results[0]
                if 'error' in first_result:
                    print(f"⚠️  Error: {first_result['error']}")
                elif 'message' in first_result and 'Mock data' in str(first_result.get('message', '')):
                    print(f"⚠️  Still using mock data: {first_result}")
                else:
                    print(f"💫 Real data sample: {first_result}")
            else:
                print("⚠️  No results returned")
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")
    
    print("\n" + "=" * 60)
    print("🎉 Supabase Connection Test Complete!")
    return True

async def main():
    """Main test function"""
    success = await test_supabase_connection()
    
    if success:
        print("\n🚀 Next Steps:")
        print("1. Start the backend: python -m uvicorn app:app --reload --port 8000")
        print("2. Test API: POST to http://localhost:8000/query")
        print("3. Use frontend to test text-to-query with real data")
    else:
        print("\n🔧 Setup Required:")
        print("1. Verify Supabase credentials in .env.local")
        print("2. Create customers and orders tables in Supabase dashboard")
        print("3. Add sample data to tables")

if __name__ == "__main__":
    asyncio.run(main())
