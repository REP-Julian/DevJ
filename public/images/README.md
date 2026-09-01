# 📸 Portfolio Images Directory

Place all your image assets here! Anything inside `public/images/` is directly accessible on your website using `/images/your-file-name.jpg`.

---

## 📂 Recommended File Names & Locations:

### 1. Hero & Profile Portraits
- `public/images/profile.jpg`  -> Accessible as `/images/profile.jpg`
- `public/images/hero-1.jpg`   -> Accessible as `/images/hero-1.jpg`
- `public/images/hero-2.jpg`   -> Accessible as `/images/hero-2.jpg`
- `public/images/hero-3.jpg`   -> Accessible as `/images/hero-3.jpg`

### 2. Project Screenshots
- `public/images/project-1.jpg` -> Accessible as `/images/project-1.jpg`
- `public/images/project-2.jpg` -> Accessible as `/images/project-2.jpg`
- `public/images/project-3.jpg` -> Accessible as `/images/project-3.jpg`

### 3. Achievements & Awards
- `public/images/achievement-1.jpg` -> Accessible as `/images/achievement-1.jpg`
- `public/images/achievement-2.jpg` -> Accessible as `/images/achievement-2.jpg`

### 4. Hobbies & Passions
- `public/images/hobby-1.jpg` -> Accessible as `/images/hobby-1.jpg`
- `public/images/hobby-2.jpg` -> Accessible as `/images/hobby-2.jpg`

---

## 💡 How to Use in Your Portfolio:
Simply open `src/data/portfolioData.js` or `src/components/public/HeroSection.jsx` and write:
```javascript
avatarUrl: '/images/profile.jpg'
```
When you push to GitHub, Cloudflare Pages serves these images globally at maximum speed!
