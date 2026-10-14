# Julian Agustino (DevJ) — Personal Full-Stack Developer Portfolio

A minimal, clean, and responsive personal portfolio website showcasing my work as a full-stack developer. Built with **React 18**, **Tailwind CSS**, **Node.js**, **Express**, **SQLite / Prisma**, **Appwrite Cloud**, and **Google Gen AI**.

## 🌟 Featured Projects

### 1. [PawTrack Management System](https://github.com/REP-Julian)
An animal rescue operational platform engineered to eliminate paper record loss for rescue shelters.
- **Core features**: Pet intake logging, veterinary medical history auditing, adoption applicant management pipeline, and role-based staff authentication.
- **Tech stack**: React, Node.js, Express, SQLite, Prisma ORM, Tailwind CSS, JWT Auth.

### 2. [DevJ AI Studio & CMS](https://github.com/REP-Julian/DevJ)
A personal back-office dashboard and content management system with multi-model AI orchestration.
- **Core features**: Real-time Server-Sent Events (SSE) AI streaming, automated provider fallback routing, zero-rebuild live portfolio updates, and multimodal vision analysis for project media.
- **Tech stack**: React, Node.js, Express, Appwrite Cloud, Server-Sent Events, Google Gen AI SDK (`@google/genai`).

### 3. [VibeMatrix Developer Workspace](https://github.com/REP-Julian)
A lightweight developer dashboard for rapid prototyping and state inspection.
- **Core features**: Persistent workspace sessions across browser reloads, quick RESTful endpoint test runner, reactive state inspector, and audio synthesis feedback.
- **Tech stack**: React, Tailwind CSS, Web Audio API, Vite, Express.

---

## 🛠️ Skills & Technologies

| Domain | Technologies & Tools |
| :--- | :--- |
| **Frontend** | React 18, Tailwind CSS, Vite, JavaScript (ES6+), TypeScript, HTML5 / Semantic Web |
| **Backend & APIs** | Node.js, Express, RESTful APIs, Server-Sent Events (SSE), JWT Authentication, CORS |
| **Databases & Cloud** | SQLite, Prisma ORM, Appwrite Cloud (Auth, Databases, Storage Buckets), Pinecone |
| **AI & Tooling** | Google Gen AI SDK (Gemini Flash), OpenAI API, LangChain, Ollama (Local GGUF), Hugging Face |
| **Design & Accessibility** | Responsive Design, Mobile-First UI, Keyboard Accessibility, Reduced Motion (`prefers-reduced-motion`) |

---

## ✨ Portfolio Key Highlights

- **Personal & Clean UI**: Minimalist warm aesthetic using custom charcoal, yellow, and orange color tokens without corporate boilerplate or distraction.
- **Interactive Multi-Portrait Showcase**: 3D responsive portrait deck with smooth touch-swipe navigation and pause-on-hover functionality.
- **Fast Project Exploration**: Clean project cards with direct GitHub and live demo links, accompanied by an accessible detail modal with keyboard dismiss (`Escape`).
- **Full-Stack Content Management**: Secured admin interface with JWT authentication, rate limiting, and dual Appwrite Cloud / offline-first synchronization.
- **Multimodal AI Vision**: Embedded Gemini integration capable of scanning UI screenshots to auto-fill project metadata.
- **Accessible & Responsive**: Fully responsive grid from mobile to desktop with visible `:focus-visible` keyboard rings and reduced-motion preference compliance.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: version `18.0.0` or higher
- **npm**: version `9.0.0` or higher

### 1. Clone the Repository
```bash
git clone https://github.com/REP-Julian/DevJ.git
cd DevJ
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to create your local `.env` file:
```bash
cp .env.example .env
```
Fill in the appropriate configuration keys:
- `PORT`: Local server port (default: `5000`)
- `JWT_SECRET`: Secret key for signing admin authentication tokens
- `GEMINI_API_KEY`: Google Gemini API key for AI assistant features
- `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_DATABASE_ID`, `APPWRITE_BUCKET_ID`: (Optional) Appwrite Cloud credentials

### 4. Run Locally

**Frontend Development Server (Vite):**
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

**Backend Server (Express):**
```bash
npm run server
```
Server runs on [http://localhost:5000](http://localhost:5000).

---

## 🧪 Testing & Verification

Run the security audit and endpoint verification test suite:
```bash
npm test
```
Tests verify:
- Cryptographic JWT generation and validation
- Route authorization and token expiration checks
- Rate limiting on sensitive endpoints
- Contact form input sanitization and payload bounds
- Server-Sent Events (SSE) token validation

To create an optimized production build:
```bash
npm run build
```

---

## 📬 Contact & Connect

- **Email**: [agustino.julian@outlook.ph](mailto:agustino.julian@outlook.ph)
- **GitHub**: [github.com/REP-Julian](https://github.com/REP-Julian)
- **Portfolio**: [DevJ Portfolio](https://github.com/REP-Julian/DevJ)

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
