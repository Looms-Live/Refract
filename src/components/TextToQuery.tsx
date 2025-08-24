'use client';

import React, { useState } from 'react';

interface QueryResult {
  sql: string;
  results: Record<string, unknown>[];
  explanation?: string;
  success: boolean;
  error?: string;
}

interface SchemaTable {
  name: string;
  columns: Array<{
    name: string;
    type: string;
  }>;
}

interface SchemaInfo {
  tables: SchemaTable[];
  relationships: Array<{
    from_table: string;
    to_table: string;
    foreign_key: string;
    primary_key: string;
  }>;
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
  const [apiKey, setApiKey] = useState<string>('dev-secret-key-123');
  const [convexUrl, setConvexUrl] = useState<string>('');
  const [convexToken, setConvexToken] = useState<string>('');
  const [databaseName, setDatabaseName] = useState<string>('main');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [schema, setSchema] = useState<SchemaInfo | null>(null);
  const [showConfig, setShowConfig] = useState<boolean>(true);

  const loadSchema = async () => {
    if (!convexUrl || !convexToken) {
      alert('Please provide Convex URL and Token');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/schema?convex_url=${encodeURIComponent(convexUrl)}&convex_token=${encodeURIComponent(convexToken)}&database_name=${encodeURIComponent(databaseName)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json() as SchemaInfo;
      
      if (response.ok) {
        setSchema(data);
      } else {
        console.error('Failed to load schema:', data);
        alert('Failed to load database schema');
      }
    } catch (error) {
      console.error('Error loading schema:', error);
      alert('Error connecting to API');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      alert('Please enter a question');
      return;
    }

    if (!convexUrl || !convexToken) {
      alert('Please configure Convex connection');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          query: query.trim(),
          convex_config: {
            url: convexUrl,
            token: convexToken,
            database_name: databaseName
          },
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
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    "How many customers do we have?",
    "Show me the top 5 customers by revenue",
    "What are our recent orders?",
    "List all products and their prices",
    "Who are our customers from California?",
    "What's our total revenue this month?"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI-Powered Text to Query
        </h1>
        <p className="text-gray-600">
          Ask questions about your data in plain English, powered by Vanna.ai and Gemini 2.0 Flash
        </p>
      </div>

      {/* Configuration Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Configuration</h2>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {showConfig ? 'Hide' : 'Show'} Config
          </button>
        </div>
        
        {showConfig && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Convex URL
              </label>
              <input
                type="text"
                value={convexUrl}
                onChange={(e) => setConvexUrl(e.target.value)}
                placeholder="https://your-deployment.convex.cloud"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Convex Token
              </label>
              <input
                type="password"
                value={convexToken}
                onChange={(e) => setConvexToken(e.target.value)}
                placeholder="Your Convex token"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Database Name
              </label>
              <input
                type="text"
                value={databaseName}
                onChange={(e) => setDatabaseName(e.target.value)}
                placeholder="main"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Your API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex space-x-3">
          <button
            onClick={loadSchema}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load Schema'}
          </button>
        </div>
      </div>

      {/* Schema Display */}
      {schema && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Database Schema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schema.tables.map((table) => (
              <div key={table.name} className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2">{table.name}</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {table.columns.map((column) => (
                    <li key={column.name} className="flex justify-between">
                      <span>{column.name}</span>
                      <span className="text-gray-500">{column.type}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Query Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="flex space-x-4">
          <input
            id="question"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What are my top customers by revenue?"
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
              {result.explanation && (
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
          <li>Configure your Convex database connection above</li>
          <li>Click &quot;Load Schema&quot; to discover your database structure</li>
          <li>Type your question in plain English</li>
          <li>Click &quot;Ask&quot; to convert to SQL and get results</li>
          <li>Review the generated SQL, explanation, and data</li>
        </ol>
        <p className="text-blue-700 mt-3 text-sm">
          <strong>Tip:</strong> The AI learns from your database schema to generate accurate queries.
          Be specific in your questions for best results.
        </p>
      </div>
    </div>
  );
};

export default TextToQuery;
