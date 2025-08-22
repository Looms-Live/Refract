import React from 'react'

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: "How does your service work?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum."
  },
  {
    question: "Is there a mobile app?",
    answer: "Cras placerat ultricies sem, ac pellentesque mauris. Donec fermentum, sapien a fringilla elementum, justo arcu."
  },
  {
    question: "Can I import files from other platforms?",
    answer: "Suspendisse potenti. Fusce vulputate, ligula at convallis tincidunt, sapien justo tempor elit, vel dapibus."
  },
  {
    question: "Do you offer customer support?",
    answer: "Praesent ac sem eget est egestas volutpat. Nullam quis risus eget urna mollis ornare vel eu leo."
  }
]

function FAQ() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Everything you need to know about our document analysis platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-black mb-3 text-lg">
                {faq.question}
              </h3>
              <p className="text-black leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-black mb-6">
            Still have questions? We&apos;re here to help.
          </p>
          <button className="px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  )
}

export default FAQ
