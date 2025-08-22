"use client"
import React, { useState, useEffect } from 'react'

function Pricing() {
  const [isIndianUser, setIsIndianUser] = useState(false)

  useEffect(() => {
    // Check if user is from India with IP geolocation
    const checkUserLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        setIsIndianUser(data.country_code === 'IN')
      } catch {
        // Fallback: check timezone for Indian users
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        setIsIndianUser(timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta'))
      }
    }
    checkUserLocation()
  }, [])

  const plans = [
    {
      name: "Essentials",
      price: "$0",
      priceINR: "₹0",
      period: "forever",
      description: "Perfect for individuals getting started with AI document analysis",
      features: [
        "5 documents per month",
        "Basic Q&A functionality",
        "Standard citations",
        "Email support",
        "Web app access"
      ],
      cta: "Start Free",
      popular: false,
      color: "gray"
    },
    {
      name: "Professional",
      price: "$29",
      priceINR: "₹999",
      period: "per month",
      description: "Ideal for professionals and teams who need regular document analysis",
      features: [
        "50 documents per month",
        "Advanced Q&A with reasoning",
        "Basic report generation",
        "Google Drive integration",
        "Priority email support",
        "Standard citations"
      ],
      cta: "Start Trial",
      popular: false,
      color: "blue"
    },
    {
      name: "Business",
      price: "$99",
      priceINR: "₹5,199",
      period: "per month",
      description: "For growing teams who need comprehensive document analysis capabilities",
      features: [
        "200 documents per month",
        "Advanced AI reasoning",
        "Custom report generation",
        "Multiple integrations",
        "Team collaboration tools",
        "Priority support",
        "Advanced analytics"
      ],
      cta: "Start Trial",
      popular: true,
      color: "teal"
    },
    {
      name: "Enterprise",
      price: "Custom",
      priceINR: "Custom",
      period: "pricing",
      description: "For organizations requiring advanced security, compliance, and custom features",
      features: [
        "Unlimited documents",
        "Custom AI model training",
        "SSO & SAML integration",
        "Advanced security controls",
        "Dedicated account manager",
        "Custom integrations",
        "24/7 phone support",
        "Compliance certifications"
      ],
      cta: "Contact Sales",
      popular: false,
      color: "gray"
    }
  ]

  const getColorClasses = (color: string, popular: boolean) => {
    if (popular) {
      return {
        border: "border-teal-500 border-2",
        button: "bg-teal-700 hover:bg-teal-800 text-white",
        price: "text-teal-700"
      }
    }
    
    const colorMap = {
      gray: {
        border: "border-gray-200",
        button: "bg-gray-900 hover:bg-gray-800 text-white",
        price: "text-gray-900"
      },
      teal: {
        border: "border-gray-200",
        button: "bg-teal-700 hover:bg-teal-800 text-white",
        price: "text-teal-700"
      }
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.gray
  }

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs. Start free, upgrade anytime, cancel whenever.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const colors = getColorClasses(plan.color, plan.popular)
            return (
              <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg relative ${colors.border} flex flex-col h-full`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-teal-700 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className={`text-4xl font-bold ${colors.price}`}>
                      {isIndianUser ? plan.priceINR : plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <button className={`w-full py-4 px-6 rounded-xl font-semibold transition-colors ${colors.button}`}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Pricing
