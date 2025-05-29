import { CheckCircle, ArrowRight } from "lucide-react"

const features = [
  "Advanced Analytics & Reporting",
  "Automated Inventory Management",
  "Patient Communication Tools",
  "Regulatory Compliance Support",
  "Integration with Healthcare Systems",
  "Real-time Performance Monitoring",
]

export default function ProfessionalServicesSection() {
  return (
    // inside container 

    <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 py-20 rounded-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Professional Practice Management
                <span className="text-cyan-400"> Solutions for Pharmacy Excellence</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Elevate your pharmacy operations with our comprehensive suite of professional management tools designed
                to optimize efficiency, ensure compliance, and enhance patient care.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <button className="inline-flex items-center gap-2 bg-cyan-500 text-white px-8 py-4 rounded-full hover:bg-cyan-600 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl">
              Learn More
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Content - Decorative Elements */}
          <div className="relative">
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Streamlined Operations</h3>
                    <p className="text-gray-300 text-sm">Optimize your workflow efficiency</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Enhanced Patient Care</h3>
                    <p className="text-gray-300 text-sm">Focus on what matters most</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Compliance Assurance</h3>
                    <p className="text-gray-300 text-sm">Stay ahead of regulations</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-lg"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
