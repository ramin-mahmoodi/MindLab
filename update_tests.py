import json
import os

TESTS_DIR = r"c:\GGNN\mindlab\apps\web\src\data\tests"

# Complete analysis templates for each test
ANALYSIS_UPDATES = {
    "bai": {
        "cutoffs": [
            {"scaleKey": "total", "min": 0, "max": 7, "label": "Minimal", "labelFa": "اضطراب حداقلی"},
            {"scaleKey": "total", "min": 8, "max": 15, "label": "Mild", "labelFa": "اضطراب خفیف"},
            {"scaleKey": "total", "min": 16, "max": 25, "label": "Moderate", "labelFa": "اضطراب متوسط"},
            {"scaleKey": "total", "min": 26, "max": 63, "label": "Severe", "labelFa": "اضطراب شدید"}
        ],
        "analysis_templates": [
            {"level_label": "Minimal", "scaleKey": "total", "title": "اضطراب حداقلی",
             "summary": "نمره شما (۰-۷) در محدوده طبیعی قرار دارد و نشان‌دهنده عدم وجود اضطراب بالینی قابل توجه است.",
             "details": "احتمالاً گاهی احساس نگرانی طبیعی تجربه می‌کنید که بخشی عادی از زندگی است.",
             "recommendations": "• حفظ سبک زندگی سالم\n• تمرین تنفس عمیق در مواقع استرس\n• ورزش منظم",
             "disclaimer": "این نتیجه صرفاً جهت آگاهی است و جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "Mild", "scaleKey": "total", "title": "اضطراب خفیف",
             "summary": "نمره شما (۸-۱۵) نشان‌دهنده اضطراب خفیف است که معمولاً با تکنیک‌های خودیاری قابل مدیریت است.",
             "details": "علائمی مانند نگرانی گاه‌به‌گاه، تنش عضلانی خفیف، یا بی‌قراری تجربه می‌کنید.",
             "recommendations": "• تمرین تکنیک‌های آرام‌سازی\n• ورزش منظم\n• کاهش کافئین\n• خواب کافی",
             "disclaimer": "این نتیجه صرفاً جهت آگاهی است و جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "Moderate", "scaleKey": "total", "title": "اضطراب متوسط",
             "summary": "نمره شما (۱۶-۲۵) نشان‌دهنده اضطراب متوسط است که می‌تواند بر زندگی روزمره تأثیر بگذارد.",
             "details": "علائمی مانند نگرانی مداوم، تپش قلب، تعریق، مشکلات خواب و تنش را تجربه می‌کنید.",
             "recommendations": "• مشاوره با روان‌شناس توصیه می‌شود\n• روان‌درمانی (CBT) مؤثر است\n• تمرینات مدیتیشن و ذهن‌آگاهی",
             "disclaimer": "مراجعه به متخصص بهداشت روان توصیه می‌شود."},
            {"level_label": "Severe", "scaleKey": "total", "title": "اضطراب شدید",
             "summary": "نمره شما (۲۶-۶۳) نشان‌دهنده اضطراب شدید است که نیاز به مداخله تخصصی دارد.",
             "details": "علائم شدید اضطراب می‌تواند شامل حملات پانیک، ترس شدید، اجتناب از موقعیت‌ها، و علائم جسمی ناتوان‌کننده باشد.",
             "recommendations": "• مراجعه فوری به روان‌پزشک\n• ترکیب دارودرمانی و روان‌درمانی\n• اجتناب از کافئین و الکل",
             "disclaimer": "این وضعیت نیاز به مراجعه فوری به متخصص دارد."}
        ]
    },
    "stai": {
        "cutoffs": [
            {"scaleKey": "state", "min": 20, "max": 37, "label": "Low", "labelFa": "اضطراب موقعیتی پایین"},
            {"scaleKey": "state", "min": 38, "max": 44, "label": "Moderate", "labelFa": "اضطراب موقعیتی متوسط"},
            {"scaleKey": "state", "min": 45, "max": 80, "label": "High", "labelFa": "اضطراب موقعیتی بالا"},
            {"scaleKey": "trait", "min": 20, "max": 37, "label": "Low", "labelFa": "اضطراب صفت پایین"},
            {"scaleKey": "trait", "min": 38, "max": 44, "label": "Moderate", "labelFa": "اضطراب صفت متوسط"},
            {"scaleKey": "trait", "min": 45, "max": 80, "label": "High", "labelFa": "اضطراب صفت بالا"}
        ],
        "analysis_templates": [
            {"level_label": "Low", "scaleKey": "state", "title": "اضطراب موقعیتی پایین",
             "summary": "نمره اضطراب موقعیتی شما (۲۰-۳۷) نشان‌دهنده آرامش نسبی در این لحظه است.",
             "details": "شما در حال حاضر سطح پایینی از استرس و نگرانی را تجربه می‌کنید.",
             "recommendations": "• حفظ این وضعیت مثبت\n• ادامه فعالیت‌های آرام‌بخش",
             "disclaimer": "این نتیجه صرفاً جهت آگاهی است."},
            {"level_label": "Moderate", "scaleKey": "state", "title": "اضطراب موقعیتی متوسط",
             "summary": "نمره اضطراب موقعیتی شما (۳۸-۴۴) نشان‌دهنده سطح متوسطی از استرس فعلی است.",
             "details": "احتمالاً در حال تجربه یک موقعیت استرس‌زا هستید.",
             "recommendations": "• تنفس عمیق و آرام‌سازی\n• شناسایی منبع استرس",
             "disclaimer": "این نتیجه صرفاً جهت آگاهی است."},
            {"level_label": "High", "scaleKey": "state", "title": "اضطراب موقعیتی بالا",
             "summary": "نمره اضطراب موقعیتی شما (۴۵-۸۰) نشان‌دهنده استرس شدید فعلی است.",
             "details": "شما در حال تجربه سطح بالایی از اضطراب هستید که نیاز به توجه دارد.",
             "recommendations": "• استفاده از تکنیک‌های آرام‌سازی فوری\n• در صورت تداوم، مشاوره با متخصص",
             "disclaimer": "اگر این حالت ادامه دارد، با متخصص مشورت کنید."},
            {"level_label": "Low", "scaleKey": "trait", "title": "اضطراب صفت پایین",
             "summary": "نمره اضطراب صفت شما (۲۰-۳۷) نشان‌دهنده این است که معمولاً فرد آرامی هستید.",
             "details": "شما به طور کلی تمایل کمتری به تجربه اضطراب دارید.",
             "recommendations": "• ادامه سبک زندگی سالم",
             "disclaimer": "این نتیجه صرفاً جهت آگاهی است."},
            {"level_label": "Moderate", "scaleKey": "trait", "title": "اضطراب صفت متوسط",
             "summary": "نمره اضطراب صفت شما (۳۸-۴۴) در محدوده متوسط قرار دارد.",
             "details": "شما گاهی اوقات تمایل به نگرانی و اضطراب دارید.",
             "recommendations": "• یادگیری تکنیک‌های مدیریت استرس\n• ورزش منظم",
             "disclaimer": "این نتیجه صرفاً جهت آگاهی است."},
            {"level_label": "High", "scaleKey": "trait", "title": "اضطراب صفت بالا",
             "summary": "نمره اضطراب صفت شما (۴۵-۸۰) نشان‌دهنده تمایل بالا به اضطراب است.",
             "details": "شما معمولاً در موقعیت‌های مختلف اضطراب بیشتری تجربه می‌کنید.",
             "recommendations": "• مشاوره با روان‌شناس توصیه می‌شود\n• روان‌درمانی می‌تواند مفید باشد",
             "disclaimer": "مراجعه به متخصص توصیه می‌شود."}
        ]
    },
    "dass-21": {
        "cutoffs": [
            {"scaleKey": "depression", "min": 0, "max": 9, "label": "Normal", "labelFa": "طبیعی"},
            {"scaleKey": "depression", "min": 10, "max": 13, "label": "Mild", "labelFa": "خفیف"},
            {"scaleKey": "depression", "min": 14, "max": 20, "label": "Moderate", "labelFa": "متوسط"},
            {"scaleKey": "depression", "min": 21, "max": 27, "label": "Severe", "labelFa": "شدید"},
            {"scaleKey": "depression", "min": 28, "max": 42, "label": "Extremely Severe", "labelFa": "بسیار شدید"},
            {"scaleKey": "anxiety", "min": 0, "max": 7, "label": "Normal", "labelFa": "طبیعی"},
            {"scaleKey": "anxiety", "min": 8, "max": 9, "label": "Mild", "labelFa": "خفیف"},
            {"scaleKey": "anxiety", "min": 10, "max": 14, "label": "Moderate", "labelFa": "متوسط"},
            {"scaleKey": "anxiety", "min": 15, "max": 19, "label": "Severe", "labelFa": "شدید"},
            {"scaleKey": "anxiety", "min": 20, "max": 42, "label": "Extremely Severe", "labelFa": "بسیار شدید"},
            {"scaleKey": "stress", "min": 0, "max": 14, "label": "Normal", "labelFa": "طبیعی"},
            {"scaleKey": "stress", "min": 15, "max": 18, "label": "Mild", "labelFa": "خفیف"},
            {"scaleKey": "stress", "min": 19, "max": 25, "label": "Moderate", "labelFa": "متوسط"},
            {"scaleKey": "stress", "min": 26, "max": 33, "label": "Severe", "labelFa": "شدید"},
            {"scaleKey": "stress", "min": 34, "max": 42, "label": "Extremely Severe", "labelFa": "بسیار شدید"}
        ],
        "analysis_templates": [
            {"level_label": "Normal", "scaleKey": "depression", "title": "افسردگی: طبیعی",
             "summary": "نمره افسردگی شما در محدوده طبیعی است.",
             "details": "شما علائم افسردگی قابل توجهی نشان نمی‌دهید.",
             "recommendations": "• حفظ سبک زندگی سالم",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "Moderate", "scaleKey": "depression", "title": "افسردگی: متوسط",
             "summary": "نمره افسردگی شما در سطح متوسط است.",
             "details": "علائم افسردگی متوسط که می‌تواند بر زندگی روزمره تأثیر بگذارد.",
             "recommendations": "• مشاوره با روان‌شناس توصیه می‌شود",
             "disclaimer": "مراجعه به متخصص توصیه می‌شود."},
            {"level_label": "Severe", "scaleKey": "depression", "title": "افسردگی: شدید",
             "summary": "نمره افسردگی شما در سطح شدید است.",
             "details": "علائم افسردگی شدید که نیاز به مداخله تخصصی دارد.",
             "recommendations": "• مراجعه فوری به روان‌پزشک",
             "disclaimer": "این وضعیت نیاز به توجه فوری دارد."},
            {"level_label": "Normal", "scaleKey": "anxiety", "title": "اضطراب: طبیعی",
             "summary": "نمره اضطراب شما در محدوده طبیعی است.",
             "details": "شما علائم اضطراب قابل توجهی نشان نمی‌دهید.",
             "recommendations": "• حفظ آرامش و سبک زندگی سالم",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "Moderate", "scaleKey": "anxiety", "title": "اضطراب: متوسط",
             "summary": "نمره اضطراب شما در سطح متوسط است.",
             "details": "علائم اضطراب متوسط که ممکن است نگران‌کننده باشد.",
             "recommendations": "• تکنیک‌های آرام‌سازی\n• مشاوره با متخصص",
             "disclaimer": "مراجعه به متخصص توصیه می‌شود."},
            {"level_label": "Normal", "scaleKey": "stress", "title": "استرس: طبیعی",
             "summary": "نمره استرس شما در محدوده طبیعی است.",
             "details": "شما استرس را به خوبی مدیریت می‌کنید.",
             "recommendations": "• ادامه روش‌های مدیریت استرس فعلی",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "Moderate", "scaleKey": "stress", "title": "استرس: متوسط",
             "summary": "نمره استرس شما در سطح متوسط است.",
             "details": "سطح استرس شما بالاتر از حد معمول است.",
             "recommendations": "• تکنیک‌های مدیریت استرس\n• ورزش و استراحت کافی",
             "disclaimer": "توجه به کاهش استرس توصیه می‌شود."}
        ]
    },
    "ces-d": {
        "cutoffs": [
            {"scaleKey": "total", "min": 0, "max": 15, "label": "Normal", "labelFa": "بدون افسردگی"},
            {"scaleKey": "total", "min": 16, "max": 20, "label": "Mild", "labelFa": "افسردگی خفیف"},
            {"scaleKey": "total", "min": 21, "max": 30, "label": "Moderate", "labelFa": "افسردگی متوسط"},
            {"scaleKey": "total", "min": 31, "max": 60, "label": "Severe", "labelFa": "افسردگی شدید"}
        ],
        "analysis_templates": [
            {"level_label": "Normal", "scaleKey": "total", "title": "بدون علائم افسردگی قابل توجه",
             "summary": "نمره شما (۰-۱۵) نشان‌دهنده عدم وجود علائم افسردگی بالینی است.",
             "details": "شما در هفته گذشته علائم افسردگی قابل توجهی تجربه نکرده‌اید.",
             "recommendations": "• ادامه فعالیت‌های اجتماعی و لذت‌بخش\n• حفظ روابط سالم",
             "disclaimer": "این نتیجه صرفاً جهت آگاهی است."},
            {"level_label": "Mild", "scaleKey": "total", "title": "علائم افسردگی خفیف",
             "summary": "نمره شما (۱۶-۲۰) نشان‌دهنده برخی علائم افسردگی است که نیاز به توجه دارد.",
             "details": "ممکن است گاهی احساس غمگینی، خستگی یا کاهش علاقه داشته باشید.",
             "recommendations": "• توجه به خودمراقبتی\n• افزایش فعالیت‌های اجتماعی\n• در صورت تداوم، مشاوره با متخصص",
             "disclaimer": "در صورت تداوم علائم، مراجعه به متخصص توصیه می‌شود."},
            {"level_label": "Moderate", "scaleKey": "total", "title": "افسردگی متوسط",
             "summary": "نمره شما (۲۱-۳۰) نشان‌دهنده افسردگی در سطح متوسط است.",
             "details": "علائم افسردگی مانند غمگینی مداوم، کاهش انرژی، و مشکلات خواب ممکن است بر زندگی روزمره تأثیر بگذارند.",
             "recommendations": "• مشاوره با روان‌شناس یا روان‌پزشک توصیه می‌شود\n• شرکت در فعالیت‌های گروهی\n• ورزش منظم",
             "disclaimer": "مراجعه به متخصص بهداشت روان توصیه می‌شود."},
            {"level_label": "Severe", "scaleKey": "total", "title": "افسردگی شدید",
             "summary": "نمره شما (۳۱-۶۰) نشان‌دهنده افسردگی شدید است که نیاز به مداخله تخصصی دارد.",
             "details": "علائم شدید افسردگی می‌تواند بر تمام جنبه‌های زندگی تأثیر بگذارد و نیاز به کمک حرفه‌ای دارد.",
             "recommendations": "• مراجعه فوری به روان‌پزشک\n• در صورت داشتن افکار آزاردهنده، با خط اورژانس ۱۲۳ تماس بگیرید",
             "disclaimer": "این وضعیت نیاز به مراجعه فوری به متخصص دارد."}
        ]
    },
    "pcl-5": {
        "cutoffs": [
            {"scaleKey": "total", "min": 0, "max": 30, "label": "SubThreshold", "labelFa": "زیر آستانه تشخیص"},
            {"scaleKey": "total", "min": 31, "max": 32, "label": "Borderline", "labelFa": "مرزی"},
            {"scaleKey": "total", "min": 33, "max": 80, "label": "ProbablePTSD", "labelFa": "احتمال PTSD"}
        ],
        "analysis_templates": [
            {"level_label": "SubThreshold", "scaleKey": "total", "title": "زیر آستانه تشخیص PTSD",
             "summary": "نمره شما (۰-۳۰) زیر آستانه تشخیص PTSD است.",
             "details": "اگرچه ممکن است برخی علائم استرس پس از سانحه را تجربه کرده باشید، اما این علائم در سطح بالینی نیستند.",
             "recommendations": "• اگر رویداد تروماتیکی تجربه کرده‌اید، صحبت با فرد مورد اعتماد مفید است\n• ورزش و فعالیت‌های آرام‌بخش",
             "disclaimer": "این نتیجه صرفاً جهت آگاهی است."},
            {"level_label": "Borderline", "scaleKey": "total", "title": "نمره مرزی PTSD",
             "summary": "نمره شما (۳۱-۳۲) در محدوده مرزی قرار دارد.",
             "details": "شما در آستانه تشخیص PTSD قرار دارید و بهتر است با متخصص مشورت کنید.",
             "recommendations": "• مشاوره با روان‌شناس متخصص تروما توصیه می‌شود\n• تکنیک‌های مدیریت استرس",
             "disclaimer": "مراجعه به متخصص توصیه می‌شود."},
            {"level_label": "ProbablePTSD", "scaleKey": "total", "title": "احتمال اختلال استرس پس از سانحه (PTSD)",
             "summary": "نمره شما (۳۳+) نشان‌دهنده احتمال بالای PTSD است.",
             "details": "علائمی مانند خاطرات ناخواسته، اجتناب، تغییرات خلقی، و واکنش‌پذیری بالا ممکن است زندگی روزمره را تحت تأثیر قرار دهد.",
             "recommendations": "• مراجعه به روان‌پزشک یا روان‌شناس متخصص تروما\n• درمان‌های مبتنی بر شواهد مانند EMDR و CPT مؤثر هستند",
             "disclaimer": "این وضعیت نیاز به ارزیابی و درمان تخصصی دارد."}
        ]
    },
    "ies-r": {
        "cutoffs": [
            {"scaleKey": "total", "min": 0, "max": 23, "label": "Normal", "labelFa": "طبیعی"},
            {"scaleKey": "total", "min": 24, "max": 32, "label": "Mild", "labelFa": "خفیف"},
            {"scaleKey": "total", "min": 33, "max": 36, "label": "Moderate", "labelFa": "متوسط"},
            {"scaleKey": "total", "min": 37, "max": 88, "label": "Severe", "labelFa": "شدید (احتمال PTSD)"}
        ],
        "analysis_templates": [
            {"level_label": "Normal", "scaleKey": "total", "title": "واکنش طبیعی به رویداد",
             "summary": "نمره شما (۰-۲۳) نشان‌دهنده واکنش طبیعی به رویداد استرس‌زا است.",
             "details": "شما علائم قابل توجهی از استرس پس از رویداد نشان نمی‌دهید.",
             "recommendations": "• ادامه فعالیت‌های روزمره\n• صحبت با دیگران در صورت نیاز",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "Mild", "scaleKey": "total", "title": "تأثیر خفیف رویداد",
             "summary": "نمره شما (۲۴-۳۲) نشان‌دهنده تأثیر خفیف رویداد استرس‌زا است.",
             "details": "برخی علائم استرس پس از رویداد تجربه می‌کنید که نیاز به توجه دارد.",
             "recommendations": "• تکنیک‌های آرام‌سازی\n• صحبت با فرد مورد اعتماد\n• در صورت تداوم، مشاوره با متخصص",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "Moderate", "scaleKey": "total", "title": "تأثیر متوسط رویداد",
             "summary": "نمره شما (۳۳-۳۶) نشان‌دهنده تأثیر قابل توجه رویداد بر شماست.",
             "details": "علائمی مانند افکار مزاحم، اجتناب، یا بی‌خوابی ممکن است آزاردهنده باشند.",
             "recommendations": "• مشاوره با روان‌شناس توصیه می‌شود\n• درمان‌های مبتنی بر تروما می‌توانند کمک‌کننده باشند",
             "disclaimer": "مراجعه به متخصص توصیه می‌شود."},
            {"level_label": "Severe", "scaleKey": "total", "title": "تأثیر شدید - احتمال PTSD",
             "summary": "نمره شما (۳۷+) نشان‌دهنده تأثیر شدید رویداد و احتمال PTSD است.",
             "details": "علائم شدیدی تجربه می‌کنید که می‌تواند بر کیفیت زندگی تأثیر جدی بگذارد.",
             "recommendations": "• مراجعه به روان‌پزشک یا روان‌شناس متخصص تروما\n• درمان‌های تخصصی مانند EMDR",
             "disclaimer": "این وضعیت نیاز به ارزیابی و درمان تخصصی دارد."}
        ]
    },
    "moci": {
        "cutoffs": [
            {"scaleKey": "total", "min": 0, "max": 10, "label": "Normal", "labelFa": "طبیعی"},
            {"scaleKey": "total", "min": 11, "max": 15, "label": "Mild", "labelFa": "خفیف"},
            {"scaleKey": "total", "min": 16, "max": 20, "label": "Moderate", "labelFa": "متوسط"},
            {"scaleKey": "total", "min": 21, "max": 30, "label": "Severe", "labelFa": "شدید"}
        ],
        "analysis_templates": [
            {"level_label": "Normal", "scaleKey": "total", "title": "بدون علائم وسواس قابل توجه",
             "summary": "نمره شما (۰-۱۰) در محدوده طبیعی است.",
             "details": "شما علائم وسواس فکری-عملی قابل توجهی نشان نمی‌دهید.",
             "recommendations": "• ادامه سبک زندگی سالم",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "Mild", "scaleKey": "total", "title": "علائم وسواس خفیف",
             "summary": "نمره شما (۱۱-۱۵) نشان‌دهنده برخی علائم وسواسی خفیف است.",
             "details": "ممکن است گاهی افکار تکراری یا رفتارهای وسواسی خفیف داشته باشید.",
             "recommendations": "• توجه به الگوهای فکری\n• در صورت تداوم، مشاوره با متخصص",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "Moderate", "scaleKey": "total", "title": "علائم وسواس متوسط",
             "summary": "نمره شما (۱۶-۲۰) نشان‌دهنده علائم وسواسی در سطح متوسط است.",
             "details": "افکار مزاحم یا رفتارهای تکراری ممکن است وقت قابل توجهی از شما بگیرند.",
             "recommendations": "• مشاوره با روان‌شناس توصیه می‌شود\n• درمان شناختی-رفتاری (CBT) و ERP مؤثر هستند",
             "disclaimer": "مراجعه به متخصص توصیه می‌شود."},
            {"level_label": "Severe", "scaleKey": "total", "title": "علائم وسواس شدید",
             "summary": "نمره شما (۲۱-۳۰) نشان‌دهنده علائم وسواسی شدید است.",
             "details": "وسواس‌ها و اجبارها احتمالاً بر زندگی روزمره تأثیر جدی گذاشته‌اند.",
             "recommendations": "• مراجعه به روان‌پزشک یا روان‌شناس متخصص OCD\n• ترکیب دارودرمانی و روان‌درمانی",
             "disclaimer": "این وضعیت نیاز به درمان تخصصی دارد."}
        ]
    },
    "lsas": {
        "cutoffs": [
            {"scaleKey": "total", "min": 0, "max": 29, "label": "NoSocial", "labelFa": "بدون اضطراب اجتماعی"},
            {"scaleKey": "total", "min": 30, "max": 49, "label": "Mild", "labelFa": "اضطراب اجتماعی خفیف"},
            {"scaleKey": "total", "min": 50, "max": 64, "label": "Moderate", "labelFa": "اضطراب اجتماعی متوسط"},
            {"scaleKey": "total", "min": 65, "max": 79, "label": "MarkedSocial", "labelFa": "اضطراب اجتماعی قابل توجه"},
            {"scaleKey": "total", "min": 80, "max": 144, "label": "Severe", "labelFa": "اضطراب اجتماعی شدید"}
        ],
        "analysis_templates": [
            {"level_label": "NoSocial", "scaleKey": "total", "title": "بدون اضطراب اجتماعی قابل توجه",
             "summary": "نمره شما (۰-۲۹) نشان‌دهنده عدم وجود اضطراب اجتماعی قابل توجه است.",
             "details": "شما در موقعیت‌های اجتماعی راحت هستید.",
             "recommendations": "• ادامه تعاملات اجتماعی مثبت",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "Mild", "scaleKey": "total", "title": "اضطراب اجتماعی خفیف",
             "summary": "نمره شما (۳۰-۴۹) نشان‌دهنده اضطراب اجتماعی خفیف است.",
             "details": "در برخی موقعیت‌های اجتماعی ممکن است احساس ناراحتی کنید.",
             "recommendations": "• تمرین تدریجی در موقعیت‌های اجتماعی\n• تکنیک‌های آرام‌سازی",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "Moderate", "scaleKey": "total", "title": "اضطراب اجتماعی متوسط",
             "summary": "نمره شما (۵۰-۶۴) نشان‌دهنده اضطراب اجتماعی متوسط است.",
             "details": "اضطراب در موقعیت‌های اجتماعی ممکن است بر روابط و عملکرد تأثیر بگذارد.",
             "recommendations": "• مشاوره با روان‌شناس توصیه می‌شود\n• گروه‌درمانی می‌تواند مفید باشد",
             "disclaimer": "مراجعه به متخصص توصیه می‌شود."},
            {"level_label": "MarkedSocial", "scaleKey": "total", "title": "اضطراب اجتماعی قابل توجه",
             "summary": "نمره شما (۶۵-۷۹) نشان‌دهنده اضطراب اجتماعی قابل توجه است.",
             "details": "ممکن است از بسیاری موقعیت‌های اجتماعی اجتناب کنید.",
             "recommendations": "• مراجعه به روان‌شناس یا روان‌پزشک\n• درمان شناختی-رفتاری (CBT) مؤثر است",
             "disclaimer": "این وضعیت نیاز به درمان تخصصی دارد."},
            {"level_label": "Severe", "scaleKey": "total", "title": "اضطراب اجتماعی شدید",
             "summary": "نمره شما (۸۰+) نشان‌دهنده اضطراب اجتماعی شدید است.",
             "details": "اضطراب اجتماعی به طور جدی بر زندگی روزمره تأثیر گذاشته است.",
             "recommendations": "• مراجعه فوری به روان‌پزشک\n• ترکیب دارودرمانی و روان‌درمانی",
             "disclaimer": "این وضعیت نیاز به درمان تخصصی فوری دارد."}
        ]
    },
    "eat-26": {
        "cutoffs": [
            {"scaleKey": "total", "min": 0, "max": 19, "label": "Normal", "labelFa": "طبیعی"},
            {"scaleKey": "total", "min": 20, "max": 78, "label": "AtRisk", "labelFa": "در معرض خطر اختلال خوردن"}
        ],
        "analysis_templates": [
            {"level_label": "Normal", "scaleKey": "total", "title": "رفتارهای خوردن طبیعی",
             "summary": "نمره شما (کمتر از ۲۰) نشان‌دهنده رفتارهای خوردن طبیعی است.",
             "details": "شما نگرش و رفتارهای سالمی نسبت به غذا و وزن دارید.",
             "recommendations": "• حفظ تغذیه متعادل\n• ورزش منظم برای سلامتی",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "AtRisk", "scaleKey": "total", "title": "در معرض خطر اختلال خوردن",
             "summary": "نمره شما (۲۰ یا بیشتر) نشان‌دهنده نگرش‌ها و رفتارهای نگران‌کننده نسبت به غذا و وزن است.",
             "details": "این نمره نشان می‌دهد که ممکن است در معرض خطر اختلال خوردن باشید یا نشانه‌هایی از آن داشته باشید.",
             "recommendations": "• مراجعه به متخصص تغذیه و روان‌شناس\n• ارزیابی کامل توسط پزشک\n• از رژیم‌های شدید خودداری کنید",
             "disclaimer": "این نتیجه به معنای تشخیص قطعی نیست اما نیاز به ارزیابی تخصصی دارد."}
        ]
    },
    "whoqol-bref": {
        "cutoffs": [
            {"scaleKey": "total", "min": 0, "max": 40, "label": "Poor", "labelFa": "کیفیت زندگی ضعیف"},
            {"scaleKey": "total", "min": 41, "max": 60, "label": "Moderate", "labelFa": "کیفیت زندگی متوسط"},
            {"scaleKey": "total", "min": 61, "max": 80, "label": "Good", "labelFa": "کیفیت زندگی خوب"},
            {"scaleKey": "total", "min": 81, "max": 130, "label": "VeryGood", "labelFa": "کیفیت زندگی بسیار خوب"}
        ],
        "analysis_templates": [
            {"level_label": "Poor", "scaleKey": "total", "title": "کیفیت زندگی ضعیف",
             "summary": "نمره شما نشان‌دهنده کیفیت زندگی نامطلوب در چندین حوزه است.",
             "details": "ممکن است در زمینه سلامت جسمی، روانی، روابط اجتماعی یا محیط زندگی چالش‌هایی داشته باشید.",
             "recommendations": "• شناسایی حوزه‌های نیازمند بهبود\n• مشاوره با متخصصین مرتبط\n• تقویت شبکه حمایت اجتماعی",
             "disclaimer": "مراجعه به متخصص برای بهبود کیفیت زندگی توصیه می‌شود."},
            {"level_label": "Moderate", "scaleKey": "total", "title": "کیفیت زندگی متوسط",
             "summary": "نمره شما نشان‌دهنده کیفیت زندگی در حد متوسط است.",
             "details": "در برخی حوزه‌ها وضعیت خوب و در برخی دیگر جای بهبود دارید.",
             "recommendations": "• تمرکز بر حوزه‌های نیازمند بهبود\n• حفظ نقاط قوت فعلی",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "Good", "scaleKey": "total", "title": "کیفیت زندگی خوب",
             "summary": "نمره شما نشان‌دهنده کیفیت زندگی خوب است.",
             "details": "شما در بیشتر حوزه‌های زندگی رضایت دارید.",
             "recommendations": "• حفظ سبک زندگی فعلی\n• توسعه بیشتر نقاط قوت",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "VeryGood", "scaleKey": "total", "title": "کیفیت زندگی بسیار خوب",
             "summary": "نمره شما نشان‌دهنده کیفیت زندگی عالی است.",
             "details": "شما در همه حوزه‌های مهم زندگی رضایت بالایی دارید.",
             "recommendations": "• ادامه مسیر فعلی\n• کمک به دیگران در بهبود کیفیت زندگی",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."}
        ]
    },
    "mbi": {
        "cutoffs": [
            {"scaleKey": "emotional_exhaustion", "min": 0, "max": 16, "label": "Low", "labelFa": "خستگی هیجانی پایین"},
            {"scaleKey": "emotional_exhaustion", "min": 17, "max": 26, "label": "Moderate", "labelFa": "خستگی هیجانی متوسط"},
            {"scaleKey": "emotional_exhaustion", "min": 27, "max": 54, "label": "High", "labelFa": "خستگی هیجانی بالا"},
            {"scaleKey": "depersonalization", "min": 0, "max": 6, "label": "Low", "labelFa": "مسخ شخصیت پایین"},
            {"scaleKey": "depersonalization", "min": 7, "max": 12, "label": "Moderate", "labelFa": "مسخ شخصیت متوسط"},
            {"scaleKey": "depersonalization", "min": 13, "max": 30, "label": "High", "labelFa": "مسخ شخصیت بالا"},
            {"scaleKey": "personal_accomplishment", "min": 0, "max": 31, "label": "Low", "labelFa": "موفقیت فردی پایین (فرسودگی بالا)"},
            {"scaleKey": "personal_accomplishment", "min": 32, "max": 38, "label": "Moderate", "labelFa": "موفقیت فردی متوسط"},
            {"scaleKey": "personal_accomplishment", "min": 39, "max": 48, "label": "High", "labelFa": "موفقیت فردی بالا (فرسودگی پایین)"}
        ],
        "analysis_templates": [
            {"level_label": "Low", "scaleKey": "emotional_exhaustion", "title": "خستگی هیجانی پایین",
             "summary": "نمره خستگی هیجانی شما در سطح پایین است.",
             "details": "شما انرژی هیجانی خوبی برای کارتان دارید.",
             "recommendations": "• حفظ تعادل کار و زندگی",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "High", "scaleKey": "emotional_exhaustion", "title": "خستگی هیجانی بالا",
             "summary": "نمره خستگی هیجانی شما نشان‌دهنده خستگی شدید شغلی است.",
             "details": "احساس تخلیه و خستگی از کار می‌کنید که نشانه فرسودگی است.",
             "recommendations": "• استراحت کافی\n• مشاوره با متخصص بهداشت شغلی\n• بازنگری در حجم کار",
             "disclaimer": "توجه جدی به بازسازی انرژی ضروری است."},
            {"level_label": "Low", "scaleKey": "depersonalization", "title": "مسخ شخصیت پایین",
             "summary": "نمره مسخ شخصیت شما پایین است.",
             "details": "شما هنوز ارتباط خوبی با ارباب‌رجوع/همکاران دارید.",
             "recommendations": "• حفظ روابط مثبت کاری",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "High", "scaleKey": "depersonalization", "title": "مسخ شخصیت بالا",
             "summary": "نمره مسخ شخصیت شما نشان‌دهنده فاصله‌گرفتن هیجانی از کار است.",
             "details": "ممکن است احساس بی‌تفاوتی یا منفی نسبت به دیگران داشته باشید.",
             "recommendations": "• بازنگری در نگرش کاری\n• مشاوره با روان‌شناس صنعتی-سازمانی",
             "disclaimer": "این وضعیت نیاز به توجه دارد."},
            {"level_label": "High", "scaleKey": "personal_accomplishment", "title": "موفقیت فردی بالا",
             "summary": "نمره موفقیت فردی شما نشان‌دهنده رضایت شغلی خوب است.",
             "details": "شما احساس می‌کنید کارتان ارزشمند و مؤثر است.",
             "recommendations": "• ادامه رویکرد مثبت فعلی",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "Low", "scaleKey": "personal_accomplishment", "title": "موفقیت فردی پایین (فرسودگی بالا)",
             "summary": "نمره موفقیت فردی پایین شما نشان‌دهنده کاهش رضایت شغلی است.",
             "details": "احساس می‌کنید کارتان بی‌ارزش است یا تأثیری ندارد.",
             "recommendations": "• شناسایی دستاوردهای کاری\n• مشاوره شغلی\n• بازنگری در اهداف حرفه‌ای",
             "disclaimer": "این وضعیت نیاز به توجه و مداخله دارد."}
        ]
    },
    "enrich": {
        "cutoffs": [
            {"scaleKey": "total", "min": 35, "max": 70, "label": "VeryLow", "labelFa": "رضایت زناشویی بسیار پایین"},
            {"scaleKey": "total", "min": 71, "max": 105, "label": "Low", "labelFa": "رضایت زناشویی پایین"},
            {"scaleKey": "total", "min": 106, "max": 140, "label": "Moderate", "labelFa": "رضایت زناشویی متوسط"},
            {"scaleKey": "total", "min": 141, "max": 175, "label": "High", "labelFa": "رضایت زناشویی بالا"}
        ],
        "analysis_templates": [
            {"level_label": "VeryLow", "scaleKey": "total", "title": "رضایت زناشویی بسیار پایین",
             "summary": "نمره شما نشان‌دهنده نارضایتی جدی از رابطه زناشویی است.",
             "details": "احتمالاً در زمینه‌های ارتباط، حل تعارض، یا رضایت کلی چالش‌های جدی دارید.",
             "recommendations": "• مشاوره زوج‌درمانی فوری توصیه می‌شود\n• صحبت صادقانه با همسر\n• شناسایی مشکلات اصلی",
             "disclaimer": "مراجعه به مشاور خانواده اکیداً توصیه می‌شود."},
            {"level_label": "Low", "scaleKey": "total", "title": "رضایت زناشویی پایین",
             "summary": "نمره شما نشان‌دهنده رضایت پایین از رابطه زناشویی است.",
             "details": "برخی زمینه‌های رابطه نیاز به توجه و بهبود دارند.",
             "recommendations": "• مشاوره زوجی می‌تواند مفید باشد\n• بهبود مهارت‌های ارتباطی\n• افزایش زمان کیفی با همسر",
             "disclaimer": "مشاوره با متخصص توصیه می‌شود."},
            {"level_label": "Moderate", "scaleKey": "total", "title": "رضایت زناشویی متوسط",
             "summary": "نمره شما نشان‌دهنده رضایت متوسط از رابطه زناشویی است.",
             "details": "رابطه شما در برخی زمینه‌ها خوب و در برخی دیگر جای بهبود دارد.",
             "recommendations": "• تقویت نقاط قوت رابطه\n• کار روی زمینه‌های نیازمند بهبود\n• ارتباط منظم و صادقانه",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "High", "scaleKey": "total", "title": "رضایت زناشویی بالا",
             "summary": "نمره شما نشان‌دهنده رضایت خوب از رابطه زناشویی است.",
             "details": "شما و همسرتان رابطه سالم و رضایت‌بخشی دارید.",
             "recommendations": "• حفظ ارتباط مثبت\n• قدردانی از همسر\n• ادامه رشد مشترک",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."}
        ]
    },
    "scl-90-r": {
        "cutoffs": [
            {"scaleKey": "gsi", "min": 0.0, "max": 0.99, "label": "Normal", "labelFa": "طبیعی"},
            {"scaleKey": "gsi", "min": 1.0, "max": 1.49, "label": "Mild", "labelFa": "خفیف"},
            {"scaleKey": "gsi", "min": 1.5, "max": 1.99, "label": "Moderate", "labelFa": "متوسط"},
            {"scaleKey": "gsi", "min": 2.0, "max": 4.0, "label": "Severe", "labelFa": "شدید"}
        ],
        "analysis_templates": [
            {"level_label": "Normal", "scaleKey": "gsi", "title": "وضعیت روان‌شناختی طبیعی",
             "summary": "شاخص شدت کلی (GSI) شما در محدوده طبیعی است.",
             "details": "شما علائم روان‌شناختی قابل توجهی نشان نمی‌دهید.",
             "recommendations": "• حفظ سبک زندگی سالم\n• مدیریت استرس‌های روزمره",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "Mild", "scaleKey": "gsi", "title": "علائم روان‌شناختی خفیف",
             "summary": "شاخص شدت کلی (GSI) شما نشان‌دهنده برخی علائم خفیف است.",
             "details": "ممکن است در برخی حوزه‌ها مانند اضطراب یا افسردگی علائم خفیفی داشته باشید.",
             "recommendations": "• توجه به خودمراقبتی\n• در صورت تداوم، مشاوره با متخصص",
             "disclaimer": "این نتیجه جایگزین ارزیابی تخصصی نیست."},
            {"level_label": "Moderate", "scaleKey": "gsi", "title": "علائم روان‌شناختی متوسط",
             "summary": "شاخص شدت کلی (GSI) شما نشان‌دهنده علائم در سطح متوسط است.",
             "details": "علائم روان‌شناختی ممکن است بر عملکرد روزانه تأثیر بگذارند.",
             "recommendations": "• مشاوره با روان‌شناس یا روان‌پزشک توصیه می‌شود\n• ارزیابی کامل‌تر زیرمقیاس‌ها",
             "disclaimer": "مراجعه به متخصص بهداشت روان توصیه می‌شود."},
            {"level_label": "Severe", "scaleKey": "gsi", "title": "علائم روان‌شناختی شدید",
             "summary": "شاخص شدت کلی (GSI) شما نشان‌دهنده علائم شدید روان‌شناختی است.",
             "details": "این نمره نشان‌دهنده آشفتگی روان‌شناختی قابل توجه است که نیاز به مداخله تخصصی دارد.",
             "recommendations": "• مراجعه فوری به روان‌پزشک\n• ارزیابی کامل تشخیصی",
             "disclaimer": "این وضعیت نیاز به مراجعه فوری به متخصص دارد."}
        ]
    }
}

def update_test_file(filename):
    filepath = os.path.join(TESTS_DIR, filename)
    slug = filename.replace('.json', '')
    
    if slug not in ANALYSIS_UPDATES:
        print(f"No updates defined for {slug}")
        return
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updates = ANALYSIS_UPDATES[slug]
    
    # Update cutoffs if provided
    if 'cutoffs' in updates:
        data['cutoffs'] = updates['cutoffs']
    
    # Update analysis_templates if provided
    if 'analysis_templates' in updates:
        data['analysis_templates'] = updates['analysis_templates']
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    
    print(f"Updated {filename}")

if __name__ == '__main__':
    for slug in ANALYSIS_UPDATES:
        filename = f"{slug}.json"
        if os.path.exists(os.path.join(TESTS_DIR, filename)):
            update_test_file(filename)
        else:
            print(f"File not found: {filename}")
    
    print("\nAll tests updated!")
