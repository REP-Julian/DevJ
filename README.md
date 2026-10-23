# Julian Agustino — Personal Portfolio (DevJ)

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Prisma-003B57?logo=sqlite&logoColor=white)](https://www.prisma.io/)
[![Appwrite](https://img.shields.io/badge/Appwrite-Cloud-FD366E?logo=appwrite&logoColor=white)](https://appwrite.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A high-performance personal portfolio engineered with React 18, Tailwind CSS, Express, and SQLite/Appwrite. Features an interactive 3D multi-portrait hero stage, project showcases with source code inspection, verified technical milestones, and an administrative CMS studio powered by the Google Gen AI SDK.

---

## Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │          React 18 Single-Page App      │
                      │  - Multi-Portrait 3D Hero Carousel     │
                      │  - Filterable Project Catalog          │
                      │  - Verified Milestones & Lightbox      │
                      │  - Direct Contact Form & QR Modals     │
                      └───────────────────┬────────────────────┘
                                          │
                     REST / SSE Requests  │  Client Storage Fallback
                                          ▼
                      ┌────────────────────────────────────────┐
                      │          Node.js / Express API         │
                      │  - JWT Bearer Authentication           │
                      │  - Rate Limiting & Anti-Tampering      │
                      │  - Contact Message Processing          │
                      │  - Gemini AI Assist & Vision Analysis  │
                      └──────────────┬──────────────────┬──────┘
                                     │                  │
                Local Relational DB  ▼                  ▼  Cloud Backend
                      ┌──────────────────┐    ┌─────────────────────┐
                      │  SQLite / Prisma │    │    Appwrite Cloud   │
                      │  (Local Cache)   │    │ (Storage, Auth, DB) │
                      └──────────────────┘    └─────────────────────┘
```

---

## Featured Work

### 1. PawTrack Management System
Operational rescue shelter platform designed to digitize animal intake, medical histories, and adoption pipelines.
- **Highlights**: Role-based JWT authentication, relational schema with SQLite and Express REST API, medical audit trails.
- **Stack**: React, Node.js, Express, SQLite, Prisma ORM, Tailwind CSS, JWT.
- **Repository**: [github.com/REP-Julian](https://github.com/REP-Julian)

### 2. DevJ AI Studio & CMS
Personal administrative back-office and CMS supporting live portfolio synchronization and multi-model AI assistance.
- **Highlights**: Real-time Server-Sent Events (SSE) streaming, automated fallback routing between providers, multimodal visual analysis for project assets.
- **Stack**: React, Node.js, Express, Appwrite Cloud, Server-Sent Events, Google Gen AI SDK.
- **Repository**: [github.com/REP-Julian/DevJ](https://github.com/REP-Julian/DevJ)

### 3. VibeMatrix Developer Workspace
Lightweight browser dashboard for RESTful endpoint testing, client state inspection, and scratchpad note-taking.
- **Highlights**: Zero bundle bloat, persistent sessions across browser reloads, Web Audio feedback integration.
- **Stack**: React, Tailwind CSS, Web Audio API, Vite, Express.
- **Repository**: [github.com/REP-Julian](https://github.com/REP-Julian)

---

## Technical Stack

| Category | Technologies & Tools |
| :--- | :--- |
| **Frontend** | React 18, Tailwind CSS, Vite, ES6+, Responsive Design, Lucide Icons |
| **Backend** | Node.js, Express 4, RESTful Architecture, Server-Sent Events (SSE), CORS |
| **Data & Storage** | SQLite, Prisma ORM, Appwrite Cloud (Auth, Databases, Storage Buckets) |
| **AI & Automation** | Google Gen AI SDK (Gemini Flash), Multimodal Vision API |
| **Security & Quality** | JWT (HS256), Input Sanitization, Rate Limiting, Node Test Runner |

---

## Directory Structure

```
.
├── prisma/               # Prisma database schema and seeding script
├── public/               # Static assets, web manifest, robots.txt, sitemap
├── scripts/              # Migration and database setup scripts
├── server/               # Express backend application
│   ├── middleware/       # Auth guards, upload validation, rate limiting
│   ├── routes/           # REST endpoints (auth, projects, contact, ai)
│   └── utils/            # Prisma client instance and server helpers
├── src/                  # React frontend application
│   ├── components/
│   │   ├── admin/        # CMS dashboard, profile, and project managers
│   │   ├── common/       # Navbar, Footer, Modals, Uploaders, Brand icons
│   │   └── public/       # Hero, Projects, Skills, Achievements, Contact
│   ├── context/          # Auth and Portfolio React context providers
│   ├── data/             # Static fallback portfolio data
│   ├── pages/            # HomePage, LoginPage, DashboardPage
│   ├── services/         # Appwrite, REST API client, and AI service
│   └── utils/            # Security shield and email client helpers
├── tests/                # Automated security and API verification suite
└── dist/                 # Production build output
```

---

## Quickstart Guide

### Prerequisites
- **Node.js**: `18.0.0` or higher
- **npm**: `9.0.0` or higher

### 1. Clone & Install
```bash
git clone https://github.com/REP-Julian/DevJ.git
cd DevJ
npm install
```

### 2. Environment Configuration
Create a local `.env` file from the provided template:
```bash
cp .env.example .env
```

Configure key variables in `.env`:
```env
PORT=5000
JWT_SECRET=your_jwt_signing_secret_here
GEMINI_API_KEY=your_google_gemini_api_key
VITE_APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
```

### 3. Generate Database Client
```bash
npx prisma generate
```

### 4. Run Development Servers
Start both servers concurrently:

- **Frontend (Vite)**:
  ```bash
  npm run dev
  ```
  Accessible at `http://localhost:5173`

- **Backend (Express)**:
  ```bash
  npm run server
  ```
  Accessible at `http://localhost:5000`

---

## Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite development server with hot module replacement |
| `npm run build` | Builds optimized production assets to `/dist` |
| `npm run preview` | Previews production build locally |
| `npm run server` | Starts production Express API server |
| `npm run server:dev`| Starts Express API server with nodemon auto-reload |
| `npm test` | Runs the automated Node.js security and endpoint test suite |
| `npm run db:push` | Pushes Prisma schema changes directly to SQLite database |

---

## Security & Verification

The project includes an automated test harness in `tests/security.test.mjs` verifying:
- Rejection of unauthenticated requests on protected administrative endpoints (`401`).
- Rejection of forged, expired, or invalid JWT signatures (`403` / `401`).
- Protection of Server-Sent Events (SSE) telemetry streams.
- Contact form payload bounds and email RFC sanitization.

Run verification:
```bash
npm test
```

---

## Contact

- **Developer**: Julian Agustino (DevJ)
- **Email**: [agustino.julian@outlook.ph](mailto:agustino.julian@outlook.ph)
- **GitHub**: [@REP-Julian](https://github.com/REP-Julian)
- **Repository**: [github.com/REP-Julian/DevJ](https://github.com/REP-Julian/DevJ)

---

## License

This project is licensed under the [MIT License](LICENSE).
