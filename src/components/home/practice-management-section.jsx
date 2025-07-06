import { CheckCircle, TrendingUp, Calendar, Shield, Users, Laptop } from "lucide-react"
import { useLanguage } from "./translation/LanguageContext"

export default function PracticeManagementSection() {
  const { t, isRTL } = useLanguage();

  const features = [
    {
      id: "01",
      title: t('practiceManagement.features.0.title'),
      description: t('practiceManagement.features.0.description'),
      icon: CheckCircle,
      highlighted: true,
    },
    {
      id: "02",
      title: t('practiceManagement.features.1.title'),
      description: t('practiceManagement.features.1.description'),
      icon: TrendingUp,
      highlighted: false,
    },
    {
      id: "03",
      title: t('practiceManagement.features.2.title'),
      description: t('practiceManagement.features.2.description'),
      icon: Calendar,
      highlighted: false,
    },
    {
      id: "04",
      title: t('practiceManagement.features.3.title'),
      description: t('practiceManagement.features.3.description'),
      icon: Shield,
      highlighted: false,
    },
    {
      id: "05",
      title: t('practiceManagement.features.4.title'),
      description: t('practiceManagement.features.4.description'),
      icon: Users,
      highlighted: false,
    },
    {
      id: "06",
      title: t('practiceManagement.features.5.title'),
      description: t('practiceManagement.features.5.description'),
      icon: Laptop,
      highlighted: false,
    },
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className={`text-center mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('practiceManagement.title')}
        </h2>
        <p className={`text-gray-600 max-w-4xl mx-auto leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('practiceManagement.subtitle')}
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
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    feature.highlighted ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {feature.id}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg mb-2 ${feature.highlighted ? "text-white" : "text-gray-900"} ${isRTL ? 'text-right' : 'text-left'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${feature.highlighted ? "text-white/90" : "text-gray-600"} ${isRTL ? 'text-right' : 'text-left'}`}>
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
