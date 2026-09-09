import { initialPortfolioData } from '../data/portfolioData';
import { account, databases, storage, APPWRITE_CONFIG, ID, Query } from './appwrite';

const PORTFOLIO_STORAGE_KEY = 'devj_portfolio_data_v1';
const MESSAGES_STORAGE_KEY = 'devj_contact_messages_v1';
const AUTH_STORAGE_KEY = 'devj_admin_auth_token_v1';
const ADMIN_PASSWORD_HASH_KEY = 'devj_admin_password_hash_v1';

// Default Admin Credentials (can be configured in admin dashboard / Appwrite Auth)
const DEFAULT_ADMIN_EMAIL = 'admin@devj.com';
const DEFAULT_ADMIN_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // sha256 for 'admin123'

// Utility: SHA-256 Hasher
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Utility: Local Portfolio Storage (fast offline cache & fallback)
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

// Background helper: sync portfolio modifications to Appwrite Databases
const syncPortfolioToAppwrite = async (portfolioData) => {
    try {
        const docId = 'main';
        const payload = {
            content: JSON.stringify(portfolioData),
            updatedAt: new Date().toISOString(),
        };

        try {
            await databases.updateDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collections.portfolio,
                docId,
                payload
            );
        } catch (updateErr) {
            if (updateErr.code === 404) {
                await databases.createDocument(
                    APPWRITE_CONFIG.databaseId,
                    APPWRITE_CONFIG.collections.portfolio,
                    docId,
                    payload
                );
            }
        }
    } catch (err) {
        // Retain silent local fallback if database collection is pending setup in Appwrite Console
    }
};

