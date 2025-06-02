import { ArrowRight } from "lucide-react"

export default function CTASection() {
  return (
    <section className="mx-4 my-16">
      <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl px-8 py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-lg"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Quote Icon */}
          <div className="mb-6">
            <svg className="w-16 h-16 text-white/30 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
            </svg>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Make Medical Billing
            <br />
            Effortless Today
          </h2>

          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contact us or sign up for our medical billing services now.
          </p>

          <button className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-4 rounded-full hover:bg-gray-50 transition-colors duration-300 shadow-lg hover:shadow-xl">
            Get Started Today!
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
