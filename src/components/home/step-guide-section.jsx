import { UserPlus, ShoppingCart, Search ,HandCoins } from "lucide-react";
import { useLanguage } from "./translation/LanguageContext";

export default function StepGuideSection() {
  const { t, isRTL } = useLanguage();

  const steps = [
    {
      step: "01",
      title: t('stepGuide.steps.0.title'),
      description: t('stepGuide.steps.0.description'),
      icon: UserPlus,
      color: "bg-blue-500",
    },
    {
      step: "02",
      title: t('stepGuide.steps.1.title'),
      description: t('stepGuide.steps.1.description'),
      icon: Search,
      color: "bg-green-500",
    },
    {
      step: "03",
      title: t('stepGuide.steps.2.title'),
      description: t('stepGuide.steps.2.description'),
      icon: ShoppingCart,
      color: "bg-purple-500",
    },
    {
      step: "04",
      title: t('stepGuide.steps.3.title'),
      description: t('stepGuide.steps.3.description'),
      icon: HandCoins,
      color: "bg-orange-500",
    },
  ];

  return (
    <section className="py-20 bg-gray-50" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-flow-col-dense' : ''}`}>
          {/* Left Content - Steps */}
          <div className={`space-y-8 ${isRTL ? 'lg:col-start-2' : ''}`}>
            <div>
              <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('stepGuide.title')}
              </h2>
              <p className={`text-gray-600 text-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('stepGuide.subtitle')}
              </p>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className={`flex gap-6 items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div
                      className={`${step.color} text-white p-4 rounded-xl flex-shrink-0`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-2xl font-bold text-gray-400">
                          {step.step}
                        </span>
                        <h3 className={`text-xl font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {step.title}
                        </h3>
                      </div>
                      <p className={`text-gray-600 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - Image */}
          <div className={`relative ${isRTL ? 'lg:col-start-1' : ''}`}>
            <div className="relative z-10">
              <img
                src="images/home/steps.png"
                alt="Pharmacy Professional"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            {/* Background Elements */}
            <div className={`absolute -top-6 ${isRTL ? '-left-6' : '-right-6'} w-48 h-48 bg-blue-200 rounded-full blur-2xl opacity-40`}></div>
            <div className={`absolute -bottom-6 ${isRTL ? '-right-6' : '-left-6'} w-32 h-32 bg-green-200 rounded-full blur-xl opacity-50`}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
