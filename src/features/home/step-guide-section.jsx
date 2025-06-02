import { UserPlus, ShoppingCart, Search ,HandCoins } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Sign Up",
    description:
      "Create your account and set up your pharmacy profile with our easy registration process.",
    icon: UserPlus,
    color: "bg-blue-500",
  },
  {
    step: "02",
    title: "search on your drug ",
    description: "type your drug name and alternative.",
    icon: Search,
    color: "bg-green-500",
  },
  {
    step: "03",
    title: "make order",
    description: "After find your drug you can make order to get it .",
    icon: ShoppingCart,
    color: "bg-purple-500",
  },
  {
    step: "04",
    title: "Payment and trace order",
    description:
      "Launch your optimized pharmacy management system and start serving patients better.",
    icon: HandCoins,
    color: "bg-orange-500",
  },
];

export default function StepGuideSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Steps */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Step-by-Step Guide to Get Our Practice Management Process
              </h2>
              <p className="text-gray-600 text-lg">
                Follow our simple 4-step process to transform your pharmacy
                operations and start delivering exceptional patient care.
              </p>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="flex gap-6 items-start">
                    <div
                      className={`${step.color} text-white p-4 rounded-xl flex-shrink-0`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-gray-400">
                          {step.step}
                        </span>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="images/home/steps.png"
                alt="Pharmacy Professional"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            {/* Background Elements */}
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-blue-200 rounded-full blur-2xl opacity-40"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-200 rounded-full blur-xl opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
