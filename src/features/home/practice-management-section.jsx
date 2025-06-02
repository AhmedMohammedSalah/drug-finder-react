import { CheckCircle, TrendingUp, Calendar, Shield, Users, Laptop } from "lucide-react"

const features = [
  {
    id: "01",
    title: "Improve Efficiency:",
    description: "Streamline workflows and reduce operational bottlenecks",
    icon: CheckCircle,
    highlighted: true,
  },
  {
    id: "02",
    title: "Enhance Financial Performance:",
    description: "Gain better control over finances and improve revenue management",
    icon: TrendingUp,
    highlighted: false,
  },
  {
    id: "03",
    title: "Optimize Scheduling:",
    description: "Ensure effective appointment scheduling and patient follow-ups",
    icon: Calendar,
    highlighted: false,
  },
  {
    id: "04",
    title: "Ensure Compliance:",
    description: "Stay compliant with regulatory requirements and avoid penalties",
    icon: Shield,
    highlighted: false,
  },
  {
    id: "05",
    title: "Boost Staff Productivity:",
    description: "Reduce administrative burdens and focus staff on patient care",
    icon: Users,
    highlighted: false,
  },
  {
    id: "06",
    title: "Leverage Technology:",
    description: "Utilize advanced practice management tools and software",
    icon: Laptop,
    highlighted: false,
  },
]

export default function PracticeManagementSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Why You'll Love Our Practice Management Services?
        </h2>
        <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
          By outsourcing your practice management to True Care Medical Billing, you gain access to expert solutions that
          streamline operations, enhance efficiency, and reduce administrative burdens. This allows you to focus on
          providing exceptional patient care while we handle the details. Here's why you'll love our practice management
          solutions:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const IconComponent = feature.icon
          return (
            <div
              key={feature.id}
              className={`relative p-6 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                feature.highlighted
                  ? "bg-blue-500 text-white shadow-xl"
                  : "bg-white border-2 border-gray-200 text-gray-900 hover:border-blue-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    feature.highlighted ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {feature.id}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg mb-2 ${feature.highlighted ? "text-white" : "text-gray-900"}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${feature.highlighted ? "text-white/90" : "text-gray-600"}`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
