import TextToQuery from '@/components/TextToQuery';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function QueryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
              Natural Language Database Queries
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ask questions about your business data in plain English and get instant SQL results. 
              Perfect for business users who need quick insights without writing complex queries.
            </p>
          </div>
          
          <div className="mb-8">
            <TextToQuery />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Ask Your Question</h3>
                <p className="text-gray-600 text-sm">
                  Type your question in natural language, just like you would ask a colleague.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">AI Converts to SQL</h3>
                <p className="text-gray-600 text-sm">
                  Vanna.ai understands your question and generates the appropriate SQL query.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-semibold">3</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Get Results</h3>
                <p className="text-gray-600 text-sm">
                  View your data results in a clean, organized table format.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-gray-900">Natural Language Processing</h3>
                  <p className="text-gray-600 text-sm">Ask questions in plain English without SQL knowledge.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-gray-900">Instant Results</h3>
                  <p className="text-gray-600 text-sm">Get query results in seconds with clean table visualization.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-gray-900">Database Schema View</h3>
                  <p className="text-gray-600 text-sm">Explore your database structure to understand available data.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-gray-900">Learning System</h3>
                  <p className="text-gray-600 text-sm">The AI improves over time with more training data.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
