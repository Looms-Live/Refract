'use client';

import React, { useState } from 'react';

interface ConvexConfig {
  url: string;
  token: string;
  database_name: string;
}

interface QueryRequest {
  query: string;
  convex_config: ConvexConfig;
  max_results?: number;
  explain?: boolean;
}

interface QueryResult {
  success: boolean;
  query: string;
  generated_sql: string;
  results: any[];
  explanation?: string;
  execution_time: number;
  row_count: number;
  error?: string;
}

interface SchemaTable {
  name: string;
  schema: {
    columns: {
      name: string;
      type: string;
    }[];
  };
  description?: string;
}

interface DatabaseSchema {
  tables: SchemaTable[];
  relationships: any[];
}

const TextToQuery: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [schema, setSchema] = useState<DatabaseSchema | null>(null);
  const [showSchema, setShowSchema] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  
  // Convex configuration
  const [convexConfig, setConvexConfig] = useState<ConvexConfig>({
    url: '',
    token: '',
    database_name: 'main'
  });
  
  // API configuration
  const [apiKey, setApiKey] = useState('');
  const API_BASE_URL = 'http://localhost:8000';

  const handleQuery = async () => {
    if (!query.trim() || !convexConfig.url || !convexConfig.token || !apiKey) {
      alert('Please fill in all required fields: query, Convex URL, token, and API key');
      return;
    }

    setLoading(true);
    try {
      const requestBody: QueryRequest = {
        query,
        convex_config: convexConfig,
        max_results: 100,
        explain: true
      };

      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: QueryResult = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        query: query,
        generated_sql: '',
        results: [],
        execution_time: 0,
        row_count: 0,
        error: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSchema = async () => {
    if (!convexConfig.url || !convexConfig.token || !apiKey) {
      alert('Please configure Convex settings and API key first');
      return;
    }

    try {
      const params = new URLSearchParams({
        convex_url: convexConfig.url,
        convex_token: convexConfig.token,
        database_name: convexConfig.database_name
      });

      const response = await fetch(`${API_BASE_URL}/schema?${params}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: DatabaseSchema = await response.json();
      setSchema(data);
      setShowSchema(true);
    } catch (error) {
      console.error('Error loading schema:', error);
      alert(`Error loading schema: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const exampleQuestions = [
    "Show me all customers",
    "What are the total sales by customer?",
    "How many orders do we have by status?",
    "Who are our top customers by order value?",
    "What products are selling the most?"
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Vanna.ai Text to Query
        </h1>
        <p className="text-gray-600">
          Ask questions about your Convex database in natural language using AI-powered text-to-SQL conversion.
        </p>
      </div>

      {/* Configuration Section */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-blue-900">Configuration</h3>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-blue-600 hover:text-blue-800"
          >
            {showConfig ? 'Hide' : 'Show'} Config
          </button>
        </div>
        
        {showConfig && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key (for Text-to-Query service)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Convex Deployment URL
              </label>
              <input
                type="url"
                value={convexConfig.url}
                onChange={(e) => setConvexConfig({...convexConfig, url: e.target.value})}
                placeholder="https://your-deployment.convex.cloud"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Convex Token
              </label>
              <input
                type="password"
                value={convexConfig.token}
                onChange={(e) => setConvexConfig({...convexConfig, token: e.target.value})}
                placeholder="Enter your Convex token"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Database Name
              </label>
              <input
                type="text"
                value={convexConfig.database_name}
                onChange={(e) => setConvexConfig({...convexConfig, database_name: e.target.value})}
                placeholder="main"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Query Input */}
      <div className="mb-6">
        <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
          Ask a question about your data:
        </label>
        <div className="flex gap-2">
          <input
            id="query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What are my top customers by revenue?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleQuery()}
          />
          <button
            onClick={handleQuery}
            disabled={loading || !query.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Query'}
          </button>
        </div>
      </div>

      {/* Example Questions */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Try these example questions:</h3>
        <div className="flex flex-wrap gap-2">
          {exampleQuestions.map((example, index) => (
            <button
              key={index}
              onClick={() => setQuery(example)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Schema Toggle */}
      <div className="mb-6">
        <button
          onClick={loadSchema}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          {showSchema ? 'Hide Schema' : 'Show Database Schema'}
        </button>
      </div>

      {/* Database Schema */}
      {showSchema && schema && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Database Schema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schema.tables.map((table, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <h4 className="font-medium text-blue-600 mb-2">{table.name}</h4>
                <div className="space-y-1">
                  {table.schema.columns.map((column, colIndex) => (
                    <div key={colIndex} className="flex justify-between text-sm">
                      <span>{column.name}</span>
                      <span className="text-gray-500">{column.type}</span>
                    </div>
                  ))}
                </div>
                {table.description && (
                  <p className="text-xs text-gray-600 mt-2">{table.description}</p>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowSchema(false)}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Hide Schema
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Success/Error Status */}
          <div className={`p-3 rounded-lg ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {result.success ? '✓ Query executed successfully' : '✗ Query failed'}
              </span>
              <span className="text-sm">
                {result.execution_time.toFixed(3)}s • {result.row_count} rows
              </span>
            </div>
          </div>

          {/* Generated SQL */}
          {result.generated_sql && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Generated SQL:</h3>
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{result.generated_sql}</pre>
            </div>
          )}

          {/* Explanation */}
          {result.explanation && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">AI Explanation:</h3>
              <p className="text-blue-800">{result.explanation}</p>
            </div>
          )}

          {/* Error */}
          {result.error && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-900 mb-2">Error:</h3>
              <p className="text-red-800">{result.error}</p>
            </div>
          )}

          {/* Results Table */}
          {result.results && result.results.length > 0 && (
            <div className="bg-white border rounded-lg overflow-hidden">
              <h3 className="text-sm font-medium p-4 bg-gray-50 border-b">Query Results:</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(result.results[0]).map((key) => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {result.results.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {value?.toString() || 'N/A'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {result.success && result.results && result.results.length === 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800">No results found for your query.</p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <h4 className="font-medium mb-2">How to use:</h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>Configure your Convex database connection and API key above</li>
          <li>Optionally load your database schema to see available tables</li>
          <li>Ask questions about your data in natural language</li>
          <li>The AI will generate SQL queries and execute them on your database</li>
          <li>View results, explanations, and generated SQL</li>
        </ol>
      </div>
    </div>
  );
};

export default TextToQuery;
