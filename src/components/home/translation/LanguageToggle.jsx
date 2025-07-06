import React from 'react';
import { useLanguage } from './LanguageContext';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const { currentLanguage, toggleLanguage, isRTL } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`
        fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 
        bg-white border border-gray-300 rounded-full shadow-lg 
        hover:shadow-xl transition-all duration-200 
        ${isRTL ? 'right-4' : 'left-4'}
      `}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <Globe className="w-4 h-4 text-blue-600" />
      <span className="font-medium text-gray-700">
        {currentLanguage === 'en' ? 'العربية' : 'English'}
      </span>
    </button>
  );
};

export default LanguageToggle; 