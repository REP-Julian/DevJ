import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const endpoint = process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || 'devj_portfolio';
const bucketId = process.env.VITE_APPWRITE_BUCKET_ID || 'portfolio-assets';

if (!projectId || !apiKey) {
    console.error('\x1b[31m[Error] Please provide VITE_APPWRITE_PROJECT_ID and APPWRITE_API_KEY in your .env file.\x1b[0m');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const databases = new Databases(client);
const storage = new Storage(client);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureDatabase() {
    try {
        console.log(`Checking database "${databaseId}"...`);
        await databases.get(databaseId);
        console.log(`Database "${databaseId}" exists.`);
    } catch (e) {
        console.log(`Creating database "${databaseId}"...`);
        await databases.create(databaseId, 'DevJ Portfolio Database');
        console.log(`Database "${databaseId}" created.`);
    }
}

async function ensureCollection(collectionId, name, attributes, permissions) {
    try {
        await databases.getCollection(databaseId, collectionId);
        console.log(`✔ Collection "${collectionId}" (${name}) already exists.`);
    } catch {
        console.log(`Creating collection "${collectionId}" (${name})...`);
        await databases.createCollection(
            databaseId,
            collectionId,
            name,
            permissions || [Permission.read(Role.any()), Permission.write(Role.any())]
        );
        console.log(`Collection "${collectionId}" created. Creating attributes...`);

        for (const attr of attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(
                        databaseId,
                        collectionId,
                        attr.key,
                        attr.size || 255,
                        attr.required ?? true,
                        attr.default
                    );
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(
                        databaseId,
                        collectionId,
                        attr.key,
                        attr.required ?? true,
                        attr.min,
                        attr.max,
                        attr.default
                    );
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(
                        databaseId,
                        collectionId,
                        attr.key,
                        attr.required ?? true,
                        attr.default
                    );
                }
                console.log(`  + Attribute "${attr.key}" created.`);
                await sleep(500);
            } catch (err) {
                console.warn(`  ! Note for attribute "${attr.key}":`, err.message);
            }
        }
        console.log(`Waiting for attributes in "${collectionId}" to initialize...`);
        await sleep(2500);
    }
}

async function ensureBucket() {
    try {
        await storage.getBucket(bucketId);
        console.log(`✔ Storage bucket "${bucketId}" already exists.`);
    } catch {
        console.log(`Creating storage bucket "${bucketId}"...`);
        await storage.createBucket(
            bucketId,
            'Portfolio Visual Assets',
            [Permission.read(Role.any()), Permission.write(Role.any())],
            false,
            true,
            10485760, // 10MB
            ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']
        );
        console.log(`✔ Storage bucket "${bucketId}" created with public read permissions.`);
    }
}

