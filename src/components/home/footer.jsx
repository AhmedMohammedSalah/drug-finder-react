"use client"

import { Facebook, Youtube, Instagram, Linkedin, MapPin, Mail, Phone, ArrowUp } from "lucide-react"
import { useContext } from "react"
import { LanguageContext } from "./translation/LanguageContext"

// Custom hook to safely use language context
const useSafeLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    // Return fallback values when context is not available
    return {
      t: (key) => {
        const fallbacks = {
          'header.logo': 'Drug Finder',
          'footer.sections.services': 'Services',
          'footer.sections.support': 'Support',
          'footer.sections.company': 'Company',
          'footer.links.faq': 'FAQ',
          'footer.links.help': 'Help Center',
          'footer.links.privacy': 'Privacy Policy',
          'footer.links.terms': 'Terms of Service',
          'footer.links.about': 'About Us',
          'footer.links.contact': 'Contact',
          'footer.copyright': '© 2024 Drug Finder. All rights reserved.',
          'services.cards': {
            prescriptionManagement: { title: 'Prescription Management' },
            patientCare: { title: 'Patient Care' },
            service24_7: { title: '24/7 Service' },
            qualityAssurance: { title: 'Quality Assurance' }
          }
        };
        return fallbacks[key] || key;
      },
      isRTL: false
    };
  }
  
  return context;
};

const services = [
  "Medical Billing",
  "Medical Coding",
  "Revenue Cycle Management",
  "Practice Management",
  "Account Receivable",
  "Provider Credentialing",
  "Medical Virtual Staffing (Remote)",
]

const customerSupport = ["FAQ's", "Knowledge Base", "Privacy policy", "Terms and Conditions"]

const usefulLinks = ["Careers", "Contact us", "Unsubscribe"]

export default function Footer() {
  const { t, isRTL } = useSafeLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Get services cards as an array for mapping
  const servicesCards = Object.values(t('services.cards'));

  return (
    <footer className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className={`text-2xl font-bold mb-6 text-cyan-400 ${isRTL ? 'text-right' : 'text-left'}`}>{t('header.logo')}</h3>
            <p className={`text-gray-300 mb-6 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
              We'll show you exactly how you can achieve 30% increase in revenue and a 99.9% claim rate within 120 days
              by focusing more on patient care.
            </p>

            {/* Social Media */}
            <div className={`flex gap-4 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className={`flex items-center gap-3 text-gray-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>elminya</span>
              </div>
              <div className={`flex items-center gap-3 text-gray-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className="w-5 h-5 text-cyan-400" />
                <span>ahmed.mohamed.salah.elhadba@gmail.com</span>
              </div>
              <div className={`flex items-center gap-3 text-gray-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className="w-5 h-5 text-cyan-400" />
                <span>01014085759</span>
              </div>
            </div>
          </div>

          {/* Our Services */}
          <div>
            <h4 className={`text-lg font-semibold mb-6 text-cyan-400 ${isRTL ? 'text-right' : 'text-left'}`}>{t('footer.sections.services')}</h4>
            <ul className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
              {servicesCards.map((service, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className={`text-lg font-semibold mb-6 text-cyan-400 ${isRTL ? 'text-right' : 'text-left'}`}>{t('footer.sections.support')}</h4>
            <ul className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.links.faq')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.links.help')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.links.privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.links.terms')}
                </a>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className={`text-lg font-semibold mb-6 text-cyan-400 ${isRTL ? 'text-right' : 'text-left'}`}>{t('footer.sections.company')}</h4>
            <ul className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.links.about')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.links.contact')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className={`border-t border-gray-700 mt-12 pt-8 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
          <p className="text-gray-400">{t('footer.copyright')}</p>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className={`fixed bottom-8 ${isRTL ? 'left-8' : 'right-8'}`}>
        <button
          onClick={scrollToTop}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>
    </footer>
  )
}
