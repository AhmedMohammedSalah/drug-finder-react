import Header from "./header"
import HeroSection from "./hero-section"
import ServiceCards from "./service-cards"
import StatisticsSection from "./statistics-section"
import ProfessionalServicesSection from "./professional-services-section"
import StepGuideSection from "./step-guide-section"
import PracticeManagementSection from "./practice-management-section"
import CTASection from "./cta-section"
import FAQSection from "./faq-section"
import Footer from "./footer"
import { LanguageProvider } from "./translation/LanguageContext"

export default function HomePage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <Header />
        <HeroSection />
        <ServiceCards />
        <StatisticsSection />
        <ProfessionalServicesSection />
        <StepGuideSection />
        <PracticeManagementSection />
        <CTASection />
        <FAQSection />
        <Footer />
      </div>
    </LanguageProvider>
  )
}
