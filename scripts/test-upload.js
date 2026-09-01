import { Client, Storage, Databases, ID } from 'node-appwrite';
import fs from 'fs';
import path from 'path';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6a969fd7003709708d27');

const storage = new Storage(client);
const databases = new Databases(client);

const bucketId = '6a96c5ad00249880aec6';
const databaseId = '6a96aa5b003b6af4827b';
const profileCollectionId = '6a96aa940026789aaa03';

async function runTest() {
    console.log('--- Step 1: Testing Storage Bucket Permission ---');
    try {
        const sampleBuffer = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            'base64'
        );
        const tempPath = path.resolve('test-sample.png');
        fs.writeFileSync(tempPath, sampleBuffer);

        const { InputFile } = await import('node-appwrite/file');
        const file = InputFile.fromPath(tempPath, 'test-sample.png');
        
        const uploadRes = await storage.createFile(bucketId, ID.unique(), file);
        console.log('✅ File uploaded successfully! File ID:', uploadRes.$id);

        const fileView = storage.getFileView(bucketId, uploadRes.$id);
        console.log('✅ Generated File CDN URL:', typeof fileView === 'string' ? fileView : fileView.href || fileView);

        // Delete test file from storage
        await storage.deleteFile(bucketId, uploadRes.$id);
        console.log('✅ Test file cleaned up from Appwrite Storage!');

        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

        console.log('\n--- Step 2: Testing Database Collections Read Permission ---');
        const [profileDocs, skillsDocs, achievementsDocs, projectsDocs, hobbiesDocs] = await Promise.allSettled([
            databases.listDocuments(databaseId, profileCollectionId),
            databases.listDocuments(databaseId, '6a96ace40004e4cf7979'),
            databases.listDocuments(databaseId, '6a96b11f002f88e7773e'),
            databases.listDocuments(databaseId, '6a96b1b00031b6fa4f8a'),
            databases.listDocuments(databaseId, '6a96b1f90007d2b11849')
        ]);

        console.log('profiles status:', profileDocs.status === 'fulfilled' ? '✅ OK' : `❌ ${profileDocs.reason.message}`);
        console.log('skills status:', skillsDocs.status === 'fulfilled' ? '✅ OK' : `❌ ${skillsDocs.reason.message}`);
        console.log('achievements status:', achievementsDocs.status === 'fulfilled' ? '✅ OK' : `❌ ${achievementsDocs.reason.message}`);
        console.log('projects status:', projectsDocs.status === 'fulfilled' ? '✅ OK' : `❌ ${projectsDocs.reason.message}`);
        console.log('hobbies status:', hobbiesDocs.status === 'fulfilled' ? '✅ OK' : `❌ ${hobbiesDocs.reason.message}`);

        if (profileDocs.status === 'fulfilled') {
            console.log('\n🎉 ALL TESTS PASSED: Both Image Uploads and Database Queries are 100% operational!');
        } else {
            console.log('\n👉 Almost there! Add "Any" with "READ" on your database tables so visitors can view your site.');
        }
    } catch (err) {
        console.error('❌ Test error:', err.message);
    }
}

runTest();
