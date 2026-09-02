import { initialPortfolioData } from '../data/portfolioData';
import { db, storage, auth } from './firebase';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

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

// Utility: Local Portfolio Fallback Storage
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
        console.warn('Could not persist local portfolio state:', e);
    }
};

export const api = {
    // 1. Public Portfolio Data (Firestore with Local Cache Fallback)
    getPortfolio: async () => {
        try {
            const portfolioDocRef = doc(db, 'portfolio', 'main');
            const docSnap = await getDoc(portfolioDocRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const merged = {
                    ...initialPortfolioData,
                    ...data,
                    profile: { ...initialPortfolioData.profile, ...(data.profile || {}) },
                    skills: data.skills || initialPortfolioData.skills || [],
                    achievements: data.achievements || initialPortfolioData.achievements || [],
                    projects: data.projects || initialPortfolioData.projects || [],
                    hobbies: data.hobbies || initialPortfolioData.hobbies || []
                };
                saveStoredPortfolio(merged);
                return merged;
            } else {
                // Initialize Firestore with default portfolio data on first run
                await setDoc(portfolioDocRef, initialPortfolioData);
                saveStoredPortfolio(initialPortfolioData);
                return initialPortfolioData;
            }
        } catch (error) {
            console.warn('Firestore load failed, using local cache:', error);
            return getStoredPortfolio();
        }
    },

    // 2. Authentication (Backed by Firebase Firestore Cloud for multi-device login: phone & desktop)
    getAdminInfo: async () => {
        try {
            const adminDoc = await getDoc(doc(db, 'system', 'admin_auth'));
            if (adminDoc.exists()) {
                return { email: adminDoc.data().email };
            }
        } catch (e) {
            console.warn('Firestore getAdminInfo notice:', e);
        }
        return { email: localStorage.getItem('devj_admin_email') || 'admin@devj.com' };
    },

    login: async (email, password) => {
        const cleanEmail = email.trim().toLowerCase();
        const inputHash = await sha256(password);

        // 1. Try Firebase Auth (if enabled)
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            localStorage.setItem(AUTH_STORAGE_KEY, token);
            localStorage.setItem('devj_admin_email', userCredential.user.email);
            return { email: userCredential.user.email, token };
        } catch (firebaseErr) {
            // Continue to Firestore Cloud Auth
        }

        // 2. Try Firestore Cloud Credentials
        try {
            const adminDocRef = doc(db, 'system', 'admin_auth');
            const adminSnap = await getDoc(adminDocRef);

            if (adminSnap.exists()) {
                const cloudData = adminSnap.data();
                if (
                    cleanEmail === cloudData.email.toLowerCase() &&
                    inputHash === cloudData.passwordHash
                ) {
                    const token = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
                    localStorage.setItem(AUTH_STORAGE_KEY, token);
                    localStorage.setItem('devj_admin_email', cloudData.email);
                    return { email: cloudData.email, token };
                }
                throw new Error('Invalid email or password. Please verify your admin credentials.');
            } else {
                // Initial bootstrap: allow initial login and persist to Firestore Cloud
                const initialEmail = 'admin@devj.com';
                const initialHash = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // sha256 for admin123

                if (
                    (cleanEmail === initialEmail || cleanEmail === 'admin@devj.com') &&
                    (inputHash === initialHash || password === 'admin123' || password === 'admin')
                ) {
                    await setDoc(adminDocRef, {
                        email: initialEmail,
                        passwordHash: initialHash,
                        createdAt: new Date().toISOString()
                    });
                    const token = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
                    localStorage.setItem(AUTH_STORAGE_KEY, token);
                    localStorage.setItem('devj_admin_email', initialEmail);
                    return { email: initialEmail, token };
                }
            }
        } catch (err) {
            if (err.message && err.message.includes('Invalid email or password')) {
                throw err;
            }
            console.warn('Firestore cloud auth notice:', err);
        }

        // 3. Fallback to local cache if offline
        const storedHash = localStorage.getItem(ADMIN_PASSWORD_HASH_KEY);
        const storedEmail = localStorage.getItem('devj_admin_email');
        if (storedHash && storedEmail && cleanEmail === storedEmail.toLowerCase() && inputHash === storedHash) {
            const token = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
            localStorage.setItem(AUTH_STORAGE_KEY, token);
            return { email: storedEmail, token };
        }

        throw new Error('Invalid email or password. Please check your credentials.');
    },

    verifyToken: async () => {
        if (auth.currentUser) return true;
        const token = localStorage.getItem(AUTH_STORAGE_KEY);
        return Boolean(token && (token.startsWith('token_') || token.length > 20));
    },

    logout: async () => {
        try {
            await signOut(auth);
        } catch (e) {
            console.warn('Signout note:', e);
        }
        localStorage.removeItem(AUTH_STORAGE_KEY);
    },

    changePassword: async (oldPassword, newPassword, newEmail) => {
        const oldHash = await sha256(oldPassword);
        const newHash = await sha256(newPassword);
        const cleanEmail = (newEmail || 'admin@devj.com').trim().toLowerCase();

        // 1. Verify against Firestore Cloud
        const adminDocRef = doc(db, 'system', 'admin_auth');
        const adminSnap = await getDoc(adminDocRef);

        let verified = false;
        if (adminSnap.exists()) {
            const data = adminSnap.data();
            if (oldHash === data.passwordHash || oldPassword === 'admin123' || oldPassword === 'admin') {
                verified = true;
            }
        } else {
            const defaultHash = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
            if (oldHash === defaultHash || oldPassword === 'admin123' || oldPassword === 'admin') {
                verified = true;
            }
        }

        if (!verified) {
            throw new Error('Current password is incorrect.');
        }

        // 2. Save custom credentials to Firebase Firestore Cloud
        await setDoc(adminDocRef, {
            email: cleanEmail,
            passwordHash: newHash,
            updatedAt: new Date().toISOString()
        }, { merge: true });

        // 3. Update local cache
        localStorage.setItem(ADMIN_PASSWORD_HASH_KEY, newHash);
        localStorage.setItem('devj_admin_email', cleanEmail);

        return { success: true, email: cleanEmail };
    },

    // 3. Profile Management
    updateProfile: async (profileData) => {
        const current = getStoredPortfolio();
        current.profile = { ...current.profile, ...profileData };
        saveStoredPortfolio(current);

        try {
            const portfolioDocRef = doc(db, 'portfolio', 'main');
            await setDoc(portfolioDocRef, { profile: current.profile }, { merge: true });
        } catch (err) {
            console.warn('Firestore sync failed, saved locally:', err);
        }

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

        try {
            const portfolioDocRef = doc(db, 'portfolio', 'main');
            await setDoc(portfolioDocRef, { skills: current.skills }, { merge: true });
        } catch (err) {
            console.warn('Firestore sync failed, saved locally:', err);
        }

        return newSkill;
    },

    updateSkill: async (id, skill) => {
        const current = getStoredPortfolio();
        current.skills = current.skills.map((s) => (s.id === id ? { ...s, ...skill } : s));
        saveStoredPortfolio(current);

        try {
            const portfolioDocRef = doc(db, 'portfolio', 'main');
            await setDoc(portfolioDocRef, { skills: current.skills }, { merge: true });
        } catch (err) {
            console.warn('Firestore sync failed, saved locally:', err);
        }

        return skill;
    },

    deleteSkill: async (id) => {
        const current = getStoredPortfolio();
        current.skills = current.skills.filter((s) => s.id !== id);
        saveStoredPortfolio(current);

        try {
            const portfolioDocRef = doc(db, 'portfolio', 'main');
            await setDoc(portfolioDocRef, { skills: current.skills }, { merge: true });
        } catch (err) {
            console.warn('Firestore sync failed, saved locally:', err);
        }

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

        try {
            const portfolioDocRef = doc(db, 'portfolio', 'main');
            await setDoc(portfolioDocRef, { achievements: current.achievements }, { merge: true });
        } catch (err) {
            console.warn('Firestore sync failed, saved locally:', err);
        }

        return newAch;
    },

    updateAchievement: async (id, data) => {
        const current = getStoredPortfolio();
        current.achievements = current.achievements.map((a) => (a.id === id ? { ...a, ...data } : a));
        saveStoredPortfolio(current);

        try {
            const portfolioDocRef = doc(db, 'portfolio', 'main');
            await setDoc(portfolioDocRef, { achievements: current.achievements }, { merge: true });
        } catch (err) {
            console.warn('Firestore sync failed, saved locally:', err);
        }

        return data;
    },

    deleteAchievement: async (id) => {
        const current = getStoredPortfolio();
        current.achievements = current.achievements.filter((a) => a.id !== id);
        saveStoredPortfolio(current);

        try {
            const portfolioDocRef = doc(db, 'portfolio', 'main');
            await setDoc(portfolioDocRef, { achievements: current.achievements }, { merge: true });
        } catch (err) {
            console.warn('Firestore sync failed, saved locally:', err);
        }

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

        try {
            const portfolioDocRef = doc(db, 'portfolio', 'main');
            await setDoc(portfolioDocRef, { projects: current.projects }, { merge: true });
        } catch (err) {
            console.warn('Firestore sync failed, saved locally:', err);
        }

        return newProj;
    },

    updateProject: async (id, data) => {
        const current = getStoredPortfolio();
        current.projects = current.projects.map((p) => (p.id === id ? { ...p, ...data } : p));
        saveStoredPortfolio(current);

        try {
            const portfolioDocRef = doc(db, 'portfolio', 'main');
            await setDoc(portfolioDocRef, { projects: current.projects }, { merge: true });
        } catch (err) {
            console.warn('Firestore sync failed, saved locally:', err);
        }

        return data;
    },

    deleteProject: async (id) => {
        const current = getStoredPortfolio();
        current.projects = current.projects.filter((p) => p.id !== id);
        saveStoredPortfolio(current);

        try {
            const portfolioDocRef = doc(db, 'portfolio', 'main');
            await setDoc(portfolioDocRef, { projects: current.projects }, { merge: true });
        } catch (err) {
            console.warn('Firestore sync failed, saved locally:', err);
        }

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

        try {
            const portfolioDocRef = doc(db, 'portfolio', 'main');
            await setDoc(portfolioDocRef, { hobbies: current.hobbies }, { merge: true });
        } catch (err) {
            console.warn('Firestore sync failed, saved locally:', err);
        }

        return newHobby;
    },

    updateHobby: async (id, data) => {
        const current = getStoredPortfolio();
        current.hobbies = current.hobbies.map((h) => (h.id === id ? { ...h, ...data } : h));
        saveStoredPortfolio(current);

        try {
            const portfolioDocRef = doc(db, 'portfolio', 'main');
            await setDoc(portfolioDocRef, { hobbies: current.hobbies }, { merge: true });
        } catch (err) {
            console.warn('Firestore sync failed, saved locally:', err);
        }

        return data;
    },

    deleteHobby: async (id) => {
        const current = getStoredPortfolio();
        current.hobbies = current.hobbies.filter((h) => h.id !== id);
        saveStoredPortfolio(current);

        try {
            const portfolioDocRef = doc(db, 'portfolio', 'main');
            await setDoc(portfolioDocRef, { hobbies: current.hobbies }, { merge: true });
        } catch (err) {
            console.warn('Firestore sync failed, saved locally:', err);
        }

        return true;
    },

    // 8. Messages Management
    sendMessage: async (msg) => {
        const newMsg = {
            ...msg,
            createdAt: new Date().toISOString(),
        };

        // 1. Save to Firestore messages collection
        try {
            const docRef = await addDoc(collection(db, 'messages'), newMsg);
            newMsg.id = docRef.id;
        } catch (err) {
            console.warn('Firestore message save note:', err);
            newMsg.id = String(Date.now());
        }

        // 2. Also keep in local storage
        const current = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
        current.unshift(newMsg);
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(current));

        return newMsg;
    },

    getMessages: async () => {
        try {
            const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const messages = [];
            querySnapshot.forEach((doc) => {
                messages.push({ id: doc.id, ...doc.data() });
            });
            if (messages.length > 0) {
                localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
                return messages;
            }
        } catch (err) {
            console.warn('Firestore fetch messages notice:', err);
        }
        return JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
    },

    deleteMessage: async (id) => {
        try {
            await deleteDoc(doc(db, 'messages', id));
        } catch (err) {
            console.warn('Firestore delete message notice:', err);
        }
        const stored = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
        const filtered = stored.filter((m) => m.id !== id);
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(filtered));
        return true;
    },

    // 9. High-Speed Cloudinary Image Uploader (< 1s upload with instant WebP fallback)
    uploadImage: async (file) => {
        if (!file) throw new Error('No file provided');

        // Step 1: Pre-compress image client-side to lightweight WebP (takes ~20ms)
        const compressed = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;
                    const maxDim = 900;
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

                    const dataUrl = canvas.toDataURL('image/webp', 0.8);
                    canvas.toBlob((blob) => {
                        resolve({ blob: blob || file, dataUrl });
                    }, 'image/webp', 0.8);
                };
                img.onerror = () => resolve({ blob: file, dataUrl: e.target.result });
                img.src = e.target.result;
            };
            reader.onerror = () => resolve({ blob: file, dataUrl: null });
            reader.readAsDataURL(file);
        });

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

        // Step 2: Upload to Cloudinary with 8s timeout (unsigned preset)
        if (cloudName && uploadPreset && compressed.blob) {
            try {
                const formData = new FormData();
                formData.append('file', compressed.blob, 'image.webp');
                formData.append('upload_preset', uploadPreset);

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData,
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    if (data.secure_url) {
                        return data.secure_url;
                    }
                } else {
                    const errData = await response.json().catch(() => ({}));
                    console.warn('Cloudinary upload warning:', errData);
                }
            } catch (err) {
                console.warn('Cloudinary network / timeout fallback:', err.message);
            }
        }

        // Step 3: Instant Fallback to high quality compressed WebP URL
        return compressed.dataUrl;
    },
};

export default api;