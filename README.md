# 🚀 DevJ — Modern Creative AI & Full-Stack Portfolio

> A high-performance, dynamic portfolio and interactive content management system built with **React**, **Vite**, **TailwindCSS**, **Appwrite Cloud**, and engineered for **Cloudflare Pages**.

---

## 🌟 Key Features

### 🎨 Creative Frontend & Modern Aesthetics
- **3D Pop-out Carousels**: Layered visual stages with active center focus and angled depth cards on **Honors & Achievements** and **Featured Projects**.
- **Hero Multi-Portrait Switcher**: Smooth 2-second portrait switcher with indicators and dynamic fallback handling.
- **Specialized Frontier AI & Tech Stack**: Authentic vector logos for Google Gemini, ChatGPT, Claude AI, DeepSeek AI, JavaScript, Python, Java, HTML5, CSS3, TypeScript, React, and Node.js.
- **Full Social Integration**: Direct connection pills for GitHub, Facebook, Instagram, Telegram, WhatsApp, and Email.

### ☁️ Appwrite Cloud BaaS & Real-Time Sync
- **Live Database Sync**: Full CRUD synchronization for Profile, Skills, Achievements, Projects, Hobbies, and Inquiries across Appwrite Cloud.
- **Cloud Visual Storage**: Direct image and asset uploads to Appwrite Storage Buckets with public CDN distribution.
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
- **Backend as a Service (BaaS)**: [Appwrite Cloud](https://appwrite.io/)
- **Hosting & Global CDN**: [Cloudflare Pages](https://pages.cloudflare.com/)

---

## 📦 Project Structure

```
├── public/
│   ├── _headers           # Cloudflare Pages edge security headers
│   ├── _redirects         # SPA client-side routing rules
│   └── images/            # Local asset directory with README guide
├── src/
│   ├── components/
│   │   ├── admin/         # Admin CMS management tabs (Profile, Skills, Projects, etc.)
│   │   ├── common/        # Reusable components (BrandIcon, ImageUploader, Footer, Navbar)
│   │   └── public/        # Public portfolio sections (Hero, Skills, Achievements, Projects, Hobbies, Contact)
│   ├── context/           # React Context providers (AuthContext, PortfolioContext)
│   ├── data/              # Default portfolio datasets (portfolioData.js)
│   ├── pages/             # Route pages (HomePage, LoginPage, DashboardPage)
│   ├── services/          # Appwrite client & API CRUD service layer
│   └── utils/             # Anti-inspect & rate limiting security utilities
├── .env.example           # Environment variables template
└── vite.config.js         # Vite configuration
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="devj-production-jwt-secret-key-3d-portfolio-2026"

# Appwrite Cloud Configuration (https://appwrite.io/)
VITE_APPWRITE_ENDPOINT="https://fra.cloud.appwrite.io/v1"
VITE_APPWRITE_PROJECT_ID="your-project-id"
VITE_APPWRITE_DATABASE_ID="devj_portfolio"
VITE_APPWRITE_COLLECTION_PROFILE="profiles"
VITE_APPWRITE_COLLECTION_SKILLS="skills"
VITE_APPWRITE_COLLECTION_ACHIEVEMENTS="achievements"
VITE_APPWRITE_COLLECTION_PROJECTS="projects"
VITE_APPWRITE_COLLECTION_HOBBIES="hobbies"
VITE_APPWRITE_COLLECTION_MESSAGES="messages"
VITE_APPWRITE_BUCKET_ID="portfolio-assets"
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

## 🗄️ Appwrite Cloud Database Setup

In your Appwrite Console under Database **`devj_portfolio`**, create the following 6 tables:

| Table | Columns |
| :--- | :--- |
| **`profiles`** | `name` (Text), `tagline` (Text), `description` (Text), `avatarUrl` (Text), `email` (Text), `githubUrl` (Text), `facebookUrl` (Text), `instagramUrl` (Text), `telegramUrl` (Text), `whatsappUrl` (Text) |
| **`skills`** | `category` (Text), `name` (Text), `iconName` (Text), `order` (Integer) |
| **`achievements`** | `title` (Text), `category` (Text), `date` (Text), `description` (Text), `imageUrl` (Text), `order` (Integer) |
| **`projects`** | `title` (Text), `category` (Text), `description` (Text), `technologies` (Text), `imageUrl` (Text), `githubUrl` (Text), `order` (Integer) |
| **`hobbies`** | `name` (Text), `description` (Text), `imageUrl` (Text), `iconName` (Text), `order` (Integer) |
| **`messages`** | `name` (Text), `email` (Text), `message` (Text), `read` (Boolean), `createdAt` (Text) |

### Storage Bucket:
- **Bucket ID**: `portfolio-assets`
- **Permissions**: Add role `Any` with `Read` & `Create` permissions.

---

## 🌐 Deploying to Cloudflare Pages (Free)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Deploy DevJ Portfolio"
   git push
   ```
2. Log in at [dash.cloudflare.com](https://dash.cloudflare.com) ➔ **Workers & Pages** ➔ **Create application** ➔ **Pages** ➔ **Connect to Git**.
3. Select your repository with these settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Add your `VITE_APPWRITE_*` environment variables in Cloudflare Pages settings.
5. Click **Save and Deploy**!

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
