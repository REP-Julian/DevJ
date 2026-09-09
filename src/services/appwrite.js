import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

// Appwrite Cloud Configuration
export const APPWRITE_CONFIG = {
    endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1',
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || '6aa1516d001f3ded0bc0',
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || 'portfolio',
    bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID || 'portfolio',
    collections: {
        portfolio: import.meta.env.VITE_APPWRITE_COLLECTION_PORTFOLIO || 'portfolio',
        messages: import.meta.env.VITE_APPWRITE_COLLECTION_MESSAGES || 'messages',
    }
};

// Initialize Appwrite Client
const client = new Client();
client
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId);

// Initialize Services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client, ID, Query };
export default client;
