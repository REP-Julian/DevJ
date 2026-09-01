import { Client, Account, Databases, Storage, ID, Query, Permission, Role } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '6a969fd7003709708d27';
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || '6a96aa5b003b6af4827b';
const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID || 'portfolio-assets';

export const appwriteConfig = {
    endpoint,
    projectId,
    databaseId,
    bucketId,
    collections: {
        profile: import.meta.env.VITE_APPWRITE_COLLECTION_PROFILE || '6a96aa940026789aaa03',
        skills: import.meta.env.VITE_APPWRITE_COLLECTION_SKILLS || '6a96ace40004e4cf7979',
        achievements: import.meta.env.VITE_APPWRITE_COLLECTION_ACHIEVEMENTS || '6a96b11f002f88e7773e',
        projects: import.meta.env.VITE_APPWRITE_COLLECTION_PROJECTS || '6a96b1b00031b6fa4f8a',
        hobbies: import.meta.env.VITE_APPWRITE_COLLECTION_HOBBIES || '6a96b1f90007d2b11849',
        messages: import.meta.env.VITE_APPWRITE_COLLECTION_MESSAGES || 'messages',
    },
    isConfigured: Boolean(projectId && projectId.trim() !== '' && projectId !== 'your-appwrite-project-id'),
};

export const client = new Client();

if (appwriteConfig.isConfigured) {
    client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);
    
    // Client connection verification ping
    if (typeof client.ping === 'function') {
        client.ping().then(() => {
            console.log('✔ Appwrite Cloud connection verified successfully!');
        }).catch((err) => {
            console.warn('Appwrite ping status:', err.message);
        });
    }
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { ID, Query, Permission, Role };
