import { useLanguage } from './LanguageContext';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="language-switcher">
            <button
                className={`lang-btn ${language === 'fa' ? 'active' : ''}`}
                onClick={() => setLanguage('fa')}
                title="فارسی"
            >
                🇮🇷 FA
            </button>
            <button
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
                title="English"
            >
                🇬🇧 EN
            </button>
        </div>
    );
}
