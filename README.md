# NGO Requirement Analyzer 🤝🤖

> **Turn natural-language NGO requirements into actionable, explainable volunteer recommendations using AI & NLP.**

A complete, working full-stack prototype designed for Non-Governmental Organizations (NGOs). The system analyzes conversational, unstructured requests submitted by NGOs, classifies the operational category and subcategory, extracts standardized volunteer skills, calculates request urgency, and transparently ranks matching volunteers from a registered talent pool.

---

## 📑 Table of Contents

- [Problem Statement](#-problem-statement)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [How AI/NLP Analysis Works](#-how-ainlp-analysis-works)
- [Volunteer Matching Algorithm & Scoring Formula](#-volunteer-matching-algorithm--scoring-formula)
- [Demonstration Scenario Walkthrough](#-demonstration-scenario-walkthrough)
- [Installation & Quick Start](#-installation--quick-start)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup (FastAPI + SQLite/PostgreSQL)](#1-backend-setup-fastapi--sqlitepostgresql)
  - [2. Frontend Setup (Next.js + TypeScript + Tailwind)](#2-frontend-setup-nextjs--typescript--tailwind)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Future Enhancements](#-future-enhancements)

---

## 🎯 Problem Statement

Grassroots NGOs frequently submit their assistance needs in open-ended natural language:
> *"We are organizing a weekend education program for underprivileged children and need volunteers who can teach mathematics and basic computer skills in Pune."*

Manually parsing these submissions is slow, subjective, and prone to miscommunication. Organizers struggle to quickly answer:
1. **Domain:** What type of initiative is this (Education, Health, Environment)?
2. **Competencies:** Which specific skills are required?
3. **Urgency:** Is this an immediate crisis (flood, medical relief) or a planned long-term campaign?
4. **Talent Compatibility:** Who among the registered volunteers fits best by skills, location, schedule, and experience?
5. **Explainability:** *Why* should an NGO trust a particular volunteer recommendation?

The **NGO Requirement Analyzer** solves this end-to-end with an automated, transparent, and explainable AI/NLP pipeline.

---

## 🏛️ System Architecture

```text
               +------------------------------------------------------+
               |             Next.js 14 Responsive Frontend           |
               |  (Landing | Request Submission | Results | Dashboard)|
               +---------------------------+--------------------------+
                                           | REST JSON
                                           v
               +------------------------------------------------------+
               |              FastAPI Python Backend Server           |
               |   Routes: /api/requests | /api/volunteers | /stats   |
               +---------------------------+--------------------------+
                                           |
         +---------------------------------+---------------------------------+
         |                                                                   |
         v                                                                   v
+-------------------------------+                         +-----------------------------------+
|     Hybrid AI/NLP Pipeline    |                         |     Relational Database Layer     |
| 1. Text Preprocessing         |                         |  (SQLite / PostgreSQL via         |
| 2. Category Classifier        |                         |   SQLAlchemy ORM)                 |
| 3. Skill Catalog Extractor    |                         |  - NGORequest                     |
| 4. Urgency Detection Engine   |                         |  - Volunteer (22+ Seed Profiles)  |
| 5. Optional LLM API Fallback  |                         |  - AnalysisResult                 |
+---------------+---------------+                         |  - Recommendation                 |
                |                                         +-----------------+-----------------+
                | Structured Attributes                                     | Active Volunteers
                v                                                           v
+---------------------------------------------------------------------------------------------+
|                                Volunteer Matching Engine                                    |
|   Formula: Skill (50%) + Location (20%) + Availability (15%) + Exp (10%) + Interest (5%)    |
|   -> Produces: 0-100% Match Score + Transparent "Why this volunteer?" Explanations          |
+---------------------------------------------------------------------------------------------+
```

---

## ✨ Key Features

- **Unstructured Natural-Language Input:** NGOs can paste raw paragraphs without filling out tedious manual taxonomies.
- **Dual-Engine AI Analysis:**
  - **100% Offline Hybrid NLP Engine:** Uses token normalization, keyword frequency weighting, regex pattern matching, and contextual heuristics. Works completely offline with zero API keys.
  - **Optional LLM Integration:** Automatically activates Gemini / OpenAI enrichment if an API key is placed in `.env`.
- **Domain Categorization & Subcategories:** Classifies into Education (Teaching & Training, Curriculum), Healthcare, Environment, Technology, Community Service, Fundraising, Event Management, Legal, Administration, etc.
- **Standardized Skill Extraction:** 60+ canonical volunteer skills with synonym and regex mapping (e.g., *"teach math"* -> `Teaching`, `Mathematics`).
- **Urgency Detection:** Identifies disaster/crisis terms for High urgency, scheduled event dates for Medium urgency, and ongoing routines for Low urgency with explainable reasons.
- **Explainable Multi-Factor Recommendations:** Every match generates itemized checkmark reasons (e.g. *✓ Mathematics matches required skill*, *✓ Located in Pune*, *✓ Available on Weekends*).
- **Interactive NGO Analytics Dashboard:** Real-time metrics, KPI cards, category distribution bars, urgency breakdown, and top demanded skills.
- **Volunteer Talent Directory:** Multi-filter directory (filter by city, skill, availability, and minimum experience) with detailed volunteer profile modals and dynamic volunteer registration.
- **1-Click College Demo Presets:** Includes pre-configured demo scenarios (especially the Pune Weekend Education scenario) for immediate demonstration during project reviews.

---

## 💻 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons |
| **Backend** | Python 3.12, FastAPI, Uvicorn, Pydantic v2, Pydantic-Settings |
| **AI / NLP** | Hybrid NLP Rule Engine + Canonical Skill Lexicon + Optional Gemini LLM Service |
| **Database** | SQLAlchemy 2.0 ORM, SQLite (default for zero-config local run), PostgreSQL-ready |
| **Data Visualization** | Responsive SVG & Tailwind dynamic analytics charts |

---

## 📂 Project Structure

```text
ngo-requirement-analyzer/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI app entrypoint & lifespan
│   │   ├── config.py                  # Environment settings & CORS
│   │   ├── database.py                # Database connection engine & session
│   │   ├── models/                    # SQLAlchemy database entities
│   │   │   ├── ngo_request.py
│   │   │   ├── volunteer.py
│   │   │   ├── analysis_result.py
│   │   │   └── recommendation.py
│   │   ├── schemas/                   # Pydantic request/response schemas
│   │   │   ├── ngo_request.py
│   │   │   ├── volunteer.py
│   │   │   ├── analysis.py
│   │   │   ├── recommendation.py
│   │   │   └── dashboard.py
│   │   ├── ai/                        # AI & NLP core processing services
│   │   │   ├── analyzer.py            # Unified NLP/LLM orchestrator
│   │   │   ├── skill_catalog.py       # 60+ skills with regex patterns & aliases
│   │   │   ├── category_classifier.py # Domain & subcategory classification
│   │   │   ├── urgency_detector.py    # Urgency analysis & reason generator
│   │   │   └── llm_service.py         # Optional Gemini API connector
│   │   ├── services/
│   │   │   ├── matching_engine.py     # Multi-factor volunteer matching & scoring
│   │   │   └── request_service.py     # Request lifecycle & matching orchestration
│   │   ├── routes/                    # REST API routers
│   │   │   ├── requests.py
│   │   │   ├── volunteers.py
│   │   │   ├── recommendations.py
│   │   │   └── dashboard.py
│   │   └── seed/
│   │       └── seed_data.py           # 22+ realistic volunteers & 5 sample requests
│   ├── requirements.txt
│   ├── run.py                         # Backend startup script
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx             # Root layout with Navbar & Footer
│   │   │   ├── page.tsx               # Professional Landing page
│   │   │   ├── globals.css            # Tailwind custom styling
│   │   │   ├── analyze/
│   │   │   │   └── page.tsx           # NGO Request submission with demo presets
│   │   │   ├── requests/
│   │   │   │   ├── page.tsx           # Request history & filterable audit table
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Comprehensive analysis & recommended volunteers
│   │   │   ├── volunteers/
│   │   │   │   └── page.tsx           # Volunteer search, filters & registration modal
│   │   │   └── dashboard/
│   │   │       └── page.tsx           # KPI cards & visual analytics charts
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── SkillBadge.tsx
│   │   │   ├── UrgencyBadge.tsx
│   │   │   ├── VolunteerCard.tsx
│   │   │   ├── VolunteerModal.tsx
│   │   │   ├── ScoreBreakdown.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── EmptyState.tsx
│   │   └── lib/
│   │       ├── api.ts                 # Typed fetch client
│   │       └── types.ts               # TypeScript interfaces
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── next.config.mjs
│
├── README.md
└── .env.example
```

---

## 🧠 How AI/NLP Analysis Works

When an NGO enters natural language text, the request flows through a 5-step processing pipeline:

```text
Unstructured Description
         ↓
1. Text Preprocessing & Cleaning (lowercase, punctuation strip, tokenization)
         ↓
2. Category & Subcategory Classifier (weighted keyword density & context signals)
         ↓
3. Skill Catalog Extractor (regular expression boundary checks across 60+ canonical skills)
         ↓
4. Urgency Detection Engine (emergency markers vs temporal event markers vs routine markers)
         ↓
5. Structured Analysis Synthesis (summary generation & confidence assessment)
```

### Fallback Guarantee
If `GEMINI_API_KEY` is not provided in `.env`, the system runs on the built-in deterministic Python NLP pipeline without missing a beat, ensuring the application can be presented offline without internet dependencies.

---

## ⚖️ Volunteer Matching Algorithm & Scoring Formula

Every registered volunteer is evaluated against the analyzed NGO requirement using a transparent weighted scoring model totaling **100 Points**:

$$\text{Total Match Score} = S_{\text{skills}} + L_{\text{location}} + A_{\text{availability}} + E_{\text{experience}} + I_{\text{interests}}$$

| Dimension | Max Points | Evaluation Logic |
|---|---|---|
| **Skill Match** | **50 pts** | Matches the required competencies against the volunteer's skill list. $\ge 3$ matching skills = 48–50 pts; $2$ matching skills = 40–44 pts; $1$ matching skill = 30–34 pts. |
| **Location Match** | **20 pts** | Exact city match (e.g. Pune == Pune) = 20 pts. Remote/Virtual = 14 pts. Different city = 0 pts. |
| **Availability Match** | **15 pts** | Exact schedule alignment (e.g., Weekends vs Weekends) or "Flexible" = 15 pts. Partial/opposite = 4 pts. |
| **Experience** | **10 pts** | $\ge 3.0$ years = 10 pts; $\ge 2.0$ years = 9 pts; $\ge 1.0$ year = 7 pts; $< 1$ year = 4 pts. |
| **Category/Interest** | **5 pts** | Stated personal passion in request domain (e.g. Education) = 5 pts; related domain = 2 pts. |

### Explainability Output
For every candidate, the engine outputs concrete reasoning:
- `✓ Mathematics matches required skill`
- `✓ Teaching matches required skill`
- `✓ Located in Pune (matches request location)`
- `✓ Available on Weekends (matches preferred schedule)`
- `✓ Has 2 years of relevant experience`
- `✓ Direct interest in Education`

---

## 🚀 Demonstration Scenario Walkthrough

The exact college evaluation test scenario is pre-seeded and supported via the 1-click preset on `/analyze`:

### Input:
- **NGO Name:** `Helping Hands Foundation`
- **Location:** `Pune`
- **Title:** `Weekend Education Program`
- **Description:**
  > *"We are organizing a weekend education program for underprivileged children. We need volunteers who can teach mathematics and basic computer skills. Volunteers should be comfortable communicating with children and should preferably be available on weekends in Pune."*
- **Volunteers Needed:** `4`
- **Schedule:** `Weekends`

### Output Produced by System:
- **Category:** `Education`
- **Sub-category:** `Teaching & Training`
- **Urgency:** `Medium Priority` (Scheduled upcoming program requiring volunteer mobilization)
- **Extracted Skills:** `Mathematics`, `Teaching`, `Computer Skills`, `Communication`, `Child Care`
- **Top Ranked Volunteers:**
  1. **Shruti Deshpande** — **100% Match** (`Mathematics`, `Teaching`, `Child Care` • Pune • Weekends)
  2. **Rahul Sharma** — **99% Match** (`Mathematics`, `Teaching`, `Communication` • Pune • Weekends)
  3. **Aditya Saxena** — **99% Match** (`Computer Skills`, `Communication`, `Teaching` • Pune • Weekends)
  4. **Sneha Patil** — **91% Match** (`Computer Skills`, `Teaching`, `Web Development` • Pune • Weekends)
  5. **Amit Joshi** — **84% Match** (`Mathematics`, `Science`, `Teaching` • Pune • Weekends)

---

## 🛠️ Installation & Quick Start

### Prerequisites
- **Python:** 3.10+ (tested on Python 3.12)
- **Node.js:** v18+ (tested on Node.js v24)
- **npm:** v9+

---

### 1. Backend Setup (FastAPI + SQLite/PostgreSQL)

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend server (automatically initializes the database and seeds 22+ realistic volunteers):

```bash
python run.py
```

The FastAPI backend will start at:
- **API URL:** `http://127.0.0.1:8000`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`
- **Health Check:** `http://127.0.0.1:8000/api/health`

---

### 2. Frontend Setup (Next.js + TypeScript + Tailwind)

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at:
- **Web App URL:** `http://localhost:3000`

Visit `http://localhost:3000` in your web browser.

---

## 📡 API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/requests` | Creates a new NGO request, triggers AI analysis & volunteer matching |
| `GET` | `/api/requests` | Lists past requests with category/urgency/search filters |
| `GET` | `/api/requests/{id}` | Gets full request details including analysis & recommendations |
| `POST` | `/api/requests/{id}/analyze` | Re-runs AI analysis and re-matches volunteers for request `{id}` |
| `POST` | `/api/requests/analyze-preview` | Real-time AI preview of any text without saving to database |
| `DELETE` | `/api/requests/{id}` | Deletes an NGO request |
| `GET` | `/api/volunteers` | Lists volunteers with search, skill, location, availability filters |
| `GET` | `/api/volunteers/{id}` | Retrieves full profile of a single volunteer |
| `POST` | `/api/volunteers` | Registers a new volunteer in the talent pool |
| `GET` | `/api/dashboard/stats` | Returns KPIs, category distribution, urgency stats, and top skills |
| `GET` | `/api/health` | Service health status |

---

## 🗄️ Database Schema

### `ngo_requests` Table
- `id` (Integer, Primary Key)
- `ngo_name`, `ngo_email`, `location`, `title` (Strings)
- `description` (Text)
- `volunteers_required` (Integer)
- `duration`, `expected_date`, `availability`, `urgency` (Strings)
- `category`, `subcategory`, `status` (Strings)
- `created_at` (DateTime)

### `volunteers` Table
- `id` (Integer, Primary Key)
- `name`, `email`, `phone`, `location` (Strings)
- `skills` (JSON array of strings)
- `experience_years` (Float)
- `availability` (String)
- `interests` (JSON array of strings)
- `description` (Text)
- `status` (String)
- `created_at` (DateTime)

### `analysis_results` Table
- `id` (Integer, Primary Key)
- `request_id` (Integer, Foreign Key -> `ngo_requests.id`)
- `category`, `subcategory`, `urgency` (Strings)
- `extracted_skills` (JSON array of strings)
- `urgency_reason`, `summary` (Text)
- `category_confidence` (Float)
- `analysis_method` (String)
- `created_at` (DateTime)

### `recommendations` Table
- `id` (Integer, Primary Key)
- `request_id` (Integer, Foreign Key -> `ngo_requests.id`)
- `volunteer_id` (Integer, Foreign Key -> `volunteers.id`)
- `match_score` (Float, 0.0 - 100.0)
- `matched_skills` (JSON array)
- `match_reasons` (JSON array of plain-text explanations)
- `score_breakdown` (JSON object with individual factor points)
- `rank` (Integer)
- `created_at` (DateTime)

---

## 🔮 Future Enhancements

1. **Automated WhatsApp / Email Notifications:** Send volunteer alerts when a high-compatibility match is identified.
2. **Volunteer Feedback & Attendance Tracking:** Post-event ratings to dynamically update volunteer experience weights.
3. **Geo-Distance Radius Calculation:** Exact GPS distance calculation using OpenStreetMap/Google Maps APIs.
4. **Multi-Language Support:** Regional language translation (Hindi, Marathi, etc.) for grassroots NGO coordinators.
5. **Two-Way Matching Portal:** A dedicated volunteer portal allowing volunteers to discover and apply directly for open NGO causes.

---

## 📜 License & Credits

Built as a college mini-project demonstrating applied Natural Language Processing, FastAPI backend design, and Next.js frontend engineering. Open source and free for academic and humanitarian use.
