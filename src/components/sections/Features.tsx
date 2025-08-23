import React from 'react'
import Link from 'next/link'

function Features() {
  const features = [
    {
      title: "Natural Language Queries",
      description: "Ask questions about your business data in plain English and get instant SQL results.",
      icon: "🔍",
      link: "/query",
      isNew: true
    },
    {
      title: "Document Ingestion",
      description: "Reads PDFs, emails, and files from Google Drive automatically.",
      icon: "📄",
      link: "#"
    },
    {
      title: "Conversational Interface",
      description: "Ask questions in natural language and get precise, cited answers.",
      icon: "💬",
      link: "#"
    },
    {
      title: "Custom Reports",
      description: "Generate structured, actionable reports from your business data.",
      icon: "📊",
      link: "#"
    },
    {
      title: "Cross-Document Reasoning",
      description: "Combine information from multiple sources for comprehensive insights.",
      icon: "🔗",
      link: "#"
    },
    {
      title: "Data Privacy",
      description: "All documents and insights remain secure within your organization.",
      icon: "🔒",
      link: "#"
    }
  ]

  return (
    <section className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Powerful AI Features for Small Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your business data into actionable insights with our AI-powered tools.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="relative">
              <Link href={feature.link} className={`block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6 border-2 ${feature.isNew ? 'border-blue-500 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-200'}`}>
                {feature.isNew && (
                  <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    NEW
                  </div>
                )}
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
                {feature.isNew && (
                  <div className="mt-4 inline-flex items-center text-blue-600 text-sm font-medium">
                    Try it now →
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/query" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            🚀 Try Text-to-Query Feature
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Features
