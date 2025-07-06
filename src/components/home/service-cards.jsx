import { Pill, Heart, Clock, Shield } from "lucide-react"
import { useLanguage } from "./translation/LanguageContext"

const services = [
  {
    key: "prescriptionManagement",
    icon: Pill,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
    borderColor: "border-yellow-200",
  },
  {
    key: "patientCare",
    icon: Heart,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    borderColor: "border-green-200",
  },
  {
    key: "service24_7",
    icon: Clock,
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
    borderColor: "border-pink-200",
  },
  {
    key: "qualityAssurance",
    icon: Shield,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    borderColor: "border-blue-200",
  },
]

export default function ServiceCards() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="py-16 px-4" id="services" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('services.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div
                key={index}
                className={`${service.bgColor} ${service.borderColor} border-2 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`${service.iconColor} mb-4`}>
                  <IconComponent className="w-12 h-12" />
                </div>
                <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t(`services.cards.${service.key}.title`)}
                </h3>
                <p className={`text-gray-600 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t(`services.cards.${service.key}.description`)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
