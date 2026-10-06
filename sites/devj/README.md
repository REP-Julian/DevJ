# 🚀 DevJ — Modern Creative AI & Full-Stack Portfolio

> A high-performance, dynamic portfolio and interactive content management system built with **React**, **Vite**, **TailwindCSS**, **Appwrite.io (Auth, Storage & Databases)**, and **Google Gemini Multimodal AI**.

---

## 🌟 Key Features

### 🎨 Creative Frontend & Modern Aesthetics
- **3D Pop-out Stage Carousels**: Smooth cubic-bezier interactive card decks on **Honors & Achievements** and **Featured Projects**.
- **Hero Multi-Portrait Switcher**: Smooth 3D rotating portrait carousel with hover pause and seamless transitions.
- **Frontier AI & Tech Stack**: Specialized vector badges for Google Gemini, ChatGPT, Claude AI, DeepSeek AI, React, Python, TypeScript, Node.js, and more.
- **Interactive Social Connect with QR Code Modals**: Visitors can click social channels (GitHub, Facebook, Instagram, Telegram, WhatsApp) to open instant QR codes for mobile scanning or open direct links.

### 🤖 Gemini AI Studio & Multimodal Copilot
- **Live Contextual Copilot**: AI assistant with real-time awareness across all 6 portfolio modules (Profile, Skills, Projects, Achievements, Hobbies, Inquiries).
- **Multimodal Computer Vision**: Automatically scans, reads (OCR), and analyzes achievement certificates, awards, diplomas, and photography visuals.
- **Proactive Live Sync**: Detects newly added portfolio items in real-time and acknowledges them dynamically in chat.
- **360° Portfolio Audit**: Evaluates portfolio completeness, impact metrics, and provides actionable recruiter-ready suggestions.

### ☁️ Appwrite.io Cloud Backend & Storage
- **Appwrite Authentication**: Secure session-based admin authentication with protected endpoints.
- **Appwrite Storage Buckets**: High-speed image uploads with client-side WebP compression and instant direct delivery.
- **Appwrite Databases**: Cloud database synchronization for multi-device management.
- **Local Fallback Engine**: Unbreakable offline cache ensures zero downtime even during network disconnects.

### 🛡️ Enterprise Security Suite
- **Zero API Key Exposure**: All sensitive keys remain strictly in local `.env` and are barred from Git by `.gitignore`.
- **Anti-Inspect & DevTools Protection**: Protects against casual source inspection and context manipulation.
- **Brute-Force Rate Limiter**: Automated lockout protection on the Admin CMS portal.

---

## 🛠️ Technology Stack

- **Frontend**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + Custom Design Tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Auth**: [Appwrite.io](https://appwrite.io/)
- **Image Storage**: [Appwrite Storage](https://appwrite.io/docs/products/storage)
- **AI & Vision Engine**: [Google Gemini 3.7 & 3.6 Flash](https://ai.google.dev/) via `@google/genai`

---

## ⚙️ Environment Setup

1. Copy the example environment file to create your local `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your credentials for Appwrite and Google Gemini API as outlined in `.env.example`.

> [!IMPORTANT]
> Never commit your `.env` file to version control. The repository's `.gitignore` is pre-configured to strictly ignore `.env`, `.env.local`, and all environment variants.

---

## 🚀 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Access Admin CMS
- URL: [http://localhost:5173/login](http://localhost:5173/login)
- **⚠️ SECURITY:** Change default admin credentials immediately in `src/services/api.js` after first login
- Ensure `JWT_SECRET` is set in your `.env` file

### 4. Build for Production
```bash
npm run build
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
