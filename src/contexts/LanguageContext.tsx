import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Auth
    'auth.title': 'Fix Karachi',
    'auth.subtitle': 'Report floods. Save lives. Earn rewards.',
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.selectRole': 'Select Your Role',
    'auth.citizen': 'Citizen',
    'auth.citizenDesc': 'Report floods and earn points',
    'auth.admin': 'Admin',
    'auth.adminDesc': 'Manage reports and send alerts',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.loginHere': 'Login here',
    'auth.signupHere': 'Sign up here',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.reports': 'Reports',
    'dashboard.alerts': 'Alerts',
    'dashboard.points': 'Points',
    'dashboard.logout': 'Logout',
    
    // Citizen
    'citizen.submitReport': 'Submit Report',
    'citizen.myReports': 'My Reports',
    'citizen.ecoPoints': 'Eco Points',
    'citizen.activeAlerts': 'Active Alerts',
    
    // Admin
    'admin.verifyReports': 'Verify Reports',
    'admin.sendAlert': 'Send Alert',
    'admin.manageUsers': 'Manage Users',
    'admin.statistics': 'Statistics',
  },
  ur: {
    // Auth
    'auth.title': 'فکس کراچی',
    'auth.subtitle': 'سیلاب کی رپورٹ کریں۔ زندگیاں بچائیں۔ انعامات حاصل کریں۔',
    'auth.login': 'لاگ ان',
    'auth.signup': 'سائن اپ',
    'auth.email': 'ای میل',
    'auth.password': 'پاس ورڈ',
    'auth.name': 'پورا نام',
    'auth.selectRole': 'اپنا کردار منتخب کریں',
    'auth.citizen': 'شہری',
    'auth.citizenDesc': 'سیلاب کی رپورٹ کریں اور پوائنٹس حاصل کریں',
    'auth.admin': 'منتظم',
    'auth.adminDesc': 'رپورٹس کا انتظام کریں اور الرٹ بھیجیں',
    'auth.alreadyHaveAccount': 'پہلے سے اکاؤنٹ ہے؟',
    'auth.dontHaveAccount': 'اکاؤنٹ نہیں ہے؟',
    'auth.loginHere': 'یہاں لاگ ان کریں',
    'auth.signupHere': 'یہاں سائن اپ کریں',
    
    // Dashboard
    'dashboard.welcome': 'خوش آمدید',
    'dashboard.reports': 'رپورٹس',
    'dashboard.alerts': 'الرٹس',
    'dashboard.points': 'پوائنٹس',
    'dashboard.logout': 'لاگ آؤٹ',
    
    // Citizen
    'citizen.submitReport': 'رپورٹ جمع کروائیں',
    'citizen.myReports': 'میری رپورٹس',
    'citizen.ecoPoints': 'ایکو پوائنٹس',
    'citizen.activeAlerts': 'فعال الرٹس',
    
    // Admin
    'admin.verifyReports': 'رپورٹس کی تصدیق کریں',
    'admin.sendAlert': 'الرٹ بھیجیں',
    'admin.manageUsers': 'صارفین کا انتظام',
    'admin.statistics': 'اعداد و شمار',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};