# MindLab - پلتفرم تست‌های روان‌شناسی

A modern psychological assessment platform built with React + Vite + TypeScript, Cloudflare Pages Functions, D1 Database, and Firebase Authentication.

## 🚀 Features

- **15+ Standardized Psychological Tests**: PHQ-9, GAD-7, BDI-II, BAI, DASS-21, and more
- **Categorized Tests**: Depression, Anxiety, Stress, OCD, PTSD, Bipolar, ADHD, Eating Disorders, Sleep, Substance Use, Suicide Risk
- **Analytical Results**: Score-based interpretations with detailed analysis and recommendations
- **Risk Detection**: Automatic flagging of critical responses (e.g., suicidal ideation)
- **Bilingual Support**: Persian (فارسی) and English content
- **Admin Panel**: Sync tests from code, manage questions and options
- **Firebase Authentication**: Secure user login with email or Google

## 📋 Test Categories

| Category | Tests |
|----------|-------|
| General Screening | GHQ-12 |
| Depression | PHQ-9, BDI-II |
| Anxiety | GAD-7, BAI |
| Stress | PSS-10, DASS-21 |
| OCD | OCI-R |
| PTSD / Trauma | PCL-5 |
| Bipolar / Mania | MDQ |
| ADHD | ASRS v1.1 |
| Eating Disorders | EAT-26 |
| Sleep | ISI |
| Substance Use | AUDIT |
| Suicide / Risk | C-SSRS |

## 🛠️ Setup

### 1. Prerequisites

- Node.js 18+
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account with Pages and D1 access
- Firebase project for authentication

### 2. Environment Variables

Create `apps/web/.dev.vars`:

```env
ADMIN_UIDS=uid1,uid2
```

Set these in Cloudflare Pages settings:
- `ADMIN_UIDS`: Comma-separated Firebase UIDs with admin access

### 3. Install Dependencies

```bash
cd apps/web
npm install
```

### 4. Create D1 Database

```bash
wrangler d1 create mindlab-db
```

Update `wrangler.toml` with the database ID.

### 5. Run Migrations

```bash
# Apply all migrations
wrangler d1 execute mindlab-db --file=../../migrations/0001_init.sql
wrangler d1 execute mindlab-db --file=../../migrations/0002_add_options_order.sql
wrangler d1 execute mindlab-db --file=../../migrations/0003_upgrade_schema.sql
```

### 6. Local Development

```bash
npm run dev
```

### 7. Deploy

```bash
npm run build
wrangler pages deploy dist
```

## 🔄 Syncing Tests to Database

Tests are defined as JSON files in `apps/web/src/data/tests/`.

### Admin Sync Process

1. Login with an admin account (UID in `ADMIN_UIDS`)
2. Go to `/admin`
3. Click "Sync Tests"
4. Click "Sync Tests from Code"

This will:
- Upsert all tests based on `slug`
- Create/update scales, questions, options
- Create cutoffs and analysis templates
- Create risk rules for safety detection

## 📁 Project Structure

```
mindlab/
├── apps/web/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── data/tests/     # Test JSON definitions
│   │   ├── lib/            # API and Firebase utilities
│   │   ├── pages/          # Page components
│   │   └── main.tsx        # App entry point
│   ├── functions/api/      # Cloudflare Pages Functions
│   └── index.html
├── migrations/             # D1 SQL migrations
└── wrangler.toml
```

## 📊 Test JSON Format

```json
{
  "slug": "phq-9",
  "name": "PHQ-9",
  "nameFa": "پرسشنامه سلامت بیمار - ۹ سوالی",
  "category": "Depression",
  "categoryFa": "افسردگی",
  "analysis_type": "direct",
  "warning": "این نتیجه جایگزین ارزیابی تخصصی نیست.",
  "scales": [{"key": "total", "name": "Total Score", "nameFa": "نمره کل"}],
  "questions": [
    {
      "order": 1,
      "text": "...",
      "scaleKey": "total",
      "riskItem": false,
      "options": [
        {"text": "اصلاً", "score": 0},
        {"text": "چند روز", "score": 1}
      ]
    }
  ],
  "cutoffs": [
    {"scaleKey": "total", "min": 0, "max": 4, "label": "Minimal", "labelFa": "حداقل"}
  ],
  "analysis_templates": [
    {
      "level_label": "Minimal",
      "scaleKey": "total",
      "title": "علائم حداقلی",
      "summary": "...",
      "details": "...",
      "recommendations": "...",
      "disclaimer": "..."
    }
  ],
  "risk_rules": [
    {"condition": "q9_score >= 1", "message": "⚠️ هشدار", "severity": "critical"}
  ]
}
```

## ⚠️ Safety Features

- **Risk Detection**: Questions marked with `riskItem: true` trigger special handling
- **Risk Rules**: Conditions like `q9_score >= 1` generate visible warnings
- **Emergency Alerts**: Critical risk flags display prominently with hotline numbers
- **Disclaimer**: All results include a disclaimer about professional evaluation

## 🔐 Authentication

- Firebase Auth handles user login
- `ADMIN_UIDS` environment variable controls admin access
- Admin middleware protects `/api/admin/*` endpoints

## 📝 License

MIT License

---

⚠️ **Disclaimer**: This platform is for screening purposes only. Results do not constitute a diagnosis and should not replace professional evaluation by a psychologist or psychiatrist.
