import { Link } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';
import { ArrowRight, Sparkles, FlaskConical, Lock, BarChart3 } from 'lucide-react';

export default function Home() {
    const { t, language, isRTL } = useLanguage();

    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(45,212,191,0.15),transparent_50%)]" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2dd4bf]/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#a78bfa]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

                {/* Floating Elements */}
                <div className="absolute top-32 left-[10%] w-20 h-20 border border-[#2dd4bf]/30 rounded-2xl rotate-12 animate-bounce opacity-40" style={{ animationDuration: '6s' }} />
                <div className="absolute top-48 right-[15%] w-16 h-16 border border-[#a78bfa]/30 rounded-full animate-bounce opacity-40" style={{ animationDuration: '8s', animationDelay: '2s' }} />
                <div className="absolute bottom-32 left-[20%] w-12 h-12 bg-[#2dd4bf]/20 rounded-lg rotate-45 animate-bounce opacity-40" style={{ animationDuration: '7s' }} />
                <div className="absolute bottom-48 right-[10%] w-24 h-24 border border-[#2dd4bf]/20 rounded-3xl -rotate-12 animate-bounce opacity-40" style={{ animationDuration: '9s', animationDelay: '1s' }} />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

                <div className="container relative z-10 px-4 lg:px-8 mx-auto">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(220,25%,14%)] border border-[hsl(220,20%,18%)] mb-8">
                            <Sparkles className="w-4 h-4 text-[#2dd4bf]" />
                            <span className="text-sm text-[hsl(215,20%,65%)]">
                                {language === 'fa' ? 'کشف توانایی‌های ذهنی شما' : 'Discover Your Mind\'s Potential'}
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {language === 'fa' ? (
                                <>
                                    <span className="bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] bg-clip-text text-transparent">آزمایشگاه ذهن</span>
                                    <br />
                                    پلتفرم تست‌های روان‌شناسی
                                </>
                            ) : (
                                <>
                                    Unlock the Secrets of<br />
                                    <span className="bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] bg-clip-text text-transparent">Your Psychology</span>
                                </>
                            )}
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg sm:text-xl text-[hsl(215,20%,65%)] max-w-2xl mx-auto mb-10">
                            {t('home.description')}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/tests"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] text-[hsl(220,25%,6%)] shadow-lg shadow-[#2dd4bf]/30 hover:shadow-xl hover:shadow-[#2dd4bf]/40 hover:scale-105 transition-all duration-300"
                            >
                                {t('home.cta')}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/tests"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-[#2dd4bf]/50 bg-transparent text-white hover:border-[#2dd4bf] hover:bg-[#2dd4bf]/10 transition-all duration-300"
                            >
                                {t('nav.tests')}
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto mt-16">
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>+50K</div>
                                <div className="text-sm text-[hsl(215,20%,65%)] mt-1">
                                    {language === 'fa' ? 'تست انجام شده' : 'Tests Taken'}
                                </div>
                            </div>
                            <div className="text-center border-x border-[hsl(220,20%,18%)]">
                                <div className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>+15</div>
                                <div className="text-sm text-[hsl(215,20%,65%)] mt-1">
                                    {language === 'fa' ? 'تست معتبر' : 'Assessments'}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>98%</div>
                                <div className="text-sm text-[hsl(215,20%,65%)] mt-1">
                                    {language === 'fa' ? 'دقت نتایج' : 'Accuracy'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(220,25%,6%)] to-transparent" />
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 lg:px-8 py-20">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {language === 'fa' ? (
                        <>چرا <span className="bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] bg-clip-text text-transparent">آزمایشگاه ذهن</span>؟</>
                    ) : (
                        <>Why Choose <span className="bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] bg-clip-text text-transparent">MindLab</span>?</>
                    )}
                </h2>
                <p className="text-center max-w-2xl mx-auto mb-12 text-[hsl(215,20%,65%)]">
                    {language === 'fa'
                        ? 'تست‌های روان‌شناسی حرفه‌ای بر اساس تحقیقات علمی معتبر'
                        : 'Professional psychological assessments based on validated research'
                    }
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[hsl(220,25%,12%)] to-[hsl(220,25%,8%)] border border-[hsl(220,20%,18%)] hover:border-[#2dd4bf]/50 transition-all duration-300 group">
                        <div className="w-12 h-12 rounded-xl bg-[#2dd4bf]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <FlaskConical className="w-6 h-6 text-[#2dd4bf]" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">{t('home.features.scientific')}</h3>
                        <p className="text-[hsl(215,20%,65%)]">{t('home.features.scientific.desc')}</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[hsl(220,25%,12%)] to-[hsl(220,25%,8%)] border border-[hsl(220,20%,18%)] hover:border-[#a78bfa]/50 transition-all duration-300 group">
                        <div className="w-12 h-12 rounded-xl bg-[#a78bfa]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Lock className="w-6 h-6 text-[#a78bfa]" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">{t('home.features.private')}</h3>
                        <p className="text-[hsl(215,20%,65%)]">{t('home.features.private.desc')}</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[hsl(220,25%,12%)] to-[hsl(220,25%,8%)] border border-[hsl(220,20%,18%)] hover:border-[#2dd4bf]/50 transition-all duration-300 group">
                        <div className="w-12 h-12 rounded-xl bg-[#2dd4bf]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <BarChart3 className="w-6 h-6 text-[#2dd4bf]" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">{t('home.features.instant')}</h3>
                        <p className="text-[hsl(215,20%,65%)]">{t('home.features.instant.desc')}</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 lg:px-8 pb-20">
                <div className="text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#2dd4bf]/10 to-[#a78bfa]/10 border border-[hsl(220,20%,18%)]">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {language === 'fa' ? (
                            <>آماده کشف <span className="bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] bg-clip-text text-transparent">روان‌شناسی</span> خود هستید؟</>
                        ) : (
                            <>Ready to Discover Your <span className="bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] bg-clip-text text-transparent">Psychology</span>?</>
                        )}
                    </h2>
                    <p className="max-w-lg mx-auto mb-8 text-[hsl(215,20%,65%)]">
                        {language === 'fa'
                            ? 'به هزاران کاربری بپیوندید که درباره سلامت روان خود آگاهی پیدا کرده‌اند'
                            : 'Join thousands of users who have gained insights about their mental health'
                        }
                    </p>
                    <Link
                        to="/tests"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] text-[hsl(220,25%,6%)] shadow-lg shadow-[#2dd4bf]/30 hover:shadow-xl hover:shadow-[#2dd4bf]/40 hover:scale-105 transition-all duration-300"
                    >
                        {t('home.cta')}
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Disclaimer */}
            <div className="container mx-auto px-4 lg:px-8 pb-8">
                <div className={`flex items-start gap-3 p-4 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="text-xl">⚠️</span>
                    <span className="text-[#fbbf24] flex-1">{t('tests.disclaimer')}</span>
                </div>
            </div>
        </>
    );
}
