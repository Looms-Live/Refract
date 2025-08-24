import React from 'react'
import Link from 'next/link'
import { Search, FileText, MessageCircle, BarChart3, Link2, Shield } from 'lucide-react'

function Features() {
  const features = [
    {
      title: "Natural Language Queries",
      description: "Ask questions about your business data in plain English and get instant SQL results.",
      icon: Search,
      link: "/query",
      isNew: true
    },
    {
      title: "Document Ingestion",
      description: "Reads PDFs, emails, and files from Google Drive automatically.",
      icon: FileText,
      link: "#"
    },
    {
      title: "Conversational Interface",
      description: "Ask questions in natural language and get precise, cited answers.",
      icon: MessageCircle,
      link: "#"
    },
    {
      title: "Custom Reports",
      description: "Generate structured, actionable reports from your business data.",
      icon: BarChart3,
      link: "#"
    },
    {
      title: "Cross-Document Reasoning",
      description: "Combine information from multiple sources for comprehensive insights.",
      icon: Link2,
      link: "#"
    },
    {
      title: "Data Privacy",
      description: "All documents and insights remain secure within your organization.",
      icon: Shield,
      link: "#"
    }
  ]

  return (
    <section className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Smart Features, Smarter Business.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your business data into actionable insights with our AI-powered tools.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="relative">
                <Link href={feature.link} className={`block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6 border-2 ${feature.isNew ? 'border-teal-600 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-200'}`}>
                  {feature.isNew && (
                    <div className="absolute -top-3 -right-3 bg-teal-700 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      NEW
                    </div>
                  )}
                  <div className="mb-4">
                    <IconComponent className="w-10 h-10 text-teal-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  {feature.isNew && (
                    <div className="mt-4 inline-flex items-center text-teal-700 text-sm font-medium">
                      Try it now →
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/query" 
            className="inline-flex items-center px-6 py-3 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors shadow-md hover:shadow-lg"
          >
            Try Text-to-Query
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Features
