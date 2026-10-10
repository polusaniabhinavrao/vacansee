# Vacansee — Full-Stack Job Portal

> **National Hackathon Project 2026**  
> Accessible Local & Professional Employment Portal connecting job seekers and employers across South India in **English** and **Telugu (తెలుగు)**.

---

## 🌟 1. Product Overview & Key Differentiators

**Vacansee** is designed from the ground up to solve real community employment challenges. While conventional job portals focus almost exclusively on multi-year corporate careers, Vacansee bridges both local business and tech employment sectors:

- **College Students & Youth**: Weekend shifts, flexible evening roles, tutoring, and cafe jobs that fit academic schedules.
- **Freshers**: Entry-level software, customer support, and administrative jobs with transparent requirements.
- **Local Neighborhood Businesses**: Retail supermarkets, salons, restaurants, coffee roasteries, and private coaching centers needing fast, simplified hiring.
- **Bilingual Interface**: Full, natural Telugu and English language toggles across all pages, navigation, search filters, and status tags.
- **Zero Gatekeeping**: 1-click applications with transparent hiring status pipelines (`Applied` → `Reviewing` → `Shortlisted` → `Hired` / `Not Selected`).

---

## 🛠️ 2. Technology Stack

- **Frontend**: React 19 + Vite + JavaScript (ES6+)
- **Routing**: React Router DOM v7 (Role-based access & protected routes)
- **Styling**: Standard CSS Modules & CSS Custom Properties (`variables.css`) — *No Tailwind CSS*
- **Icons**: Lucide React
- **Backend & Auth**: Supabase JavaScript Client (`@supabase/supabase-js`)
- **Database**: PostgreSQL with Row Level Security (RLS) policies and triggers

---

## 🎨 3. UI and Branding Direction

- **Warm Dark Palette**:
  - Main background: `#171613` (never pure black)
  - Secondary background: `#201E1A`
  - Elevated surfaces: `#28251F`
  - Primary text: `#F4F0E8`
  - Secondary text: `#B2AA9D`
  - Muted text: `#827B71`
  - Borders: `#39352D` (subtle, non-distracting)
  - Primary accent: `#D9A56C` (warm amber / sand accent, used selectively)
  - Secondary accent: `#A8B5A0` (muted sage green)
  - Semantic statuses: subtle sage green (`#A8B5A0`) for hired/active, muted red (`#C96B64`) for rejected/closed
- **Typography**:
  - Headings: `Manrope` (clean, confident, tight line-height, restrained weights)
  - Body & Interface: `Inter`
  - Native fallback: `Noto Sans Telugu` for natural Telugu language rendering
- **Editorial Layout**:
  - Split hero composition: large headline *"Work that fits your life."*, supporting copy, and live discovery visual
  - Differentiated category index cards (`01` through `06`)
  - Dedicated workspace sidebars for Seeker and Employer dashboards
  - Restrained components: no generic AI SaaS gradients, no cartoonish bubbles, no glassmorphism clutter.

---

## 🗄️ 4. Relational Database Design & RLS

All database schema definitions and Row Level Security policies are provided in:
- `supabase/migrations/20260311_init_schema_and_rls.sql`
- `supabase/migrations/20260311_seed_data.sql`

### Tables Schema Summary

| Table | Primary Key | Foreign Keys & References | Purpose |
|---|---|---|---|
| `profiles` | `id` (UUID) | References `auth.users(id)` ON DELETE CASCADE | Stores role (`seeker` \| `employer`), full name, phone, headline, bio, skills, company name, location, resume URL |
| `jobs` | `id` (UUID) | `employer_id` references `profiles(id)` ON DELETE CASCADE | Stores job title, category, employment type, location, remote flag, local business flag, salary min/max/period, description, requirements, benefits, vacancies, contact info, status (`active` \| `closed`) |
| `applications` | `id` (UUID) | `job_id` references `jobs(id)`<br>`applicant_id` references `profiles(id)` | Stores cover note, resume link, contact phone, status (`applied`, `reviewing`, `shortlisted`, `rejected`, `hired`). **Unique constraint on `(job_id, applicant_id)`** prevents duplicate applications |
| `saved_jobs` | `id` (UUID) | `job_id` references `jobs(id)`<br>`user_id` references `profiles(id)` | Bookmarked jobs for users. **Unique constraint on `(job_id, user_id)`** |

