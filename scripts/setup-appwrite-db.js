import dotenv from 'dotenv';
dotenv.config();

const endpoint = process.env.VITE_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const projectId = process.env.VITE_APPWRITE_PROJECT_ID || '6aa1516d001f3ded0bc0';
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || 'portfolio';
const collectionId = process.env.VITE_APPWRITE_COLLECTION_PORTFOLIO || 'portfolio';
const messagesCollectionId = process.env.VITE_APPWRITE_COLLECTION_MESSAGES || 'messages';
const apiKey = process.env.APPWRITE_API_KEY;

const headers = {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': projectId,
    'X-Appwrite-Key': apiKey,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    console.log('\n======================================================');
    console.log('  DevJ Portfolio — Appwrite Cloud Database Setup');
    console.log('======================================================\n');
    console.log('• Appwrite Endpoint:', endpoint);
    console.log('• Project ID:       ', projectId);
    console.log('• Database ID:      ', databaseId);
    console.log('• Portfolio Col:    ', collectionId);
    console.log('• Messages Col:     ', messagesCollectionId);
    console.log('------------------------------------------------------\n');

    if (!apiKey) {
        console.error('❌ Error: APPWRITE_API_KEY is not defined in your .env file.');
        process.exit(1);
    }

    // 1. Verify Database exists
    console.log('1. Checking Appwrite Database "' + databaseId + '"...');
    const dbRes = await fetch(`${endpoint}/databases/${databaseId}`, { headers });
    if (dbRes.status === 404) {
        console.log('   Creating database "' + databaseId + '"...');
        const createDbRes = await fetch(`${endpoint}/databases`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ databaseId, name: 'Portfolio Database' }),
        });
        if (!createDbRes.ok) {
            const err = await createDbRes.json();
            throw new Error(`Failed to create database: ${err.message}`);
        }
        console.log('   ✔ Database created!');
    } else if (dbRes.ok) {
        console.log('   ✔ Database exists and is ready.');
    } else {
        const err = await dbRes.json();
        console.error('   ❌ Database check returned:', dbRes.status, err.message);
        checkScopeHelp(err);
        process.exit(1);
    }

    // 2. Setup Portfolio Collection
    console.log('\n2. Checking Collection "' + collectionId + '"...');
    const colRes = await fetch(`${endpoint}/databases/${databaseId}/collections/${collectionId}`, { headers });

    if (colRes.status === 404) {
        console.log('   Creating collection "' + collectionId + '"...');
        const createColRes = await fetch(`${endpoint}/databases/${databaseId}/collections`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                collectionId,
                name: 'Portfolio',
                permissions: [
                    'read("any")',
                    'create("users")',
                    'update("users")',
                    'delete("users")',
                    'create("any")',
                    'update("any")',
                ],
                documentSecurity: false,
            }),
        });

        if (!createColRes.ok) {
            const err = await createColRes.json();
            console.error('   ❌ Failed to create collection:', err.message);
            checkScopeHelp(err);
            process.exit(1);
        }
        console.log('   ✔ Collection "' + collectionId + '" created with public read permissions!');
    } else if (colRes.ok) {
        console.log('   ✔ Collection exists. Ensuring public read permissions...');
        await fetch(`${endpoint}/databases/${databaseId}/collections/${collectionId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
                name: 'Portfolio',
                permissions: [
                    'read("any")',
                    'create("users")',
                    'update("users")',
                    'delete("users")',
                    'create("any")',
                    'update("any")',
                ],
                documentSecurity: false,
            }),
        });
    } else {
        const err = await colRes.json();
        console.error('   ❌ Collection check error:', err.message);
        checkScopeHelp(err);
        process.exit(1);
    }

    // 3. Setup Attributes for Portfolio Collection
    console.log('\n3. Ensuring attributes for collection "' + collectionId + '"...');
    await ensureStringAttribute(databaseId, collectionId, 'content', 1000000, true);
    await ensureStringAttribute(databaseId, collectionId, 'updatedAt', 100, false);

    // 4. Initialize / Seed 'main' Document
    console.log('\n4. Checking main portfolio document in Appwrite...');
    await sleep(2000); // Wait for attributes to become active in Appwrite

    const docRes = await fetch(`${endpoint}/databases/${databaseId}/collections/${collectionId}/documents/main`, { headers });
    if (docRes.status === 404) {
        console.log('   Creating initial "main" document with real portfolio content...');
        const initialData = {
            profile: {
                name: 'Julian Agustino',
                tagline: 'Full-Stack Developer & AI Systems Integrator',
                description: 'Building resilient full-stack web applications with React, Node.js, and Appwrite—engineering clean API architectures, responsive interfaces, and production-grade LLM integrations.',
                avatarUrl: 'https://sgp.cloud.appwrite.io/v1/storage/buckets/portfolio/files/6aa15e9e001617de4a5f/view?project=' + projectId,
                avatarUrl2: 'https://sgp.cloud.appwrite.io/v1/storage/buckets/portfolio/files/6aa15eb6001e7c787293/view?project=' + projectId,
                avatarUrl3: 'https://sgp.cloud.appwrite.io/v1/storage/buckets/portfolio/files/6aa15e810016d47a13ee/view?project=' + projectId,
                email: 'agustino.julian@outlook.ph',
                githubUrl: 'https://github.com/REP-Julian',
                facebookUrl: 'https://facebook.com',
                instagramUrl: 'https://instagram.com',
                telegramUrl: 'https://t.me/username',
                whatsappUrl: 'https://wa.me/1234567890',
                resumeUrl: '',
            },
            skills: [],
            achievements: [],
            projects: [],
            hobbies: [],
        };

        const createDocRes = await fetch(`${endpoint}/databases/${databaseId}/collections/${collectionId}/documents`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                documentId: 'main',
                data: {
                    content: JSON.stringify(initialData),
                    updatedAt: new Date().toISOString(),
                },
                permissions: ['read("any")', 'write("any")'],
            }),
        });

        if (createDocRes.ok) {
            console.log('   ✔ Initial "main" document created successfully!');
        } else {
            const err = await createDocRes.json();
            console.warn('   Note on creating document:', err.message);
        }
    } else {
        console.log('   ✔ Document "main" already exists in Appwrite Cloud.');
    }

    // 5. Setup Messages Collection (Optional for contact forms)
    console.log('\n5. Setting up Messages collection for contact inquiries...');
    const msgRes = await fetch(`${endpoint}/databases/${databaseId}/collections/${messagesCollectionId}`, { headers });
    if (msgRes.status === 404) {
        const createMsgRes = await fetch(`${endpoint}/databases/${databaseId}/collections`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                collectionId: messagesCollectionId,
                name: 'Contact Messages',
                permissions: ['create("any")', 'read("users")', 'delete("users")'],
                documentSecurity: false,
            }),
        });
        if (createMsgRes.ok) {
            console.log('   ✔ Messages collection created!');
            await ensureStringAttribute(databaseId, messagesCollectionId, 'name', 255, true);
            await ensureStringAttribute(databaseId, messagesCollectionId, 'email', 255, true);
            await ensureStringAttribute(databaseId, messagesCollectionId, 'subject', 500, false);
            await ensureStringAttribute(databaseId, messagesCollectionId, 'message', 5000, true);
            await ensureStringAttribute(databaseId, messagesCollectionId, 'createdAt', 100, false);
        }
    } else {
        console.log('   ✔ Messages collection already configured.');
    }

    console.log('\n======================================================');
    console.log('  🎉 All Appwrite Database collections ready!');
    console.log('  Visitors on any phone or device can now view');
    console.log('  your live portfolio synced with Appwrite Cloud.');
    console.log('======================================================\n');
}

async function ensureStringAttribute(dbId, colId, key, size, required) {
    try {
        const res = await fetch(`${endpoint}/databases/${dbId}/collections/${colId}/attributes/string`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ key, size, required }),
        });
        if (res.ok) {
            console.log(`   ✔ Attribute "${key}" created.`);
        } else {
            const data = await res.json();
            if (data.code === 409) {
                console.log(`   ✔ Attribute "${key}" already exists.`);
            } else {
                console.warn(`   Attribute "${key}" status:`, data.message);
            }
        }
    } catch (e) {
        console.warn(`   Attribute "${key}" notice:`, e.message);
    }
}

function checkScopeHelp(err) {
    if (err && err.type === 'general_unauthorized_scope') {
        console.log('\n💡 [HOW TO FIX SCOPES IN APPWRITE CONSOLE]:');
        console.log('1. Go to https://cloud.appwrite.io -> Select project "6aa1516d001f3ded0bc0"');
        console.log('2. Go to Project Settings -> API Keys (or Overview -> API Keys)');
        console.log('3. Click your API Key and check the following scopes:');
        console.log('   - databases.read & databases.write');
        console.log('   - collections.read & collections.write');
        console.log('   - attributes.read & attributes.write');
        console.log('   - documents.read & documents.write');
        console.log('4. Click Save, and run: npm run setup:appwrite\n');
    }
}

main().catch((err) => {
    console.error('\n❌ Script execution failed:', err);
});
