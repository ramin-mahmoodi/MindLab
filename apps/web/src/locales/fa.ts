// Persian translations
const fa = {
    // Navigation
    'nav.home': 'خانه',
    'nav.tests': 'تست‌ها',
    'nav.results': 'نتایج',
    'nav.admin': 'مدیریت',
    'nav.login': 'ورود',
    'nav.logout': 'خروج',

    // Home page
    'home.title': 'آزمایشگاه ذهن',
    'home.subtitle': 'پلتفرم تست‌های روان‌شناسی',
    'home.description': 'با استفاده از تست‌های استاندارد روان‌شناسی، وضعیت سلامت روان خود را بررسی کنید.',
    'home.cta': 'شروع تست',
    'home.features.title': 'ویژگی‌ها',
    'home.features.scientific': 'مبتنی بر علم',
    'home.features.scientific.desc': 'تست‌های استاندارد و معتبر روان‌شناسی',
    'home.features.private': 'محرمانه',
    'home.features.private.desc': 'نتایج شما کاملاً خصوصی است',
    'home.features.instant': 'نتیجه فوری',
    'home.features.instant.desc': 'تحلیل و تفسیر آنی نتایج',

    // Tests page
    'tests.title': 'تست‌های روان‌شناسی',
    'tests.subtitle': 'تست مناسب خود را انتخاب کنید',
    'tests.login.prompt': 'برای انجام تست و ذخیره نتایج، لطفاً وارد شوید.',
    'tests.empty': 'تستی موجود نیست. از پنل ادمین تست‌ها را sync کنید.',
    'tests.start': 'شروع تست',
    'tests.login.required': 'ورود برای شروع',
    'tests.disclaimer': 'تمامی تست‌های این سایت صرفاً جنبه غربالگری دارند و جایگزین ارزیابی تخصصی توسط روان‌شناس یا روان‌پزشک نیستند.',

    // Run test page
    'test.question': 'سوال',
    'test.of': 'از',
    'test.next': 'بعدی',
    'test.previous': 'قبلی',
    'test.finish': 'پایان تست',
    'test.warning': 'هشدار',
    'test.loading': 'در حال بارگذاری...',

    // Results page
    'results.title': 'نتایج من',
    'results.subtitle': 'تاریخچه تست‌های انجام شده',
    'results.empty': 'هنوز تستی انجام نداده‌اید.',
    'results.view': 'مشاهده جزئیات',
    'results.score': 'نمره',
    'results.date': 'تاریخ',

    // Result detail page
    'result.title': 'نتیجه تست',
    'result.total.score': 'نمره کل',
    'result.analysis': 'تحلیل نتایج',
    'result.recommendations': 'توصیه‌ها',
    'result.retake': 'انجام مجدد تست',
    'result.other.tests': 'تست‌های دیگر',
    'result.back': 'بازگشت به نتایج',
    'result.disclaimer': 'این نتیجه جایگزین ارزیابی تخصصی توسط روان‌شناس یا روان‌پزشک نیست.',

    // Login page
    'login.title': 'ورود به حساب',
    'login.email': 'ایمیل',
    'login.password': 'رمز عبور',
    'login.submit': 'ورود',
    'login.google': 'ورود با گوگل',
    'login.register': 'ثبت‌نام',
    'login.forgot': 'فراموشی رمز عبور',
    'login.no.account': 'حساب ندارید؟',
    'login.have.account': 'قبلاً ثبت‌نام کرده‌اید؟',

    // Admin
    'admin.dashboard': 'داشبورد مدیریت',
    'admin.sync': 'همگام‌سازی تست‌ها',
    'admin.sync.desc': 'همگام‌سازی تست‌های تعریف‌شده در کد با دیتابیس',
    'admin.sync.button': 'همگام‌سازی',
    'admin.tests': 'مدیریت تست‌ها',
    'admin.import': 'ورود/خروج داده',

    // Common
    'common.loading': 'در حال بارگذاری...',
    'common.error': 'خطایی رخ داد',
    'common.save': 'ذخیره',
    'common.cancel': 'انصراف',
    'common.delete': 'حذف',
    'common.edit': 'ویرایش',
    'common.add': 'افزودن',
    'common.back': 'بازگشت',
    'common.success': 'موفق',

    // Categories
    'category.General': 'غربالگری عمومی',
    'category.Depression': 'افسردگی',
    'category.Anxiety': 'اضطراب',
    'category.Stress': 'استرس',
    'category.OCD': 'وسواس',
    'category.PTSD': 'تروما و PTSD',
    'category.Bipolar': 'دوقطبی / مانیا',
    'category.ADHD': 'بیش‌فعالی',
    'category.Eating': 'اختلالات خوردن',
    'category.Sleep': 'خواب',
    'category.Substance': 'مصرف مواد',
    'category.Suicide': 'خودکشی و ریسک',
} as const;

export default fa;
