'use client';

import React, { useState } from 'react';

interface QueryResult {
  sql: string;
  results: Record<string, unknown>[];
  explanation?: string;
  success: boolean;
  error?: string;
}

interface ApiResponse {
  success: boolean;
  query: string;
  generated_sql: string;
  results: Record<string, unknown>[];
  explanation?: string;
  execution_time: number;
  row_count: number;
  error?: string;
}

const TextToQuery: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Get API URL from environment variable
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      alert('Please enter a question');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${apiUrl}/simple-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          max_results: 100,
          explain: true
        }),
      });

      const data = await response.json() as ApiResponse;
      
      if (response.ok) {
        setResult({
          sql: data.generated_sql,
          results: data.results,
          explanation: data.explanation,
          success: data.success,
          error: data.error
        });
      } else {
        setResult({
          sql: '',
          results: [],
          success: false,
          error: data.error || 'Query failed'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setResult({
        sql: '',
        results: [],
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed. Make sure the backend server is running on port 8000.'
      });
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    "Show me all customers",
    "Count all customers",
    "List customers with high revenue", 
    "Show me all orders",
    "Count all orders"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI-Powered Text to Query
        </h1>
        <p className="text-gray-600">
          Ask questions about your data in plain English. Connected to real Supabase database with smart fallbacks.
        </p>
      </div>

      {/* Query Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="flex space-x-4">
          <input
            id="question"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Show me customers with high revenue"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : 'Ask'}
          </button>
        </div>

        {/* Example Questions */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Try these example questions:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setQuery(example)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                disabled={loading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Results</h3>
          
          {result.success ? (
            <div className="space-y-4">
              {/* Generated SQL */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Generated SQL:</h4>
                <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto border">
                  <code>{result.sql}</code>
                </pre>
              </div>

              {/* Explanation */}
              {result.explanation && !result.explanation.includes('ERROR') && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Explanation:</h4>
                  <p className="text-gray-600 bg-blue-50 p-3 rounded-lg">{result.explanation}</p>
                </div>
              )}

              {/* Data Results */}
              {result.results && result.results.length > 0 ? (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Data ({result.results.length} rows):
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(result.results[0]).map((key) => (
                            <th key={key} className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.results.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            {Object.values(row).map((value, valueIndex) => (
                              <td key={valueIndex} className="px-4 py-2 text-sm text-gray-900 border-b">
                                {value !== null ? String(value) : 'NULL'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Data:</h4>
                  <p className="text-gray-500 italic">No data returned</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-600">
              <h4 className="font-medium mb-2">Error:</h4>
              <p>{result.error}</p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
        <ol className="text-blue-800 space-y-2 list-decimal list-inside">
          <li>Type your question in plain English</li>
          <li>Click &quot;Ask&quot; to convert to SQL and get results</li>
          <li>Review the generated SQL and real database results</li>
        </ol>
        <div className="bg-white rounded-lg p-3 mt-3">
          <p className="text-blue-700 text-sm mb-2">
            <strong>Available Data:</strong>
          </p>
          <div className="text-xs text-blue-600 space-y-1">
            <div><strong>customers</strong>: id, name, email, company, city, state, revenue, created_at</div>
            <div><strong>orders</strong>: id, customer_id, product_name, amount, status, order_date</div>
          </div>
        </div>
        <p className="text-blue-700 mt-3 text-sm">
          <strong>Note:</strong> System uses AI when available, with smart fallbacks when API limits are reached.
        </p>
      </div>
    </div>
  );
};

export default TextToQuery;