### Row Level Security (RLS) Enforcement

- **`profiles`**:
  - `SELECT`: Viewable by authenticated users and employers reviewing applicants.
  - `INSERT` / `UPDATE`: Strictly restricted to `auth.uid() = id`.
- **`jobs`**:
  - `SELECT`: Anyone can view active listings; employers can view their own unlisted/closed jobs.
  - `INSERT`: Restricted to `auth.uid() = employer_id` and verified `role = 'employer'`.
  - `UPDATE` / `DELETE`: Restricted to `auth.uid() = employer_id`.
- **`applications`**:
  - `SELECT`: Allowed for applicant (`auth.uid() = applicant_id`) or the employer owning the job.
  - `INSERT`: Restricted to `auth.uid() = applicant_id` and verified `role = 'seeker'`.
  - `UPDATE`: Restricted to the employer who owns the job (`job.employer_id = auth.uid()`) to update status.
- **`saved_jobs`**:
  - `SELECT`, `INSERT`, `DELETE`: Restricted strictly to `auth.uid() = user_id`.

---

## 🚀 5. Getting Started & Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Installation
```bash
# Clone or navigate to the project directory
cd vacansee

# Install dependencies
npm install
```

### 3. Environment Variables Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your Supabase project credentials in `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Database Setup (Supabase Cloud)
1. Log in to [supabase.com](https://supabase.com) and create a new project.
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of `supabase/migrations/20260311_init_schema_and_rls.sql`.
4. Run `supabase/migrations/20260311_seed_data.sql` to populate sample jobs (Weekend Barista, Store Billing Assistant, Junior React Dev, Math Tutor, etc.).
5. Under **Project Settings > API**, copy the **Project URL** and **anon public API key** into your `.env`.

### 5. Dual-Mode Architecture (Instant Demo Mode)
If Supabase credentials are not yet configured:
- The app displays a clear banner: **"Running in Interactive Local Demo Mode"** with a 1-click **Setup Guide Modal**.
- All user journeys (posting jobs, searching with filters, applying, status updates, saving jobs, language toggle) are fully testable immediately using persistent local storage and demo accounts without any crashes.

### 6. Development Server
```bash
npm run dev
```

### 7. Production Build
```bash
npm run build
npm run preview
```

---

## 📋 6. Application Architecture & Pages

```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx / Navbar.module.css    # Responsive bilingual navbar & role menu
│   │   ├── Footer.jsx / Footer.module.css    # Responsive footer & language switcher
│   │   ├── SupabaseBanner.jsx                # Connection status indicator & setup guide
│   │   ├── StatusBadge.jsx                   # Semantic badges for hiring pipeline
│   │   ├── Badge.jsx                         # Tags for Weekend, Local, Remote, Tech
│   │   ├── LoadingSpinner.jsx                # Teal loading indicator
│   │   └── EmptyState.jsx                    # Reusable empty list states
│   └── jobs/
│       ├── JobCard.jsx / JobCard.module.css  # Job listing card with bookmarking
│       ├── JobFilters.jsx                    # Reactive search & multi-category filters
│       └── ApplyModal.jsx                    # 1-click application modal with validation
├── context/
│   ├── AuthContext.jsx                       # Session persistence, Supabase Auth & demo switch
│   ├── LanguageContext.jsx                   # English & Telugu translation provider
│   └── JobContext.jsx                        # Full CRUD, duplicate check, and status updates
├── data/
│   └── mockJobs.js                           # Pre-seeded realistic local & tech listings
├── i18n/
│   └── translations.js                       # Comprehensive English & Telugu dictionaries
├── lib/
│   └── supabase.js                           # Centralized Supabase client & health check
├── pages/
│   ├── public/
│   │   ├── LandingPage.jsx                   # Hero, search bar, category cards, CTAs
│   │   ├── JobsPage.jsx                      # Search results, filter sidebar, responsive grid
│   │   ├── JobDetailPage.jsx                 # Full details, employer contact, apply modal
│   │   ├── LoginPage.jsx                     # Authentication with demo quick-logins
│   │   ├── RegisterPage.jsx                  # Role selection (Seeker vs Employer)
│   │   ├── AboutPage.jsx                     # Mission and community employment focus
│   │   └── ContactPage.jsx                   # Contact information and inquiry form
│   ├── seeker/
│   │   ├── SeekerDashboard.jsx               # Application analytics & recent table
│   │   ├── SeekerProfile.jsx                 # Contact, headline, bio, skills, resume link
│   │   ├── AppliedJobs.jsx                   # Hiring status timeline progression
│   │   └── SavedJobs.jsx                     # Bookmarked opportunities
│   ├── employer/
│   │   ├── EmployerDashboard.jsx             # Active listings & applicant counters
│   │   ├── ManageJobsPage.jsx                # Status toggle, edit, and applicant links
│   │   ├── PostJobPage.jsx                   # Create & edit vacancies with local tags
│   │   └── JobApplicantsPage.jsx             # Review candidates & update status live
│   └── NotFoundPage.jsx                      # 404 handler
├── routes/
│   ├── AppRoutes.jsx                         # Main route map
│   └── ProtectedRoute.jsx                    # Role authorization & redirection
└── styles/
    ├── variables.css                         # Warm off-white & teal design tokens
    └── index.css                             # Resets, typography, and primitives
```

---

## ✅ 7. Feature Verification Checklist

| Feature | Status | Verification Notes |
|---|---|---|
| **English / Telugu Switch** | ✅ Verified | Toggle in Navbar and Footer instantly switches all UI text, statuses, headings, and filter labels |
| **Landing Page Discovery** | ✅ Verified | Search bar with keyword and location inputs connects directly to filtered search results |
| **Category & Sector Exploration** | ✅ Verified | Filter by Hospitality, Retail, Tutoring, Software, Salon, Customer Support |
| **Local Business Tagging** | ✅ Verified | Distinctive badges for neighborhood stores, cafes, and tutors vs corporate tech |
| **Student / Weekend Jobs** | ✅ Verified | Dedicated employment type filters for Weekend and Part-time positions |
| **Job Details View** | ✅ Verified | Salary formatting, vacancies count, requirements list, perks, direct employer contact |
| **1-Click Application Modal** | ✅ Verified | Pre-fills name, email, phone; captures resume link and cover note |
| **Duplicate Application Guard** | ✅ Verified | Prevents submitting twice for the same job with helpful status notice |
| **Bookmarking / Saved Jobs** | ✅ Verified | Toggle save icon on any card; view and manage in `/seeker/saved` |
| **Seeker Dashboard** | ✅ Verified | Total applications, shortlisted count, hired count, saved jobs count |
| **Candidate Status Pipeline** | ✅ Verified | Real-time progression tracking (`Applied` → `Reviewing` → `Shortlisted` → `Hired`) |
| **Employer Job Creation & Edit** | ✅ Verified | Complete form with pay frequencies, vacancy count, local business checkbox |
| **Employer Listings Management** | ✅ Verified | Active/Closed status toggling, direct applicant counters |
| **Candidate Status Updates** | ✅ Verified | Employer can mark Reviewing, Shortlist, Hire, or Reject in `/employer/jobs/:id/applicants` |
| **Role-Based Protected Routes** | ✅ Verified | Seeker routes restricted to seekers; Employer routes restricted to employers |
| **Supabase Status Transparency** | ✅ Verified | Connection banner indicates live Supabase sync or local demo mode with setup guide |
