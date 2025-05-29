import { ArrowRight, Play } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                <span className="text-blue-600">Drug </span>
                <br />
                Frinder
                <br />
                More Easy
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Streamline your pharmacy operations with our comprehensive
                management solutions. Focus on patient care while we handle the
                complexities of modern pharmacy management.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl">
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="inline-flex items-center gap-2 text-blue-600 px-8 py-4 rounded-full border-2 border-blue-600 hover:bg-blue-50 transition-colors font-semibold text-lg">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>

          {/* Right Content - Doctor Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="images/home/drug_finder.png"
                alt="Healthcare Professional"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            {/* Background Elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -bottom-4 -left-4 w-48 h-48 bg-indigo-200 rounded-full blur-2xl opacity-40"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
