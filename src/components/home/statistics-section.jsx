import { Users, Award, Clock, TrendingUp } from "lucide-react"

const stats = [
  {
    icon: Users,
    number: "10,000+",
    label: "Patients Served",
    description: "Successfully serving patients across multiple locations",
  },
  {
    icon: Award,
    number: "1+",
    label: "Years Experience",
    description: "Decades of expertise in pharmaceutical care",
  },
  {
    icon: Clock,
    number: "24/7",
    label: "Available Support",
    description: "Round-the-clock assistance for all your needs",
  },
  {
    icon: TrendingUp,
    number: "98%",
    label: "Success Rate",
    description: "Proven track record of successful outcomes",
  },
]

export default function StatisticsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Image */}
          <div className="relative">
            <img
              src="images/home/medical_team.jpg"
              alt="Medical Team"
              className="w-full h-auto rounded-2xl shadow-xl"
            />
            {/* <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
              <div className="text-2xl font-bold">Excellence</div>
              <div className="text-blue-100">in Healthcare</div>
            </div> */}
          </div>

          {/* Right Content - Statistics */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Trusted by Healthcare Professionals Worldwide
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our comprehensive pharmacy management solutions have helped
                thousands of healthcare providers streamline their operations
                and improve patient outcomes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        {stat.number}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {stat.label}
                    </h3>
                    <p className="text-gray-600 text-sm">{stat.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