async function seedData() {
    console.log('\nSeeding initial portfolio documents...');

    // 1. Profile
    try {
        const profileDocs = await databases.listDocuments(databaseId, 'profiles');
        if (profileDocs.total === 0) {
            console.log('Seeding profile...');
            await databases.createDocument(databaseId, 'profiles', ID.unique(), {
                name: 'Julian Agustino',
                tagline: 'Artificial Intelligence Enthusiast, Vibe Developer and Creative Developer',
                description: 'I love turning ideas into interactive experiences and exploring the possibilities of artificial intelligence through creative development.',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                email: 'contact@devj.com',
                githubUrl: 'https://github.com',
                facebookUrl: 'https://facebook.com',
                instagramUrl: 'https://instagram.com',
                telegramUrl: 'https://t.me/username',
                whatsappUrl: 'https://wa.me/1234567890',
            });
            console.log('✔ Profile seeded.');
        }
    } catch (e) {
        console.warn('Profile seeding notice:', e.message);
    }

    // 2. Skills
    try {
        const skillsDocs = await databases.listDocuments(databaseId, 'skills');
        if (skillsDocs.total === 0) {
            console.log('Seeding skills...');
            const skills = [
                { category: 'Specialized Frontier AI', name: 'Google Gemini', description: '', proficiency: 98, iconName: 'Gemini', order: 1 },
                { category: 'Specialized Frontier AI', name: 'ChatGPT', description: '', proficiency: 98, iconName: 'ChatGPT', order: 2 },
                { category: 'Specialized Frontier AI', name: 'Claude AI', description: '', proficiency: 97, iconName: 'Claude', order: 3 },
                { category: 'Specialized Frontier AI', name: 'Deepseek AI', description: '', proficiency: 96, iconName: 'Deepseek', order: 4 },
                { category: 'Programming Languages', name: 'JavaScript', description: '', proficiency: 95, iconName: 'JavaScript', order: 5 },
                { category: 'Programming Languages', name: 'Python', description: '', proficiency: 93, iconName: 'Python', order: 6 },
                { category: 'Programming Languages', name: 'Java', description: '', proficiency: 88, iconName: 'Java', order: 7 },
                { category: 'Programming Languages', name: 'HTML5', description: '', proficiency: 99, iconName: 'HTML', order: 8 },
                { category: 'Programming Languages', name: 'CSS3', description: '', proficiency: 96, iconName: 'CSS', order: 9 },
                { category: 'Programming Languages', name: 'TypeScript', description: '', proficiency: 90, iconName: 'TypeScript', order: 10 },
                { category: 'Programming Languages', name: 'React', description: '', proficiency: 95, iconName: 'React', order: 11 },
                { category: 'Programming Languages', name: 'Node.js', description: '', proficiency: 91, iconName: 'Node', order: 12 },
            ];
            for (const s of skills) {
                await databases.createDocument(databaseId, 'skills', ID.unique(), s);
                await sleep(150);
            }
            console.log('✔ Skills seeded.');
        }
    } catch (e) {
        console.warn('Skills seeding notice:', e.message);
    }

    // 3. Achievements
    try {
        const achDocs = await databases.listDocuments(databaseId, 'achievements');
        if (achDocs.total === 0) {
            console.log('Seeding achievements...');
            const achievements = [
                {
                    title: 'Global AI Innovation Hackathon Winner',
                    category: 'Hackathon Award',
                    date: '2025',
                    description: 'Built a real-time multimodal autonomous assistant agent integrating computer vision and dynamic voice modulation.',
                    imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80',
                    order: 1,
                },
                {
                    title: 'Creative Frontend Excellence Award',
                    category: 'Design Recognition',
                    date: '2024',
                    description: 'Awarded top honors for designing immersive web interfaces balancing high frame-rate rendering and minimal accessibility compliance.',
                    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
                    order: 2,
                },
                {
                    title: 'Full Stack Systems Certification',
                    category: 'Industry Certification',
                    date: '2023',
                    description: 'Validated mastery of distributed microservices, secure cryptographic tokens, and scalable cloud databases.',
                    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
                    order: 3,
                },
            ];
            for (const a of achievements) {
                await databases.createDocument(databaseId, 'achievements', ID.unique(), a);
                await sleep(150);
            }
            console.log('✔ Achievements seeded.');
        }
    } catch (e) {
        console.warn('Achievements seeding notice:', e.message);
    }

    // 4. Projects
    try {
        const projDocs = await databases.listDocuments(databaseId, 'projects');
        if (projDocs.total === 0) {
            console.log('Seeding projects...');
            const projects = [
                {
                    title: 'NeuroCanvas AI',
                    category: 'Generative AI Platform',
                    description: 'Interactive generative canvas tool transforming contextual natural language sketches into production-ready SVG interfaces and layout tokens.',
                    technologies: 'React, Node.js, TailwindCSS, OpenAI API, Appwrite',
                    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                    githubUrl: 'https://github.com',
                    liveUrl: 'https://example.com',
                    order: 1,
                },
                {
                    title: 'Aura CMS & Dynamic Engine',
                    category: 'Creative Full-Stack',
                    description: 'A blazing-fast content management suite powering reactive portfolios with native components and zero-rebuild asset updates.',
                    technologies: 'Appwrite Cloud, React, Vite, TailwindCSS',
                    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
                    githubUrl: 'https://github.com',
                    liveUrl: 'https://example.com',
                    order: 2,
                },
                {
                    title: 'VibeMatrix Workspace',
                    category: 'Interactive UI',
                    description: 'Browser-based developer dashboard with contextual workspaces, clean themes, and productivity tooling.',
                    technologies: 'React, Appwrite BaaS, TailwindCSS, Web Audio API',
                    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
                    githubUrl: 'https://github.com',
                    liveUrl: 'https://example.com',
                    order: 3,
                },
            ];
            for (const p of projects) {
                await databases.createDocument(databaseId, 'projects', ID.unique(), p);
                await sleep(150);
            }
            console.log('✔ Projects seeded.');
        }
    } catch (e) {
        console.warn('Projects seeding notice:', e.message);
    }

    // 5. Hobbies
    try {
        const hobbyDocs = await databases.listDocuments(databaseId, 'hobbies');
        if (hobbyDocs.total === 0) {
            console.log('Seeding hobbies...');
            const hobbies = [
                {
                    name: 'Creative Photography',
                    description: 'Exploring urban architectural minimalism, dramatic golden-hour shadows, and street composition.',
                    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
                    iconName: 'Camera',
                    order: 1,
                },
                {
                    name: 'Synthesizers & Lo-Fi Beats',
                    description: 'Crafting warm analog synth textures and ambient coding soundtracks using digital audio workstations.',
                    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
                    iconName: 'Music',
                    order: 2,
                },
                {
                    name: 'Exploring Frontier AI Models',
                    description: 'Experimenting with emergent capabilities in open-weight models and creative multi-agent coordination.',
                    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
                    iconName: 'Sparkles',
                    order: 3,
                },
            ];
            for (const h of hobbies) {
                await databases.createDocument(databaseId, 'hobbies', ID.unique(), h);
                await sleep(150);
            }
            console.log('✔ Hobbies seeded.');
        }
    } catch (e) {
        console.warn('Hobbies seeding notice:', e.message);
    }
}

