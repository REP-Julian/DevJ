import dotenv from 'dotenv';
dotenv.config();
import { initialPortfolioData } from '../src/data/portfolioData.js';

const endpoint = process.env.VITE_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const projectId = process.env.VITE_APPWRITE_PROJECT_ID || '6aa1516d001f3ded0bc0';
const apiKey = process.env.APPWRITE_API_KEY;
const fileId = 'portfolio_data';

async function migrateData() {
    console.log('Migrating portfolio data to Appwrite Storage...');
    const headers = {
        'X-Appwrite-Project': projectId,
        'X-Appwrite-Key': apiKey,
    };

    // 1. Delete existing file if any
    try {
        await fetch(`${endpoint}/storage/buckets/portfolio/files/${fileId}`, {
            method: 'DELETE',
            headers,
        });
        console.log('Removed previous cloud file if existed.');
    } catch (e) {
        // file didn't exist, proceed
    }

    // 2. Upload complete portfolio JSON with read("any") permission
    const payload = {
        ...initialPortfolioData,
        updatedAt: new Date().toISOString(),
        version: '1.0.0',
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const formData = new FormData();
    formData.append('fileId', fileId);
    formData.append('file', blob, 'portfolio-data.json');
    formData.append('permissions[]', 'read("any")');

    const res = await fetch(`${endpoint}/storage/buckets/portfolio/files`, {
        method: 'POST',
        headers,
        body: formData,
    });

    if (!res.ok) {
        throw new Error(`Upload failed: ${res.status} ${await res.text()}`);
    }

    console.log('✔ Successfully created "portfolio_data" in Appwrite Storage!');

    // 3. Verify public read
    const publicUrl = `${endpoint}/storage/buckets/portfolio/files/${fileId}/view?project=${projectId}`;
    const testFetch = await fetch(publicUrl);
    if (testFetch.ok) {
        const verified = await testFetch.json();
        console.log('✔ Verified public access: Successfully downloaded cloud portfolio state!');
        console.log('• Profile Name:        ', verified.profile.name);
        console.log('• Profile Tagline:     ', verified.profile.tagline);
        console.log('• Profile Description: ', verified.profile.description);
        console.log('• Hero Avatar 1:       ', verified.profile.avatarUrl);
        console.log('• Total Projects:      ', verified.projects.length);
        console.log('• Total Skills:        ', verified.skills.length);
        console.log('• Total Achievements:  ', verified.achievements.length);
        console.log('• Total Hobbies:       ', verified.hobbies.length);
    } else {
        console.error('❌ Public read verification failed:', testFetch.status);
    }
}

migrateData().catch(console.error);
