import { CheckCircle, ArrowRight } from "lucide-react"
import { useLanguage } from "./translation/LanguageContext"

export default function ProfessionalServicesSection() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 py-20 rounded-3xl" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-flow-col-dense' : ''}`}>
          {/* Left Content */}
          <div className={`text-white space-y-8 ${isRTL ? 'lg:col-start-2' : ''}`}>
            <div>
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('professionalServices.title')}
                <span className="text-cyan-400"> {t('professionalServices.subtitle')}</span>
              </h2>
              <p className={`text-gray-300 text-lg leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('professionalServices.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t('professionalServices.services').map((service, index) => (
                <div key={index} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <div className="text-gray-300 font-semibold">{service.title}</div>
                    <div className="text-gray-400 text-sm">{service.description}</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="inline-flex items-center gap-2 bg-cyan-500 text-white px-8 py-4 rounded-full hover:bg-cyan-600 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl">
              {t('cta.button')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Content - Decorative Elements */}
          <div className={`relative ${isRTL ? 'lg:col-start-1' : ''}`}>
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="space-y-6">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-white font-semibold">{t('practiceManagement.features.0.title')}</h3>
                    <p className="text-gray-300 text-sm">{t('practiceManagement.features.0.description')}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-white font-semibold">{t('practiceManagement.features.1.title')}</h3>
                    <p className="text-gray-300 text-sm">{t('practiceManagement.features.1.description')}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-white font-semibold">{t('practiceManagement.features.2.title')}</h3>
                    <p className="text-gray-300 text-sm">{t('practiceManagement.features.2.description')}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Background decoration */}
            <div className={`absolute -top-4 ${isRTL ? '-left-4' : '-right-4'} w-32 h-32 bg-cyan-500/20 rounded-full blur-xl`}></div>
            <div className={`absolute -bottom-4 ${isRTL ? '-right-4' : '-left-4'} w-24 h-24 bg-blue-500/20 rounded-full blur-lg`}></div>
          </div>
        </div>
      </div>
    </section>
  )
}
