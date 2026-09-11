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

export const getStoredPortfolio = () => {
    try {
        const stored = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            let updated = false;

            // Automatically purge legacy buzzwords from stale local storage
            if (
                parsed.profile?.tagline?.includes('Vibe Developer') ||
                parsed.profile?.tagline?.includes('Enthusiast')
            ) {
                if (!parsed.profile) parsed.profile = {};
                parsed.profile.tagline = initialPortfolioData.profile.tagline;
                updated = true;
            }
            if (
                parsed.profile?.description?.includes('possibilities of artificial intelligence') ||
                parsed.profile?.description?.includes('turning ideas into interactive') ||
                parsed.profile?.description?.includes('custom REST APIs')
            ) {
                if (!parsed.profile) parsed.profile = {};
                parsed.profile.description = initialPortfolioData.profile.description;
                updated = true;
            }

            // Automatically upgrade legacy Unsplash stock photos to Appwrite Cloud assets
            if (
                parsed.profile?.avatarUrl?.includes('images.unsplash.com') ||
                !parsed.profile?.avatarUrl
            ) {
                if (!parsed.profile) parsed.profile = {};
                parsed.profile.avatarUrl = initialPortfolioData.profile.avatarUrl;
                updated = true;
            }
            if (
                parsed.profile?.avatarUrl2?.includes('images.unsplash.com') ||
                !parsed.profile?.avatarUrl2
            ) {
                if (!parsed.profile) parsed.profile = {};
                parsed.profile.avatarUrl2 = initialPortfolioData.profile.avatarUrl2;
                updated = true;
            }
            if (
                parsed.profile?.avatarUrl3?.includes('images.unsplash.com') ||
                !parsed.profile?.avatarUrl3
            ) {
                if (!parsed.profile) parsed.profile = {};
                parsed.profile.avatarUrl3 = initialPortfolioData.profile.avatarUrl3;
                updated = true;
            }

            if (updated) {
                saveStoredPortfolio({
                    ...initialPortfolioData,
                    ...parsed,
                });
            }

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

// Storage file ID for persistent cloud portfolio state
const CLOUD_STORAGE_FILE_ID = 'portfolio_data';

// Helper to fetch live portfolio state directly from Appwrite Storage
const getPortfolioFromStorage = async () => {
    try {
        const url = `${APPWRITE_CONFIG.endpoint}/storage/buckets/${APPWRITE_CONFIG.bucketId}/files/${CLOUD_STORAGE_FILE_ID}/view?project=${APPWRITE_CONFIG.projectId}`;
        const res = await fetch(url, { cache: 'no-cache' });
        if (res.ok) {
            return await res.json();
        }
    } catch (err) {
        // storage fetch failed or offline
    }
    return null;
};

// Helper to auto-upload any base64 data: URLs to Appwrite Storage
const uploadBase64IfAny = async (url, namePrefix) => {
    if (!url || typeof url !== 'string' || !url.startsWith('data:image/')) {
        return url;
    }
    try {
        const res = await fetch(url);
        const blob = await res.blob();
        const fileId = ID.unique();
        const fileName = `${namePrefix}-${Date.now()}.webp`;
        const file = new File([blob], fileName, { type: blob.type || 'image/webp' });
        const result = await storage.createFile(APPWRITE_CONFIG.bucketId, fileId, file);
        if (result && result.$id) {
            const viewUrl = storage.getFileView(APPWRITE_CONFIG.bucketId, result.$id);
            return typeof viewUrl === 'string' ? viewUrl : viewUrl.toString();
        }
    } catch (err) {
        console.warn('Notice: Base64 image cloud migration fallback:', err);
    }
    return url;
};

// Sanitize all portfolio image assets before cloud sync
const sanitizeAndUploadAssets = async (data) => {
    if (!data) return data;
    const cloned = JSON.parse(JSON.stringify(data));
    if (cloned.profile) {
        if (cloned.profile.avatarUrl) cloned.profile.avatarUrl = await uploadBase64IfAny(cloned.profile.avatarUrl, 'avatar1');
        if (cloned.profile.avatarUrl2) cloned.profile.avatarUrl2 = await uploadBase64IfAny(cloned.profile.avatarUrl2, 'avatar2');
        if (cloned.profile.avatarUrl3) cloned.profile.avatarUrl3 = await uploadBase64IfAny(cloned.profile.avatarUrl3, 'avatar3');
    }
    if (Array.isArray(cloned.projects)) {
        for (let i = 0; i < cloned.projects.length; i++) {
            if (cloned.projects[i].imageUrl) {
                cloned.projects[i].imageUrl = await uploadBase64IfAny(cloned.projects[i].imageUrl, `project-${i + 1}`);
            }
        }
    }
    if (Array.isArray(cloned.achievements)) {
        for (let i = 0; i < cloned.achievements.length; i++) {
            if (cloned.achievements[i].imageUrl) {
                cloned.achievements[i].imageUrl = await uploadBase64IfAny(cloned.achievements[i].imageUrl, `achievement-${i + 1}`);
            }
        }
    }
    if (Array.isArray(cloned.hobbies)) {
        for (let i = 0; i < cloned.hobbies.length; i++) {
            if (cloned.hobbies[i].imageUrl) {
                cloned.hobbies[i].imageUrl = await uploadBase64IfAny(cloned.hobbies[i].imageUrl, `hobby-${i + 1}`);
            }
        }
    }
    return cloned;
};

// Helper to sync portfolio state JSON directly to Appwrite Storage Bucket
const syncPortfolioToStorage = async (portfolioData) => {
    try {
        const payload = {
            ...portfolioData,
            updatedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const formData = new FormData();
        formData.append('fileId', CLOUD_STORAGE_FILE_ID);
        formData.append('file', blob, 'portfolio-data.json');
        formData.append('permissions[]', 'read("any")');

        // Delete existing cloud file first if exists
        try {
            await fetch(
                `${APPWRITE_CONFIG.endpoint}/storage/buckets/${APPWRITE_CONFIG.bucketId}/files/${CLOUD_STORAGE_FILE_ID}`,
                {
                    method: 'DELETE',
                    headers: { 'X-Appwrite-Project': APPWRITE_CONFIG.projectId },
                }
            );
        } catch (e) {
            // file didn't exist yet
        }

        const res = await fetch(
            `${APPWRITE_CONFIG.endpoint}/storage/buckets/${APPWRITE_CONFIG.bucketId}/files`,
            {
                method: 'POST',
                headers: { 'X-Appwrite-Project': APPWRITE_CONFIG.projectId },
                body: formData,
            }
        );

        return res.ok;
    } catch (err) {
        console.warn('Appwrite Storage sync error:', err);
        return false;
    }
};

// Background helper: sync portfolio modifications to Appwrite Storage + Databases (Dual-Cloud Sync)
const syncPortfolioToAppwrite = async (portfolioData) => {
    try {
        const sanitized = await sanitizeAndUploadAssets(portfolioData);
        saveStoredPortfolio(sanitized);

        // 1. Primary Sync to Appwrite Storage Bucket (Instant cross-device sync)
        const storageOk = await syncPortfolioToStorage(sanitized);

        // 2. Secondary Sync to Appwrite Database (If collection configured)
        let dbOk = false;
        try {
            const docId = 'main';
            const payload = {
                content: JSON.stringify(sanitized),
                updatedAt: new Date().toISOString(),
            };
            try {
                await databases.updateDocument(
                    APPWRITE_CONFIG.databaseId,
                    APPWRITE_CONFIG.collections.portfolio,
                    docId,
                    payload
                );
                dbOk = true;
            } catch (updateErr) {
                if (updateErr.code === 404) {
                    await databases.createDocument(
                        APPWRITE_CONFIG.databaseId,
                        APPWRITE_CONFIG.collections.portfolio,
                        docId,
                        payload
                    );
                    dbOk = true;
                }
            }
        } catch (dbErr) {
            // Database collection pending setup in Appwrite Console
        }

        if (storageOk || dbOk) {
            return { success: true, storage: storageOk, database: dbOk };
        }
        return { success: false, error: 'Could not synchronize to Appwrite Cloud Storage' };
    } catch (err) {
        console.warn('[Appwrite Cloud Sync Notice]:', err.message);
        return { success: false, error: err.message };
    }
};

export const api = {
    // 1. Public Portfolio Data (Appwrite Storage + Databases Dual Cloud Sync with Local Fallback)
    getPortfolio: async () => {
        let remoteData = null;

        // 1. Try Appwrite Databases first if collection exists
        try {
            const doc = await databases.getDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collections.portfolio,
                'main'
            );
            if (doc && doc.content) {
                try {
                    remoteData = typeof doc.content === 'string' ? JSON.parse(doc.content) : doc.content;
                } catch {
                    remoteData = doc;
                }
            }
        } catch (e) {
            // Database collection not configured or pending setup
        }

        // 2. Try Appwrite Storage Bucket ("portfolio_data")
        if (!remoteData) {
            try {
                remoteData = await getPortfolioFromStorage();
            } catch (e) {
                // Storage fetch failed or offline
            }
        }

        const local = getStoredPortfolio();

        if (remoteData) {
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
                    : (remoteProfile.email && remoteProfile.email !== 'contact@devj.com' ? remoteProfile.email : (local.profile?.email || ''));
            }

            // Guarantee QR codes saved in local or Appwrite are preserved
            ['githubQrUrl', 'facebookQrUrl', 'instagramQrUrl', 'telegramQrUrl', 'whatsappQrUrl'].forEach((k) => {
                mergedProfile[k] = remoteProfile[k] || local.profile?.[k] || '';
            });

            // Preserve resumeUrl from remote document or local storage
            mergedProfile.resumeUrl = remoteProfile.resumeUrl || local.profile?.resumeUrl || '';

            // Sanitize legacy buzzwords if saved in remote document or stale profile
            if (
                mergedProfile.tagline?.includes('Vibe Developer') ||
                mergedProfile.tagline?.includes('Enthusiast')
            ) {
                mergedProfile.tagline = initialPortfolioData.profile.tagline;
            }
            if (
                mergedProfile.description?.includes('possibilities of artificial intelligence') ||
                mergedProfile.description?.includes('turning ideas into interactive') ||
                mergedProfile.description?.includes('custom REST APIs')
            ) {
                mergedProfile.description = initialPortfolioData.profile.description;
            }

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

        return local;
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

    // 8. Messages Management (Direct Appwrite Cloud Storage Primary Sync)
    sendMessage: async (msg) => {
        const newMsg = {
            ...msg,
            id: `appwrite_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            subject: msg.subject || 'Direct Inquiry',
            createdAt: new Date().toISOString(),
            replied: false,
            repliedAt: null
        };

        let saved = false;

        // 1. PRIMARY: Direct Appwrite Cloud Storage Sync (Works globally on cloud without localhost)
        try {
            const currentCloud = await api.getMessages();
            const updatedCloud = [newMsg, ...currentCloud.filter(m => String(m.id) !== String(newMsg.id))];

            const blob = new Blob([JSON.stringify(updatedCloud, null, 2)], { type: 'application/json' });
            const formData = new FormData();
            formData.append('fileId', 'messages_data');
            formData.append('file', blob, 'messages-data.json');
            formData.append('permissions[]', 'read("any")');

            try {
                await fetch(
                    `${APPWRITE_CONFIG.endpoint}/storage/buckets/${APPWRITE_CONFIG.bucketId}/files/messages_data`,
                    {
                        method: 'DELETE',
                        headers: { 'X-Appwrite-Project': APPWRITE_CONFIG.projectId }
                    }
                );
            } catch {}

            const cloudRes = await fetch(
                `${APPWRITE_CONFIG.endpoint}/storage/buckets/${APPWRITE_CONFIG.bucketId}/files`,
                {
                    method: 'POST',
                    headers: { 'X-Appwrite-Project': APPWRITE_CONFIG.projectId },
                    body: formData
                }
            );

            if (cloudRes.ok) {
                saved = true;
            }
        } catch (cloudErr) {
            console.warn('Appwrite Cloud direct sync notice:', cloudErr);
        }

        // 2. SECONDARY: Also save to Express Backend Database (Prisma SQLite) if local server is active
        const endpoints = ['/api/contact', 'http://localhost:5000/api/contact', 'http://127.0.0.1:5000/api/contact'];
        for (const ep of endpoints) {
            try {
                const res = await fetch(ep, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newMsg)
                });
                if (res.ok) {
                    const json = await res.json();
                    if (json.data?.id) {
                        newMsg.backendId = String(json.data.id);
                        saved = true;
                        break;
                    }
                }
            } catch {}
        }

        // 3. Real-time in-tab and cross-tab broadcast dispatch
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('devj_inquiry_received', { detail: newMsg }));
            try {
                const bc = new BroadcastChannel('devj_inquiries_sync');
                bc.postMessage({ type: 'new_message', data: newMsg });
                setTimeout(() => {
                    try { bc.close(); } catch {}
                }, 1000);
            } catch {}
        }

        if (!saved) {
            throw new Error('Could not connect to Appwrite Cloud or server to deliver your message. Please check your connection.');
        }

        return newMsg;
    },

    getMessages: async () => {
        let token = localStorage.getItem(AUTH_STORAGE_KEY) || '';
        if (!token) {
            token = `appwrite_session_${Date.now()}`;
            try {
                localStorage.setItem(AUTH_STORAGE_KEY, token);
            } catch {}
        }
        const messageMap = new Map();

        // 1. PRIMARY: Fetch directly from Appwrite Cloud Storage (Bucket "portfolio", File "messages_data")
        try {
            const url = `${APPWRITE_CONFIG.endpoint}/storage/buckets/${APPWRITE_CONFIG.bucketId}/files/messages_data/view?project=${APPWRITE_CONFIG.projectId}`;
            const res = await fetch(url, { cache: 'no-cache' });
            if (res.ok) {
                const cloudMsgs = await res.json();
                if (Array.isArray(cloudMsgs)) {
                    cloudMsgs.forEach((m) => {
                        messageMap.set(String(m.id), {
                            id: String(m.id),
                            name: m.name,
                            email: m.email,
                            subject: m.subject || 'Direct Inquiry',
                            message: m.message,
                            createdAt: m.createdAt,
                            replied: Boolean(m.replied),
                            repliedAt: m.repliedAt || null
                        });
                    });
                }
            }
        } catch (cloudFetchErr) {
            console.warn('Appwrite Cloud message fetch note:', cloudFetchErr);
        }

        // 2. SECONDARY: Also merge from Express Backend Database (Prisma SQLite) if local dev server is running
        const endpoints = ['/api/contact/messages', 'http://localhost:5000/api/contact/messages', 'http://127.0.0.1:5000/api/contact/messages'];
        for (const ep of endpoints) {
            try {
                const res = await fetch(ep, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const serverMsgs = await res.json();
                    if (Array.isArray(serverMsgs)) {
                        serverMsgs.forEach((m) => {
                            if (!messageMap.has(String(m.id))) {
                                messageMap.set(String(m.id), {
                                    id: String(m.id),
                                    name: m.name,
                                    email: m.email,
                                    subject: m.subject || 'Direct Inquiry',
                                    message: m.message,
                                    createdAt: m.createdAt,
                                    replied: Boolean(m.replied),
                                    repliedAt: m.repliedAt || null
                                });
                            }
                        });
                        break;
                    }
                }
            } catch {}
        }

        // Security / Sanitation: Purge legacy localStorage message caches so no hidden messages linger
        try {
            localStorage.removeItem(MESSAGES_STORAGE_KEY);
            localStorage.removeItem('devj_messages_status_map');
        } catch {}

        const merged = Array.from(messageMap.values()).sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );

        return merged;
    },

    markMessageReplied: async (id, isReplied = true) => {
        const strId = String(id);
        const now = isReplied ? new Date().toISOString() : null;

        // 1. PRIMARY: Update directly in Appwrite Cloud Storage
        try {
            const currentCloud = await api.getMessages();
            const updatedCloud = currentCloud.map((m) =>
                String(m.id) === strId ? { ...m, replied: isReplied, repliedAt: now } : m
            );

            const blob = new Blob([JSON.stringify(updatedCloud, null, 2)], { type: 'application/json' });
            const formData = new FormData();
            formData.append('fileId', 'messages_data');
            formData.append('file', blob, 'messages-data.json');
            formData.append('permissions[]', 'read("any")');

            try {
                await fetch(
                    `${APPWRITE_CONFIG.endpoint}/storage/buckets/${APPWRITE_CONFIG.bucketId}/files/messages_data`,
                    {
                        method: 'DELETE',
                        headers: { 'X-Appwrite-Project': APPWRITE_CONFIG.projectId }
                    }
                );
            } catch {}

            await fetch(
                `${APPWRITE_CONFIG.endpoint}/storage/buckets/${APPWRITE_CONFIG.bucketId}/files`,
                {
                    method: 'POST',
                    headers: { 'X-Appwrite-Project': APPWRITE_CONFIG.projectId },
                    body: formData
                }
            );
        } catch (cloudErr) {
            console.warn('Appwrite Cloud status update note:', cloudErr);
        }

        // 2. SECONDARY: Update Backend Database if available
        let token = localStorage.getItem(AUTH_STORAGE_KEY) || '';
        if (!token) {
            token = `appwrite_session_${Date.now()}`;
            try { localStorage.setItem(AUTH_STORAGE_KEY, token); } catch {}
        }
        const patchEndpoints = [`/api/contact/messages/${strId}`, `http://localhost:5000/api/contact/messages/${strId}`];
        for (const ep of patchEndpoints) {
            try {
                const res = await fetch(ep, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ replied: isReplied })
                });
                if (res.ok) break;
            } catch {}
        }

        // 3. Local real-time broadcast
        if (typeof window !== 'undefined') {
            try {
                const bc = new BroadcastChannel('devj_inquiries_sync');
                bc.postMessage({ type: 'update_message', data: { id: strId, replied: isReplied, repliedAt: now } });
                setTimeout(() => { try { bc.close(); } catch {} }, 1000);
            } catch {}
        }

        return true;
    },

    deleteMessage: async (id) => {
        const strId = String(id);

        // 1. PRIMARY: Remove directly from Appwrite Cloud Storage
        try {
            const currentCloud = await api.getMessages();
            const updatedCloud = currentCloud.filter((m) => String(m.id) !== strId);

            const blob = new Blob([JSON.stringify(updatedCloud, null, 2)], { type: 'application/json' });
            const formData = new FormData();
            formData.append('fileId', 'messages_data');
            formData.append('file', blob, 'messages-data.json');
            formData.append('permissions[]', 'read("any")');

            try {
                await fetch(
                    `${APPWRITE_CONFIG.endpoint}/storage/buckets/${APPWRITE_CONFIG.bucketId}/files/messages_data`,
                    {
                        method: 'DELETE',
                        headers: { 'X-Appwrite-Project': APPWRITE_CONFIG.projectId }
                    }
                );
            } catch {}

            await fetch(
                `${APPWRITE_CONFIG.endpoint}/storage/buckets/${APPWRITE_CONFIG.bucketId}/files`,
                {
                    method: 'POST',
                    headers: { 'X-Appwrite-Project': APPWRITE_CONFIG.projectId },
                    body: formData
                }
            );
        } catch (cloudErr) {
            console.warn('Appwrite Cloud deletion note:', cloudErr);
        }

        // 2. SECONDARY: Delete from Backend Database if available
        let token = localStorage.getItem(AUTH_STORAGE_KEY) || '';
        if (!token) {
            token = `appwrite_session_${Date.now()}`;
            try { localStorage.setItem(AUTH_STORAGE_KEY, token); } catch {}
        }
        const delEndpoints = [`/api/contact/messages/${strId}`, `http://localhost:5000/api/contact/messages/${strId}`];
        for (const ep of delEndpoints) {
            try {
                const res = await fetch(ep, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.ok) break;
            } catch {}
        }

        // 3. Local real-time broadcast
        if (typeof window !== 'undefined') {
            try {
                const bc = new BroadcastChannel('devj_inquiries_sync');
                bc.postMessage({ type: 'delete_message', data: { id: strId } });
                setTimeout(() => { try { bc.close(); } catch {} }, 1000);
            } catch {}
        }

        return true;
    },

    // 8b. Real-Time Messages Subscription (SSE + BroadcastChannel + Appwrite Realtime + Custom Events)
    subscribeToMessages: (callback) => {
        const cleanups = [];

        // 1. Server-Sent Events (SSE) Stream with direct failover
        if (typeof EventSource !== 'undefined') {
            let activeEs = null;
            let didFailover = false;

            const connectSSE = (url) => {
                try {
                    const es = new EventSource(url);
                    es.addEventListener('new_message', (e) => {
                        try {
                            const data = JSON.parse(e.data);
                            callback({ type: 'new_message', data });
                        } catch {}
                    });
                    es.addEventListener('update_message', (e) => {
                        try {
                            const data = JSON.parse(e.data);
                            callback({ type: 'update_message', data });
                        } catch {}
                    });
                    es.addEventListener('delete_message', (e) => {
                        try {
                            const data = JSON.parse(e.data);
                            callback({ type: 'delete_message', data });
                        } catch {}
                    });
                    es.onerror = () => {
                        if (!didFailover && url === '/api/contact/stream') {
                            didFailover = true;
                            try { es.close(); } catch {}
                            activeEs = connectSSE('http://localhost:5000/api/contact/stream');
                        }
                    };
                    return es;
                } catch {
                    return null;
                }
            };

            activeEs = connectSSE('/api/contact/stream');
            cleanups.push(() => {
                if (activeEs) {
                    try { activeEs.close(); } catch {}
                }
            });
        }

        // 2. Cross-tab BroadcastChannel
        if (typeof BroadcastChannel !== 'undefined') {
            try {
                const bc = new BroadcastChannel('devj_inquiries_sync');
                bc.onmessage = (event) => {
                    if (event.data) {
                        callback(event.data);
                    }
                };
                cleanups.push(() => {
                    try { bc.close(); } catch {}
                });
            } catch {}
        }

        // 3. In-tab custom window event
        if (typeof window !== 'undefined') {
            const handleCustom = (e) => {
                if (e.detail) {
                    callback({ type: 'new_message', data: e.detail });
                }
            };
            window.addEventListener('devj_inquiry_received', handleCustom);
            cleanups.push(() => window.removeEventListener('devj_inquiry_received', handleCustom));
        }

        // 4. Appwrite Realtime (if database collection is active)
        try {
            if (typeof client !== 'undefined' && typeof client.subscribe === 'function') {
                const channel = `databases.${APPWRITE_CONFIG.databaseId}.collections.${APPWRITE_CONFIG.collections.messages}.documents`;
                const unsubscribeAppwrite = client.subscribe(channel, (response) => {
                    if (response.events?.some((ev) => ev.includes('.create'))) {
                        callback({
                            type: 'new_message',
                            data: {
                                id: response.payload.$id,
                                name: response.payload.name,
                                email: response.payload.email,
                                subject: response.payload.subject || 'Direct Inquiry',
                                message: response.payload.message,
                                createdAt: response.payload.createdAt || response.payload.$createdAt,
                                replied: response.payload.replied || false,
                                repliedAt: response.payload.repliedAt || null
                            }
                        });
                    } else if (response.events?.some((ev) => ev.includes('.update'))) {
                        callback({
                            type: 'update_message',
                            data: {
                                id: response.payload.$id,
                                replied: response.payload.replied || false,
                                repliedAt: response.payload.repliedAt || null
                            }
                        });
                    } else if (response.events?.some((ev) => ev.includes('.delete'))) {
                        callback({
                            type: 'delete_message',
                            data: { id: response.payload.$id }
                        });
                    }
                });
                cleanups.push(() => {
                    if (typeof unsubscribeAppwrite === 'function') unsubscribeAppwrite();
                });
            }
        } catch {}

        // Return unified unsubscribe function
        return () => {
            cleanups.forEach((fn) => {
                try {
                    fn();
                } catch {}
            });
        };
    },

    sendDirectEmail: async ({ to, subject, body, appPassword }) => {
        const token = localStorage.getItem(AUTH_STORAGE_KEY) || '';
        const res = await fetch('/api/contact/send-direct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                to,
                subject,
                body,
                appPassword
            })
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || data.message || 'Failed to dispatch email directly.');
        }
        return data;
    },

    getSmtpStatus: async () => {
        const token = localStorage.getItem(AUTH_STORAGE_KEY) || '';
        try {
            const res = await fetch('/api/contact/smtp-status', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                return await res.json();
            }
        } catch {}
        return { configured: false, hasEnvCredentials: false };
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

    // 10. Appwrite Storage Document / File Uploader (PDF, DOC, DOCX, etc.)
    uploadFile: async (file) => {
        if (!file) throw new Error('No file provided');

        // Step 1: Upload to Appwrite Storage Bucket
        try {
            const fileId = ID.unique();
            const result = await storage.createFile(
                APPWRITE_CONFIG.bucketId,
                fileId,
                file
            );

            if (result && result.$id) {
                const viewUrl = storage.getFileView(APPWRITE_CONFIG.bucketId, result.$id);
                return typeof viewUrl === 'string' ? viewUrl : viewUrl.toString();
            }
        } catch (appwriteStorageErr) {
            console.warn(
                'Appwrite Storage file upload notice:',
                appwriteStorageErr.message,
                '(Check Appwrite Console > Storage to ensure bucket "' + APPWRITE_CONFIG.bucketId + '" exists and has read permissions for Any)'
            );
        }

        // Step 2: Resilient fallback to local Data URL
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read file locally'));
            reader.readAsDataURL(file);
        });
    },

    // 11. Appwrite Cloud Diagnostics & Sync (Storage + Database)
    checkAppwriteStatus: async () => {
        // 1. Check Appwrite Storage bucket ("portfolio_data")
        const storageData = await getPortfolioFromStorage();
        if (storageData && storageData.profile) {
            return {
                connected: true,
                status: 'synced',
                target: 'storage',
                message: 'Appwrite Cloud Storage ("portfolio_data") is connected and synchronized live across all devices!'
            };
        }

        // 2. Check Database collection as secondary
        try {
            await databases.getDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collections.portfolio,
                'main'
            );
            return { connected: true, status: 'synced', target: 'database', message: 'Cloud database connected and synced.' };
        } catch (err) {
            if (err.code === 404 && err.type === 'collection_not_found') {
                return {
                    connected: false,
                    status: 'missing_collection',
                    message: 'Click "Sync to Cloud Now" to synchronize your complete portfolio to Appwrite Cloud Storage!'
                };
            }
            return { connected: false, status: 'error', message: err.message };
        }
    },

    forceSyncToCloud: async () => {
        const current = getStoredPortfolio();
        return await syncPortfolioToAppwrite(current);
    },

    getStoredPortfolio: () => {
        return getStoredPortfolio();
    },
};

export default api;