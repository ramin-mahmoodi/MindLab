import fa from './fa';
import en from './en';

export type Language = 'fa' | 'en';
export type TranslationKey = keyof typeof fa;

export const translations: Record<Language, Record<TranslationKey, string>> = {
    fa,
    en: en as Record<TranslationKey, string>,
};

export { fa, en };
