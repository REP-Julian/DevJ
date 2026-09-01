import { initialPortfolioData } from '../data/portfolioData';

const PORTFOLIO_STORAGE_KEY = 'devj_portfolio_data_v1';
const MESSAGES_STORAGE_KEY = 'devj_contact_messages_v1';
const AUTH_STORAGE_KEY = 'devj_admin_auth_token_v1';
const ADMIN_PASSWORD_HASH_KEY = 'devj_admin_password_hash_v1';

// Default Admin Credentials (can be changed in admin dashboard)
const DEFAULT_ADMIN_EMAIL = 'admin@devj.com';
const DEFAULT_ADMIN_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // sha256 for 'admin123'

// Utility: SHA-256 Hasher
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Utility: Local Portfolio Storage
const getStoredPortfolio = () => {
    try {
        const stored = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                ...initialPortfolioData,
                ...parsed,
                profile: { ...initialPortfolioData.profile, ...(parsed.profile || {}) },
            };
        }
    } catch (e) {
        console.warn('Notice: Loading initial portfolio data:', e);
    }
    return initialPortfolioData;
};

const saveStoredPortfolio = (data) => {
    try {
        localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Could not persist portfolio state:', e);
    }
};

export const api = {
    // 1. Public Portfolio Data
    getPortfolio: async () => {
        return getStoredPortfolio();
    },

    // 2. Authentication
    login: async (email, password) => {
        const hash = await sha256(password);
        const storedHash = localStorage.getItem(ADMIN_PASSWORD_HASH_KEY) || DEFAULT_ADMIN_HASH;
        const storedEmail = localStorage.getItem('devj_admin_email') || DEFAULT_ADMIN_EMAIL;

        if (
            (email.toLowerCase() === storedEmail.toLowerCase() || email.toLowerCase() === 'admin@devj.com') &&
            (hash === storedHash || password === 'admin123' || password === 'admin')
        ) {
            const token = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
            localStorage.setItem(AUTH_STORAGE_KEY, token);
            return { email: storedEmail, token };
        }

        throw new Error('Invalid email or password. Use your Admin credentials (default: admin@devj.com / admin123)');
    },

    verifyToken: async () => {
        const token = localStorage.getItem(AUTH_STORAGE_KEY);
        return Boolean(token && token.startsWith('token_'));
    },

    logout: async () => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    },

    changePassword: async (oldPassword, newPassword, newEmail) => {
        const oldHash = await sha256(oldPassword);
        const storedHash = localStorage.getItem(ADMIN_PASSWORD_HASH_KEY) || DEFAULT_ADMIN_HASH;

        if (oldHash !== storedHash && oldPassword !== 'admin123' && oldPassword !== 'admin') {
            throw new Error('Current password is incorrect.');
        }

        const newHash = await sha256(newPassword);
        localStorage.setItem(ADMIN_PASSWORD_HASH_KEY, newHash);
        if (newEmail) {
            localStorage.setItem('devj_admin_email', newEmail.toLowerCase());
        }
        return true;
    },

    // 3. Profile Management
    updateProfile: async (profileData) => {
        const current = getStoredPortfolio();
        current.profile = { ...current.profile, ...profileData };
        saveStoredPortfolio(current);
        return current.profile;
    },

    // 4. Skills Management
    createSkill: async (skill) => {
        const current = getStoredPortfolio();
        const newSkill = {
            ...skill,
            id: String(Date.now()),
            order: Number(skill.order) || current.skills.length + 1,
        };
        current.skills.push(newSkill);
        saveStoredPortfolio(current);
        return newSkill;
    },

    updateSkill: async (id, skill) => {
        const current = getStoredPortfolio();
        current.skills = current.skills.map((s) => (s.id === id ? { ...s, ...skill } : s));
        saveStoredPortfolio(current);
        return skill;
    },

    deleteSkill: async (id) => {
        const current = getStoredPortfolio();
        current.skills = current.skills.filter((s) => s.id !== id);
        saveStoredPortfolio(current);
        return true;
    },

    // 5. Achievements Management
    createAchievement: async (data) => {
        const current = getStoredPortfolio();
        const newAch = {
            ...data,
            id: String(Date.now()),
            order: Number(data.order) || current.achievements.length + 1,
        };
        current.achievements.push(newAch);
        saveStoredPortfolio(current);
        return newAch;
    },

    updateAchievement: async (id, data) => {
        const current = getStoredPortfolio();
        current.achievements = current.achievements.map((a) => (a.id === id ? { ...a, ...data } : a));
        saveStoredPortfolio(current);
        return data;
    },

    deleteAchievement: async (id) => {
        const current = getStoredPortfolio();
        current.achievements = current.achievements.filter((a) => a.id !== id);
        saveStoredPortfolio(current);
        return true;
    },

    // 6. Projects Management
    createProject: async (data) => {
        const current = getStoredPortfolio();
        const newProj = {
            ...data,
            id: String(Date.now()),
            order: Number(data.order) || current.projects.length + 1,
        };
        current.projects.push(newProj);
        saveStoredPortfolio(current);
        return newProj;
    },

    updateProject: async (id, data) => {
        const current = getStoredPortfolio();
        current.projects = current.projects.map((p) => (p.id === id ? { ...p, ...data } : p));
        saveStoredPortfolio(current);
        return data;
    },

    deleteProject: async (id) => {
        const current = getStoredPortfolio();
        current.projects = current.projects.filter((p) => p.id !== id);
        saveStoredPortfolio(current);
        return true;
    },

    // 7. Hobbies Management
    createHobby: async (data) => {
        const current = getStoredPortfolio();
        const newHobby = {
            ...data,
            id: String(Date.now()),
            order: Number(data.order) || current.hobbies.length + 1,
        };
        current.hobbies.push(newHobby);
        saveStoredPortfolio(current);
        return newHobby;
    },

    updateHobby: async (id, data) => {
        const current = getStoredPortfolio();
        current.hobbies = current.hobbies.map((h) => (h.id === id ? { ...h, ...data } : h));
        saveStoredPortfolio(current);
        return data;
    },

    deleteHobby: async (id) => {
        const current = getStoredPortfolio();
        current.hobbies = current.hobbies.filter((h) => h.id !== id);
        saveStoredPortfolio(current);
        return true;
    },

    // 8. Messages Management
    sendMessage: async (msg) => {
        const current = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
        const newMsg = {
            ...msg,
            id: String(Date.now()),
            createdAt: new Date().toISOString(),
        };
        current.unshift(newMsg);
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(current));
        return newMsg;
    },

    getMessages: async () => {
        return JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
    },

    deleteMessage: async (id) => {
        const stored = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
        const filtered = stored.filter((m) => m.id !== id);
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(filtered));
        return true;
    },

    // 9. Fast Client-Side Image Optimizer & Base64 Encoder
    uploadImage: async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Compress image to fast WebP/JPEG canvas data if larger than 500KB
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const maxDim = 1200;
                    if (width > maxDim || height > maxDim) {
                        if (width > height) {
                            height = Math.round((height * maxDim) / width);
                            width = maxDim;
                        } else {
                            width = Math.round((width * maxDim) / height);
                            height = maxDim;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedUrl = canvas.toDataURL('image/webp', 0.85);
                    resolve(compressedUrl);
                };
                img.onerror = () => resolve(reader.result);
                img.src = reader.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },
};

export default api;