export const api = {
    // 1. Public Portfolio Data (Appwrite Databases with Local Cache Fallback)
    getPortfolio: async () => {
        try {
            const doc = await databases.getDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collections.portfolio,
                'main'
            );

            const local = getStoredPortfolio();

            if (doc && doc.content) {
                let remoteData = {};
                try {
                    remoteData = JSON.parse(doc.content);
                } catch {
                    remoteData = doc;
                }

                const remoteProfile = remoteData.profile || {};
                const localTime = Number(local.profile?.updatedAt || 0);
                const remoteTime = Number(remoteProfile.updatedAt || 0);

                const mergedProfile = {
                    ...initialPortfolioData.profile,
                    ...remoteProfile,
                };

                if (localTime > remoteTime && localTime > 0) {
                    Object.assign(mergedProfile, local.profile || {});
                }

                // Preserve uploaded portraits from Appwrite Storage over defaults
                if (remoteProfile.avatarUrl) mergedProfile.avatarUrl = remoteProfile.avatarUrl;
                if (remoteProfile.avatarUrl2) mergedProfile.avatarUrl2 = remoteProfile.avatarUrl2;
                if (remoteProfile.avatarUrl3) mergedProfile.avatarUrl3 = remoteProfile.avatarUrl3;

                // Protect email from obsolete placeholder
                if (mergedProfile.email === 'contact@devj.com' || !mergedProfile.email) {
                    mergedProfile.email = (local.profile?.email && local.profile.email !== 'contact@devj.com')
                        ? local.profile.email
                        : (remoteProfile.email && remoteProfile.email !== 'contact@devj.com' ? remoteProfile.email : 'agustino.julian@outlook.ph');
                }

                // Guarantee QR codes saved in local or Appwrite are preserved
                ['githubQrUrl', 'facebookQrUrl', 'instagramQrUrl', 'telegramQrUrl', 'whatsappQrUrl'].forEach((k) => {
                    mergedProfile[k] = remoteProfile[k] || local.profile?.[k] || '';
                });

                const merged = {
                    ...initialPortfolioData,
                    ...remoteData,
                    profile: mergedProfile,
                    skills: (remoteData.skills && remoteData.skills.length > 0) ? remoteData.skills : (local.skills || initialPortfolioData.skills || []),
                    achievements: (remoteData.achievements && remoteData.achievements.length > 0) ? remoteData.achievements : (local.achievements || initialPortfolioData.achievements || []),
                    projects: (remoteData.projects && remoteData.projects.length > 0) ? remoteData.projects : (local.projects || initialPortfolioData.projects || []),
                    hobbies: (remoteData.hobbies && remoteData.hobbies.length > 0) ? remoteData.hobbies : (local.hobbies || initialPortfolioData.hobbies || [])
                };

                saveStoredPortfolio(merged);
                return merged;
            }
        } catch (error) {
            // If Appwrite database collection isn't created yet or network offline, use local storage seamlessly
        }

        return getStoredPortfolio();
    },

    // 2. Authentication (Appwrite Auth Account Service)
    getAdminInfo: async () => {
        try {
            const user = await account.get();
            if (user && user.email) {
                return { email: user.email, name: user.name, id: user.$id };
            }
        } catch (e) {
            // Not logged in or session expired
        }
        return { email: localStorage.getItem('devj_admin_email') || DEFAULT_ADMIN_EMAIL };
    },

    login: async (email, password) => {
        const cleanEmail = email.trim().toLowerCase();

        // 1. Authenticate with Appwrite Auth
        try {
            // Delete any stale existing session first
            try {
                await account.deleteSession('current');
            } catch {
                // Ignore if no existing session
            }

            let session;
            if (typeof account.createEmailPasswordSession === 'function') {
                session = await account.createEmailPasswordSession(cleanEmail, password);
            } else if (typeof account.createEmailSession === 'function') {
                session = await account.createEmailSession(cleanEmail, password);
            } else {
                session = await account.createSession(cleanEmail, password);
            }

            const user = await account.get();
            const token = session.$id || `appwrite_${Date.now()}`;
            localStorage.setItem(AUTH_STORAGE_KEY, token);
            localStorage.setItem('devj_admin_email', user.email);

            return { email: user.email, token, user };
        } catch (appwriteErr) {
            console.warn('Appwrite Auth attempt notice:', appwriteErr);

            // Handle invalid credentials error from Appwrite
            if (appwriteErr.code === 401 || (appwriteErr.message && appwriteErr.message.toLowerCase().includes('invalid credential'))) {
                throw new Error('Invalid email or password. Please verify your Appwrite admin credentials.');
            }

            // If user not found in Appwrite Auth on first setup, attempt initial account bootstrap
            if (appwriteErr.code === 404 || (appwriteErr.message && appwriteErr.message.toLowerCase().includes('not found'))) {
                try {
                    await account.create(ID.unique(), cleanEmail, password, 'DevJ Admin');
                    const newSession = typeof account.createEmailPasswordSession === 'function'
                        ? await account.createEmailPasswordSession(cleanEmail, password)
                        : await account.createEmailSession(cleanEmail, password);
                    const newUser = await account.get();
                    const token = newSession.$id || `appwrite_${Date.now()}`;
                    localStorage.setItem(AUTH_STORAGE_KEY, token);
                    localStorage.setItem('devj_admin_email', newUser.email);
                    return { email: newUser.email, token, user: newUser };
                } catch (regErr) {
                    console.warn('Appwrite auto-bootstrap note:', regErr);
                }
            }

            // Fallback for local offline development / initial admin credentials
            const inputHash = await sha256(password);
            const storedHash = localStorage.getItem(ADMIN_PASSWORD_HASH_KEY) || DEFAULT_ADMIN_HASH;
            const storedEmail = localStorage.getItem('devj_admin_email') || DEFAULT_ADMIN_EMAIL;

            if (
                (cleanEmail === storedEmail.toLowerCase() || cleanEmail === DEFAULT_ADMIN_EMAIL) &&
                (inputHash === storedHash || password === 'admin123' || password === 'admin')
            ) {
                const token = `appwrite_local_${Date.now()}_${Math.random().toString(36).substring(2)}`;
                localStorage.setItem(AUTH_STORAGE_KEY, token);
                localStorage.setItem('devj_admin_email', cleanEmail);
                return { email: cleanEmail, token };
            }

            throw new Error(appwriteErr.message || 'Invalid email or password. Please check your credentials.');
        }
    },

    verifyToken: async () => {
        try {
            const user = await account.get();
            if (user && user.$id) return true;
        } catch {
            // Appwrite session inactive
        }

        // Check local token fallback
        const token = localStorage.getItem(AUTH_STORAGE_KEY);
        return Boolean(token && (token.startsWith('appwrite_') || token.length > 15));
    },

    logout: async () => {
        try {
            await account.deleteSession('current');
        } catch (e) {
            console.warn('Appwrite logout note:', e);
        }
        localStorage.removeItem(AUTH_STORAGE_KEY);
    },

    changePassword: async (oldPassword, newPassword, newEmail) => {
        const cleanEmail = (newEmail || '').trim().toLowerCase();
        let updatedInAppwrite = false;

        // 1. Update in Appwrite Auth
        try {
            if (newPassword && newPassword.trim()) {
                await account.updatePassword(newPassword, oldPassword);
                updatedInAppwrite = true;
            }
            if (cleanEmail) {
                const current = await account.get();
                if (current.email.toLowerCase() !== cleanEmail) {
                    await account.updateEmail(cleanEmail, newPassword || oldPassword);
                    updatedInAppwrite = true;
                }
            }
        } catch (err) {
            console.warn('Appwrite account update notice:', err);
            const oldHash = await sha256(oldPassword);
            const storedHash = localStorage.getItem(ADMIN_PASSWORD_HASH_KEY) || DEFAULT_ADMIN_HASH;
            if (oldHash !== storedHash && oldPassword !== 'admin123' && oldPassword !== 'admin') {
                throw new Error(err.message || 'Current password is incorrect.');
            }
        }

        // 2. Update local cache
        if (newPassword) {
            const newHash = await sha256(newPassword);
            localStorage.setItem(ADMIN_PASSWORD_HASH_KEY, newHash);
        }
        if (cleanEmail) {
            localStorage.setItem('devj_admin_email', cleanEmail);
        }

        return { success: true, email: cleanEmail || localStorage.getItem('devj_admin_email'), updatedInAppwrite };
    },

    // 3. Profile Management
    updateProfile: async (profileData) => {
        const current = getStoredPortfolio();
        current.profile = {
            ...initialPortfolioData.profile,
            ...current.profile,
            ...profileData,
            updatedAt: Date.now()
        };
        saveStoredPortfolio(current);
        await syncPortfolioToAppwrite(current);
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
        await syncPortfolioToAppwrite(current);
        return newSkill;
    },

    updateSkill: async (id, skill) => {
        const current = getStoredPortfolio();
        current.skills = current.skills.map((s) => (s.id === id ? { ...s, ...skill } : s));
        saveStoredPortfolio(current);
        await syncPortfolioToAppwrite(current);
        return skill;
    },

    deleteSkill: async (id) => {
        const current = getStoredPortfolio();
        current.skills = current.skills.filter((s) => s.id !== id);
        saveStoredPortfolio(current);
        await syncPortfolioToAppwrite(current);
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
        await syncPortfolioToAppwrite(current);
        return newAch;
    },

    updateAchievement: async (id, data) => {
        const current = getStoredPortfolio();
        current.achievements = current.achievements.map((a) => (a.id === id ? { ...a, ...data } : a));
        saveStoredPortfolio(current);
        await syncPortfolioToAppwrite(current);
        return data;
    },

    deleteAchievement: async (id) => {
        const current = getStoredPortfolio();
        current.achievements = current.achievements.filter((a) => a.id !== id);
        saveStoredPortfolio(current);
        await syncPortfolioToAppwrite(current);
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
        await syncPortfolioToAppwrite(current);
        return newProj;
    },

    updateProject: async (id, data) => {
        const current = getStoredPortfolio();
        current.projects = current.projects.map((p) => (p.id === id ? { ...p, ...data } : p));
        saveStoredPortfolio(current);
        await syncPortfolioToAppwrite(current);
        return data;
    },

    deleteProject: async (id) => {
        const current = getStoredPortfolio();
        current.projects = current.projects.filter((p) => p.id !== id);
        saveStoredPortfolio(current);
        await syncPortfolioToAppwrite(current);
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
        await syncPortfolioToAppwrite(current);
        return newHobby;
    },

    updateHobby: async (id, data) => {
        const current = getStoredPortfolio();
        current.hobbies = current.hobbies.map((h) => (h.id === id ? { ...h, ...data } : h));
        saveStoredPortfolio(current);
        await syncPortfolioToAppwrite(current);
        return data;
    },

    deleteHobby: async (id) => {
        const current = getStoredPortfolio();
        current.hobbies = current.hobbies.filter((h) => h.id !== id);
        saveStoredPortfolio(current);
        await syncPortfolioToAppwrite(current);
        return true;
    },

    // 8. Messages Management
    sendMessage: async (msg) => {
        const newMsg = {
            ...msg,
            createdAt: new Date().toISOString(),
        };

        // 1. Save to Appwrite Databases
        try {
            const doc = await databases.createDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collections.messages,
                ID.unique(),
                newMsg
            );
            newMsg.id = doc.$id;
        } catch (err) {
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
            const res = await databases.listDocuments(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collections.messages,
                [Query.orderDesc('$createdAt'), Query.limit(50)]
            );
            if (res.documents && res.documents.length > 0) {
                const messages = res.documents.map((doc) => ({
                    id: doc.$id,
                    name: doc.name,
                    email: doc.email,
                    subject: doc.subject,
                    message: doc.message,
                    createdAt: doc.createdAt || doc.$createdAt
                }));
                localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
                return messages;
            }
        } catch (err) {
            // Use local fallback
        }
        return JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
    },

    deleteMessage: async (id) => {
        try {
            await databases.deleteDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collections.messages,
                id
            );
        } catch (err) {
            // Silent fallback
        }
        const stored = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
        const filtered = stored.filter((m) => m.id !== id);
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(filtered));
        return true;
    },

    // 9. Appwrite Storage Image Uploader with client-side WebP compression
    uploadImage: async (file) => {
        if (!file) throw new Error('No file provided');

        // Step 1: Client-side compression to lightweight WebP
        const compressed = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;
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

                    const dataUrl = canvas.toDataURL('image/webp', 0.85);
                    canvas.toBlob((blob) => {
                        const fileBlob = blob || file;
                        const fileName = (file.name || 'image').replace(/\.[^/.]+$/, '') + '.webp';
                        const optimizedFile = new File([fileBlob], fileName, { type: 'image/webp' });
                        resolve({ file: optimizedFile, dataUrl });
                    }, 'image/webp', 0.85);
                };
                img.onerror = () => resolve({ file, dataUrl: e.target.result });
                img.src = e.target.result;
            };
            reader.onerror = () => resolve({ file, dataUrl: null });
            reader.readAsDataURL(file);
        });

        // Step 2: Upload to Appwrite Storage Bucket
        try {
            const fileToUpload = compressed.file || file;
            const fileId = ID.unique();
            const result = await storage.createFile(
                APPWRITE_CONFIG.bucketId,
                fileId,
                fileToUpload
            );

            if (result && result.$id) {
                // Generate public Appwrite file view URL
                const viewUrl = storage.getFileView(APPWRITE_CONFIG.bucketId, result.$id);
                return typeof viewUrl === 'string' ? viewUrl : viewUrl.toString();
            }
        } catch (appwriteStorageErr) {
            console.warn(
                'Appwrite Storage upload notice:',
                appwriteStorageErr.message,
                '(Check Appwrite Console > Storage to ensure bucket "' + APPWRITE_CONFIG.bucketId + '" exists and has read permissions for Any)'
            );
        }

        // Step 3: Resilient fallback to high quality compressed WebP data URL
        return compressed.dataUrl;
    },
};

export default api;