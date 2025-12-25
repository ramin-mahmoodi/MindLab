// English translations
const en = {
    // Navigation
    'nav.home': 'Home',
    'nav.tests': 'Tests',
    'nav.results': 'Results',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.logout': 'Logout',

    // Home page
    'home.title': 'MindLab',
    'home.subtitle': 'Psychological Assessment Platform',
    'home.description': 'Explore your mental health with standardized psychological assessments.',
    'home.cta': 'Start Assessment',
    'home.features.title': 'Features',
    'home.features.scientific': 'Evidence-Based',
    'home.features.scientific.desc': 'Standardized psychological assessments',
    'home.features.private': 'Private',
    'home.features.private.desc': 'Your results are completely confidential',
    'home.features.instant': 'Instant Results',
    'home.features.instant.desc': 'Immediate analysis and interpretation',

    // Tests page
    'tests.title': 'Psychological Assessments',
    'tests.subtitle': 'Choose an assessment to begin',
    'tests.login.prompt': 'Please login to take tests and save your results.',
    'tests.empty': 'No tests available. Sync tests from admin panel.',
    'tests.start': 'Start Test',
    'tests.login.required': 'Login to Start',
    'tests.disclaimer': 'All tests on this site are for screening purposes only and do not replace professional evaluation by a psychologist or psychiatrist.',

    // Run test page
    'test.question': 'Question',
    'test.of': 'of',
    'test.next': 'Next',
    'test.previous': 'Previous',
    'test.finish': 'Finish Test',
    'test.warning': 'Warning',
    'test.loading': 'Loading...',

    // Results page
    'results.title': 'My Results',
    'results.subtitle': 'History of completed assessments',
    'results.empty': 'You haven\'t completed any tests yet.',
    'results.view': 'View Details',
    'results.score': 'Score',
    'results.date': 'Date',

    // Result detail page
    'result.title': 'Test Result',
    'result.total.score': 'Total Score',
    'result.analysis': 'Analysis',
    'result.recommendations': 'Recommendations',
    'result.retake': 'Retake Test',
    'result.other.tests': 'Other Tests',
    'result.back': 'Back to Results',
    'result.disclaimer': 'This result does not replace professional evaluation by a psychologist or psychiatrist.',

    // Login page
    'login.title': 'Login',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.google': 'Sign in with Google',
    'login.register': 'Register',
    'login.forgot': 'Forgot Password',
    'login.no.account': 'Don\'t have an account?',
    'login.have.account': 'Already have an account?',

    // Admin
    'admin.dashboard': 'Admin Dashboard',
    'admin.sync': 'Sync Tests',
    'admin.sync.desc': 'Sync test definitions from code to database',
    'admin.sync.button': 'Sync Now',
    'admin.tests': 'Manage Tests',
    'admin.import': 'Import/Export',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.back': 'Back',
    'common.success': 'Success',

    // Categories
    'category.General': 'General Screening',
    'category.Depression': 'Depression',
    'category.Anxiety': 'Anxiety',
    'category.Stress': 'Stress',
    'category.OCD': 'OCD',
    'category.PTSD': 'PTSD / Trauma',
    'category.Bipolar': 'Bipolar / Mania',
    'category.ADHD': 'ADHD',
    'category.Eating': 'Eating Disorders',
    'category.Sleep': 'Sleep',
    'category.Substance': 'Substance Use',
    'category.Suicide': 'Suicide / Risk',
} as const;

export default en;
