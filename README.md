# 🚀 DevJ — Modern Creative AI & Full-Stack Portfolio

> A high-performance, dynamic portfolio and interactive content management system built with **React**, **Vite**, **TailwindCSS**, **Google Firebase Firestore**, **Cloudinary CDN**, and engineered for **Cloudflare Pages / Vercel**.

---

## 🌟 Key Features

### 🎨 Creative Frontend & Modern Aesthetics
- **3D Pop-out Carousels**: Layered visual stages with active center focus and angled depth cards on **Honors & Achievements** and **Featured Projects**.
- **Hero Multi-Portrait Switcher**: Smooth 2-second portrait switcher with indicators and dynamic fallback handling.
- **Specialized Frontier AI & Tech Stack**: Authentic vector logos for Google Gemini, ChatGPT, Claude AI, DeepSeek AI, JavaScript, Python, Java, HTML5, CSS3, TypeScript, React, and Node.js.
- **Full Social Integration**: Direct connection pills for GitHub, Facebook, Instagram, Telegram, WhatsApp, and Email.

### ☁️ Firebase Firestore & Cloudinary Cloud Integration
- **Live Database Sync**: Full CRUD synchronization for Profile, Skills, Achievements, Projects, Hobbies, and Inquiries across Google Firebase Firestore.
- **Lightning Fast Cloud CDN Visual Storage**: Direct pre-compressed image and asset uploads to Cloudinary CDN with 25GB free tier and zero downtime.
- **Offline & Initial Fallback**: Resilient data layer ensuring zero downtime and immediate out-of-the-box functionality.

### 🛡️ Enterprise Security & Anti-Bypass Suite
- **Anti-Inspect & DevTools Blocker**: Disables right-click context menu, `F12`, `Ctrl+Shift+I/J/C`, `Ctrl+U`, and auto-clears console logs if DevTools are opened.
- **Brute-Force Rate Limiter**: 5-attempt security threshold with an automated 3-minute lockout countdown timer on the Admin Portal.
- **Bot Honeypot Protection**: Hidden trap fields on forms to intercept and drop automated scraping traffic.
- **Cloudflare Edge Headers**: Pre-configured `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and strict transport policies.

---

## 🛠️ Technology Stack

- **Frontend Core**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + Custom Design Tokens
- **Icons**: [Lucide React](https://lucide.dev/) + Custom SVG Brand Vectors
- **Database & Auth**: [Google Firebase Firestore](https://firebase.google.com/)
- **Image Cloud Storage & CDN**: [Cloudinary](https://cloudinary.com/)
- **Hosting & Global CDN**: [Cloudflare Pages](https://pages.cloudflare.com/) / [Vercel](https://vercel.com/)

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="devj-production-jwt-secret-key-3d-portfolio-2026"

# Firebase Configuration (Firestore Database)
VITE_FIREBASE_API_KEY="AIzaSyDGC-Cm6s_PLfgIPMggDcq42Kpjn9N3R0k"
VITE_FIREBASE_AUTH_DOMAIN="devj-portfolio-c8cf0.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="devj-portfolio-c8cf0"
VITE_FIREBASE_STORAGE_BUCKET="devj-portfolio-c8cf0.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="150801261199"
VITE_FIREBASE_APP_ID="1:150801261199:web:7d583900249252f95fc6fa"

# Cloudinary Configuration (25GB Free Image Hosting)
VITE_CLOUDINARY_CLOUD_NAME="zflwn2bt"
VITE_CLOUDINARY_UPLOAD_PRESET="devj_preset"
```

---

## 🚀 Getting Started Locally

### 1. Clone the repository & Install dependencies
```bash
git clone https://github.com/your-username/devj-portfolio.git
cd devj-portfolio
npm install
```

### 2. Start the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Access Admin CMS
- URL: [http://localhost:5173/login](http://localhost:5173/login)
- Default Email: `admin@devj.com`
- Default Password: `admin123`

### 4. Build for production
```bash
npm run build
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
