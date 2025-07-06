import { Users, Award, Clock, TrendingUp } from "lucide-react"
import { useLanguage } from "./translation/LanguageContext"

const stats = [
  {
    icon: Users,
    number: "10,000+",
    key: "patients",
  },
  {
    icon: Award,
    number: "1+",
    key: "years",
  },
  {
    icon: Clock,
    number: "24/7",
    key: "support",
  },
  {
    icon: TrendingUp,
    number: "98%",
    key: "satisfaction",
  },
]

export default function StatisticsSection() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="py-16 bg-white" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-flow-col-dense' : ''}`}>
          {/* Left Content - Image */}
          <div className={`relative ${isRTL ? 'lg:col-start-2' : ''}`}>
            <img
              src="images/home/medical_team.jpg"
              alt="Medical Team"
              className="w-full h-auto rounded-2xl shadow-xl"
            />
            {/* <div className={`absolute -bottom-6 ${isRTL ? '-left-6' : '-right-6'} bg-blue-600 text-white p-6 rounded-2xl shadow-lg`}> */}
              {/* <div className="text-2xl font-bold">Excellence</div>
              <div className="text-blue-100">in Healthcare</div> */}
            {/* </div> */}
          </div>

          {/* Right Content - Statistics */}
          <div className={`space-y-8 ${isRTL ? 'lg:col-start-1' : ''}`}>
            <div>
              <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('statistics.title')}
              </h2>
              <p className={`text-gray-600 text-lg leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('statistics.subtitle')}
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
                    <div className={`flex items-center gap-4 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        {stat.number}
                      </div>
                    </div>
                    <h3 className={`font-semibold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t(`statistics.stats.${stat.key}`)}
                    </h3>
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
