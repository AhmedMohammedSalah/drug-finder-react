"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How do you assess my practice's needs?",
    answer:
      "We conduct a comprehensive evaluation of your current processes, identify bottlenecks, and create a customized solution that fits your specific requirements.",
  },
  {
    question: "What kind of support do you offer after implementation?",
    answer:
      "We provide 24/7 technical support, regular training sessions, and ongoing optimization to ensure your practice management system continues to meet your evolving needs.",
  },
  {
    question: "Can your practice management services help with compliance issues?",
    answer:
      "Yes, our services include compliance monitoring, regular audits, and updates to ensure your practice stays compliant with all healthcare regulations and standards.",
  },
  {
    question: "How do you integrate with existing practice management software?",
    answer:
      "Our team specializes in seamless integration with most major practice management systems. We ensure data integrity and minimal disruption during the transition process.",
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
            >
              <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
