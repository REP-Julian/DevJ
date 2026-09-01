import {
    account,
    databases,
    storage,
    appwriteConfig,
    ID,
    Query,
    Permission,
    Role,
} from './appwrite';
import { initialPortfolioData } from '../data/portfolioData';

const PORTFOLIO_STORAGE_KEY = 'devj_portfolio_data_v1';
const MESSAGES_STORAGE_KEY = 'devj_portfolio_messages_v1';
const AUTH_STORAGE_KEY = 'devj_portfolio_auth_token';

const getStoredPortfolio = () => {
    try {
        const stored = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.warn('Could not read local portfolio fallback:', e);
    }
    return initialPortfolioData;
};

const saveStoredPortfolio = (data) => {
    try {
        localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Could not save local portfolio fallback:', e);
    }
};

const normalizeDoc = (doc) => {
    if (!doc) return null;
    return {
        ...doc,
        id: doc.$id || doc.id,
    };
};

const cleanPayload = (data) => {
    const payload = { ...data };
    delete payload.$id;
    delete payload.$createdAt;
    delete payload.$updatedAt;
    delete payload.$permissions;
    delete payload.$databaseId;
    delete payload.$collectionId;
    delete payload.id;
    return payload;
};

export const api = {
    isAppwriteActive: () => appwriteConfig.isConfigured,

    // Public Portfolio Aggregation (Queries Appwrite Cloud; falls back to default if collection empty)
    getPortfolio: async () => {
        if (!appwriteConfig.isConfigured) {
            return getStoredPortfolio();
        }

        try {
            const [profileRes, skillsRes, achievementsRes, projectsRes, hobbiesRes] =
                await Promise.allSettled([
                    databases.listDocuments(
                        appwriteConfig.databaseId,
                        appwriteConfig.collections.profile,
                        [Query.limit(1)]
                    ),
                    databases.listDocuments(
                        appwriteConfig.databaseId,
                        appwriteConfig.collections.skills,
                        [Query.orderAsc('order')]
                    ),
                    databases.listDocuments(
                        appwriteConfig.databaseId,
                        appwriteConfig.collections.achievements,
                        [Query.orderAsc('order')]
                    ),
                    databases.listDocuments(
                        appwriteConfig.databaseId,
                        appwriteConfig.collections.projects,
                        [Query.orderAsc('order')]
                    ),
                    databases.listDocuments(
                        appwriteConfig.databaseId,
                        appwriteConfig.collections.hobbies,
                        [Query.orderAsc('order')]
                    ),
                ]);

            const fallback = getStoredPortfolio();

            const profileDoc =
                profileRes.status === 'fulfilled' && profileRes.value.documents.length > 0
                    ? { ...fallback.profile, ...normalizeDoc(profileRes.value.documents[0]) }
                    : fallback.profile;

            const skillsDocs =
                skillsRes.status === 'fulfilled' && skillsRes.value.documents.length > 0
                    ? skillsRes.value.documents.map(normalizeDoc)
                    : fallback.skills;

            const achievementsDocs =
                achievementsRes.status === 'fulfilled' && achievementsRes.value.documents.length > 0
                    ? achievementsRes.value.documents.map(normalizeDoc)
                    : fallback.achievements;

            const projectsDocs =
                projectsRes.status === 'fulfilled' && projectsRes.value.documents.length > 0
                    ? projectsRes.value.documents.map(normalizeDoc)
                    : fallback.projects;

            const hobbiesDocs =
                hobbiesRes.status === 'fulfilled' && hobbiesRes.value.documents.length > 0
                    ? hobbiesRes.value.documents.map(normalizeDoc)
                    : fallback.hobbies;

            return {
                profile: profileDoc,
                skills: skillsDocs,
                achievements: achievementsDocs,
                projects: projectsDocs,
                hobbies: hobbiesDocs,
            };
        } catch (err) {
            console.warn('Appwrite query notice, loading stored data:', err.message);
            return getStoredPortfolio();
        }
    },

    // Authentication (Strict Appwrite Cloud Authentication)
    login: async (email, password) => {
        try {
            await account.deleteSession('current');
        } catch {
            // Ignore if no active session
        }

        try {
            const session = await account.createEmailPasswordSession(email, password);
            const user = await account.get();
            localStorage.setItem(AUTH_STORAGE_KEY, session.$id);
            return { ...user, session };
        } catch (err) {
            console.error('Appwrite authentication error:', err);
            throw new Error(err.message || 'Invalid email or password. Please check your Appwrite credentials.');
        }
    },

    verifyToken: async () => {
        try {
            const user = await account.get();
            if (user && user.$id) {
                return true;
            }
            return false;
        } catch {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            return false;
        }
    },

    logout: async () => {
        try {
            await account.deleteSession('current');
        } catch {
            // Ignore
        }
        localStorage.removeItem(AUTH_STORAGE_KEY);
    },

    // Profile Management
    updateProfile: async (profileData) => {
        const payload = cleanPayload(profileData);
        // Save immediately to local cache
        const current = getStoredPortfolio();
        current.profile = { ...current.profile, ...profileData };
        saveStoredPortfolio(current);

        try {
            const docs = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.profile,
                [Query.limit(1)]
            );

            if (docs.documents.length > 0) {
                const docId = docs.documents[0].$id;
                const updated = await databases.updateDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.collections.profile,
                    docId,
                    payload
                );
                return { ...current.profile, ...normalizeDoc(updated) };
            } else {
                const created = await databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.collections.profile,
                    ID.unique(),
                    payload,
                    [Permission.read(Role.any()), Permission.write(Role.any())]
                );
                return { ...current.profile, ...normalizeDoc(created) };
            }
        } catch (err) {
            console.error('Appwrite profile sync error:', err);
            throw new Error(`Appwrite Cloud Error: ${err.message}`);
        }
    },

    // Skills Management
    createSkill: async (skill) => {
        const payload = cleanPayload({
            ...skill,
            proficiency: Number(skill.proficiency) || 90,
            order: Number(skill.order) || 0,
        });

        try {
            const res = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.skills,
                ID.unique(),
                payload,
                [Permission.read(Role.any()), Permission.write(Role.any())]
            );
            return normalizeDoc(res);
        } catch (err) {
            console.warn('Saving skill to local fallback:', err.message);
            const current = getStoredPortfolio();
            const newSkill = { ...skill, id: String(Date.now()), proficiency: Number(skill.proficiency) || 90, order: Number(skill.order) || current.skills.length + 1 };
            current.skills.push(newSkill);
            saveStoredPortfolio(current);
            return newSkill;
        }
    },

    updateSkill: async (id, skill) => {
        const payload = cleanPayload({
            ...skill,
            proficiency: Number(skill.proficiency) || 90,
            order: Number(skill.order) || 0,
        });

        try {
            const res = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.skills,
                id,
                payload
            );
            return normalizeDoc(res);
        } catch (err) {
            const current = getStoredPortfolio();
            current.skills = current.skills.map((s) => (s.id === id ? { ...s, ...skill } : s));
            saveStoredPortfolio(current);
            return skill;
        }
    },

    deleteSkill: async (id) => {
        try {
            await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.collections.skills, id);
            return true;
        } catch (err) {
            const current = getStoredPortfolio();
            current.skills = current.skills.filter((s) => s.id !== id);
            saveStoredPortfolio(current);
            return true;
        }
    },

    // Achievements Management
    createAchievement: async (data) => {
        const payload = cleanPayload({
            ...data,
            order: Number(data.order) || 0,
        });

        try {
            const res = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.achievements,
                ID.unique(),
                payload,
                [Permission.read(Role.any()), Permission.write(Role.any())]
            );
            return normalizeDoc(res);
        } catch (err) {
            const current = getStoredPortfolio();
            const newAch = { ...data, id: String(Date.now()), order: Number(data.order) || current.achievements.length + 1 };
            current.achievements.push(newAch);
            saveStoredPortfolio(current);
            return newAch;
        }
    },

    updateAchievement: async (id, data) => {
        const payload = cleanPayload({
            ...data,
            order: Number(data.order) || 0,
        });

        try {
            const res = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.achievements,
                id,
                payload
            );
            return normalizeDoc(res);
        } catch (err) {
            const current = getStoredPortfolio();
            current.achievements = current.achievements.map((a) => (a.id === id ? { ...a, ...data } : a));
            saveStoredPortfolio(current);
            return data;
        }
    },

    deleteAchievement: async (id) => {
        try {
            await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.collections.achievements, id);
            return true;
        } catch (err) {
            const current = getStoredPortfolio();
            current.achievements = current.achievements.filter((a) => a.id !== id);
            saveStoredPortfolio(current);
            return true;
        }
    },

    // Projects Management
    createProject: async (data) => {
        const payload = cleanPayload({
            ...data,
            order: Number(data.order) || 0,
        });

        try {
            const res = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.projects,
                ID.unique(),
                payload,
                [Permission.read(Role.any()), Permission.write(Role.any())]
            );
            return normalizeDoc(res);
        } catch (err) {
            const current = getStoredPortfolio();
            const newProj = { ...data, id: String(Date.now()), order: Number(data.order) || current.projects.length + 1 };
            current.projects.push(newProj);
            saveStoredPortfolio(current);
            return newProj;
        }
    },

    updateProject: async (id, data) => {
        const payload = cleanPayload({
            ...data,
            order: Number(data.order) || 0,
        });

        try {
            const res = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.projects,
                id,
                payload
            );
            return normalizeDoc(res);
        } catch (err) {
            const current = getStoredPortfolio();
            current.projects = current.projects.map((p) => (p.id === id ? { ...p, ...data } : p));
            saveStoredPortfolio(current);
            return data;
        }
    },

    deleteProject: async (id) => {
        try {
            await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.collections.projects, id);
            return true;
        } catch (err) {
            const current = getStoredPortfolio();
            current.projects = current.projects.filter((p) => p.id !== id);
            saveStoredPortfolio(current);
            return true;
        }
    },

    // Hobbies Management
    createHobby: async (data) => {
        const payload = cleanPayload({
            ...data,
            order: Number(data.order) || 0,
        });

        try {
            const res = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.hobbies,
                ID.unique(),
                payload,
                [Permission.read(Role.any()), Permission.write(Role.any())]
            );
            return normalizeDoc(res);
        } catch (err) {
            const current = getStoredPortfolio();
            const newHobby = { ...data, id: String(Date.now()), order: Number(data.order) || current.hobbies.length + 1 };
            current.hobbies.push(newHobby);
            saveStoredPortfolio(current);
            return newHobby;
        }
    },

    updateHobby: async (id, data) => {
        const payload = cleanPayload({
            ...data,
            order: Number(data.order) || 0,
        });

        try {
            const res = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.hobbies,
                id,
                payload
            );
            return normalizeDoc(res);
        } catch (err) {
            const current = getStoredPortfolio();
            current.hobbies = current.hobbies.map((h) => (h.id === id ? { ...h, ...data } : h));
            saveStoredPortfolio(current);
            return data;
        }
    },

    deleteHobby: async (id) => {
        try {
            await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.collections.hobbies, id);
            return true;
        } catch (err) {
            const current = getStoredPortfolio();
            current.hobbies = current.hobbies.filter((h) => h.id !== id);
            saveStoredPortfolio(current);
            return true;
        }
    },

    // Contact Messages
    sendMessage: async (data) => {
        const record = {
            name: data.name,
            email: data.email,
            message: data.message,
            createdAt: new Date().toISOString(),
            read: false,
        };

        try {
            await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.messages,
                ID.unique(),
                record,
                [Permission.read(Role.any()), Permission.write(Role.any())]
            );
            return { success: true };
        } catch (err) {
            const stored = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
            stored.unshift({ ...record, id: String(Date.now()) });
            localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(stored));
            return { success: true };
        }
    },

    getMessages: async () => {
        try {
            const res = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.messages,
                [Query.orderDesc('createdAt')]
            );
            return res.documents.map(normalizeDoc);
        } catch {
            return JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
        }
    },

    deleteMessage: async (id) => {
        try {
            await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.collections.messages, id);
            return true;
        } catch {
            const stored = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
            const filtered = stored.filter((m) => m.id !== id);
            localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(filtered));
            return true;
        }
    },

    // Image Upload to Appwrite Storage Bucket (falls back to Data URI)
    uploadImage: async (file) => {
        try {
            const fileId = ID.unique();
            const createdFile = await storage.createFile(
                appwriteConfig.bucketId,
                fileId,
                file,
                [Permission.read(Role.any()), Permission.write(Role.any())]
            );

            // Get direct public CDN view URL
            const fileView = storage.getFileView(appwriteConfig.bucketId, createdFile.$id);
            return fileView.href || String(fileView);
        } catch (err) {
            console.warn('Appwrite bucket upload notice, using optimized data URI:', err.message);
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }
    },
};

export default api;