async function run() {
    console.log('\x1b[36m================================================');
    console.log('  DevJ Portfolio — Appwrite Auto Setup & Seeder');
    console.log('================================================\x1b[0m\n');

    await ensureDatabase();

    // 1. Profiles collection
    await ensureCollection(
        'profiles',
        'Profiles',
        [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'tagline', type: 'string', size: 500, required: true },
            { key: 'description', type: 'string', size: 2000, required: true },
            { key: 'avatarUrl', type: 'string', size: 1000, required: true },
            { key: 'email', type: 'string', size: 255, required: true },
            { key: 'githubUrl', type: 'string', size: 500, required: true },
            { key: 'facebookUrl', type: 'string', size: 500, required: false },
            { key: 'instagramUrl', type: 'string', size: 500, required: false },
            { key: 'telegramUrl', type: 'string', size: 500, required: false },
            { key: 'whatsappUrl', type: 'string', size: 500, required: false },
        ]
    );

    // 2. Skills collection
    await ensureCollection(
        'skills',
        'Skills',
        [
            { key: 'category', type: 'string', size: 255, required: true },
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 1000, required: false },
            { key: 'proficiency', type: 'integer', min: 0, max: 100, required: true, default: 90 },
            { key: 'iconName', type: 'string', size: 100, required: true, default: 'Code' },
            { key: 'order', type: 'integer', required: true, default: 0 },
        ]
    );

    // 3. Achievements collection
    await ensureCollection(
        'achievements',
        'Achievements',
        [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'category', type: 'string', size: 255, required: true },
            { key: 'date', type: 'string', size: 50, required: true },
            { key: 'description', type: 'string', size: 1000, required: true },
            { key: 'imageUrl', type: 'string', size: 1000, required: true },
            { key: 'order', type: 'integer', required: true, default: 0 },
        ]
    );

    // 4. Projects collection
    await ensureCollection(
        'projects',
        'Projects',
        [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'category', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 2000, required: true },
            { key: 'technologies', type: 'string', size: 500, required: true },
            { key: 'imageUrl', type: 'string', size: 1000, required: true },
            { key: 'githubUrl', type: 'string', size: 500, required: true },
            { key: 'liveUrl', type: 'string', size: 500, required: true },
            { key: 'order', type: 'integer', required: true, default: 0 },
        ]
    );

    // 5. Hobbies collection
    await ensureCollection(
        'hobbies',
        'Hobbies',
        [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 1000, required: true },
            { key: 'imageUrl', type: 'string', size: 1000, required: true },
            { key: 'iconName', type: 'string', size: 100, required: true, default: 'Heart' },
            { key: 'order', type: 'integer', required: true, default: 0 },
        ]
    );

    // 6. Messages collection
    await ensureCollection(
        'messages',
        'Messages',
        [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'email', type: 'string', size: 255, required: true },
            { key: 'message', type: 'string', size: 5000, required: true },
            { key: 'read', type: 'boolean', required: true, default: false },
            { key: 'createdAt', type: 'string', size: 100, required: true },
        ],
        [Permission.read(Role.any()), Permission.write(Role.any())]
    );

    // Storage bucket
    await ensureBucket();

    // Seed data
    await seedData();

    console.log('\n\x1b[32m✔ Appwrite setup completed successfully!\x1b[0m');
    console.log('Your portfolio is connected to Appwrite and ready to use.\n');
}

run().catch((err) => {
    console.error('\x1b[31m[Appwrite Setup Failed]:\x1b[0m', err);
    process.exit(1);
});
