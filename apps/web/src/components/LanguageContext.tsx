import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKey } from '../locales';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
    dir: 'rtl' | 'ltr';
    isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'mindlab-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'en' || saved === 'fa') return saved;
        }
        return 'fa'; // Default to Persian
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, language);
        // Update document direction
        document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = (key: TranslationKey): string => {
        return translations[language][key] || key;
    };

    const dir = language === 'fa' ? 'rtl' : 'ltr';
    const isRTL = language === 'fa';

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

// Hook for test content that has both name/nameFa pattern
export function useLocalizedTest<T extends { name?: string; nameFa?: string; description?: string; descriptionFa?: string }>(test: T) {
    const { language } = useLanguage();
    return {
        name: language === 'fa' ? (test.nameFa || test.name) : (test.name || test.nameFa),
        description: language === 'fa' ? (test.descriptionFa || test.description) : (test.description || test.descriptionFa),
    };
}
