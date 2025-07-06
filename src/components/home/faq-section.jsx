"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "./translation/LanguageContext"

export default function FAQSection() {
  const { t, isRTL } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = t('faq.questions');

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <h2 className={`text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('faq.title')}
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleFAQ(index)}
              className={`w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span className={`font-medium text-gray-900 ${isRTL ? 'pr-0 pl-4' : 'pr-4'}`}>{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className={`text-gray-600 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
