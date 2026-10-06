import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding DevJ database...');

    await prisma.message.deleteMany();
    await prisma.hobby.deleteMany();
    await prisma.project.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.admin.deleteMany();

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.admin.create({
        data: {
            email: 'admin@devj.com',
            password: hashedPassword,
        },
    });

    await prisma.profile.create({
        data: {
            name: 'Julian Agustino',
            tagline: 'Full-Stack Developer & AI Systems Integrator',
            description: 'Building full-stack web applications with React, Node.js, and Appwrite, integrated with LLM endpoints and custom REST APIs.',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            email: 'contact@devj.com',
            githubUrl: 'https://github.com/REP-Julian',
            linkedinUrl: 'https://linkedin.com',
            twitterUrl: 'https://twitter.com',
        },
    });

    const skills = [
        // AI Engineering & Integration
        { category: 'AI Engineering & Integration', name: 'Google Gen AI SDK', description: 'Multimodal Gemini models, system instructions, and structured schema outputs.', proficiency: 95, iconName: 'Gemini', order: 1 },
        { category: 'AI Engineering & Integration', name: 'OpenAI API', description: 'GPT function calling, assistant agents, and embedding generation.', proficiency: 93, iconName: 'OpenAI', order: 2 },
        { category: 'AI Engineering & Integration', name: 'LangChain', description: 'Chains, retrieval augmented generation (RAG), and agentic workflows.', proficiency: 90, iconName: 'LangChain', order: 3 },
        { category: 'AI Engineering & Integration', name: 'Ollama', description: 'Local LLM orchestration, quantized GGUF inference, and offline APIs.', proficiency: 92, iconName: 'Ollama', order: 4 },
        { category: 'AI Engineering & Integration', name: 'Hugging Face', description: 'Transformers, open-source model pipelines, and tokenizer integration.', proficiency: 88, iconName: 'HuggingFace', order: 5 },
        { category: 'AI Engineering & Integration', name: 'Pinecone & Vector DBs', description: 'High-dimensional vector indexing, similarity search, and RAG architectures.', proficiency: 89, iconName: 'Pinecone', order: 6 },

        // Languages & Core Stack
        { category: 'Programming Languages', name: 'React', description: 'Modern component architecture, custom hooks, and state management.', proficiency: 96, iconName: 'React', order: 7 },
        { category: 'Programming Languages', name: 'Node.js', description: 'RESTful API engineering, SSE streaming proxies, and middleware architecture.', proficiency: 94, iconName: 'Node', order: 8 },
        { category: 'Programming Languages', name: 'TypeScript', description: 'Static type verification, schema contracts, and reliable system architecture.', proficiency: 91, iconName: 'TypeScript', order: 9 },
        { category: 'Programming Languages', name: 'Python', description: 'Automation scripts, data processing, model benchmarking, and backend endpoints.', proficiency: 93, iconName: 'Python', order: 10 },
        { category: 'Programming Languages', name: 'Java', description: 'Object-oriented patterns, foundational algorithms, and systems engineering.', proficiency: 88, iconName: 'Java', order: 11 },
        { category: 'Programming Languages', name: 'Appwrite Cloud', description: 'Managed authentication, database collections, storage buckets, and serverless functions.', proficiency: 93, iconName: 'Appwrite', order: 12 },
        { category: 'Programming Languages', name: 'SQL & Database Design', description: 'Relational schema modeling, normalization, indexing, and SQLite/MySQL integration.', proficiency: 92, iconName: 'SQLite', order: 13 },
        { category: 'Programming Languages', name: 'TailwindCSS', description: 'Utility-first design systems, responsive typography, and production CSS tokens.', proficiency: 95, iconName: 'TailwindCSS', order: 14 },
    ];
    for (const s of skills) await prisma.skill.create({ data: s });

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
            title: 'Full Stack Systems & Python Certification',
            category: 'Foundational Milestone',
            date: '2023',
            description: 'Validated mastery of distributed microservices, secure cryptographic tokens, and scalable cloud databases. Backed by open-source production code and architectural breakdowns.',
            imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
            order: 3,
        },
    ];
    for (const a of achievements) await prisma.achievement.create({ data: a });

    const projects = [
        {
            title: 'PawTrack Management System 2.0',
            category: 'Full-Stack Systems & SQL Database',
            description: 'Animal rescue operational platform solving paper record loss. Engineered a normalized relational schema for rescue intake, veterinary medical logs, and adoption candidate matching with role-based staff authentication.',
            technologies: 'Node.js, Express, SQLite, React, TailwindCSS, JWT Auth',
            imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com/REP-Julian',
            liveUrl: 'https://example.com',
            order: 1,
        },
        {
            title: 'DevJ AI Studio & Multi-Provider CMS',
            category: 'Distributed AI Architecture',
            description: 'Production Appwrite back-office engine orchestrating multi-provider LLMs (Gemini, Groq, Mistral, OpenRouter) with Server-Sent Events (SSE) streaming, automated fallback routing, token budgeting, and zero-rebuild live portfolio updates.',
            technologies: 'React, Node.js, Express, Appwrite Cloud, SSE Streaming, Google Gen AI SDK',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com/REP-Julian/DevJ',
            liveUrl: 'https://example.com',
            order: 2,
        },
        {
            title: 'VibeMatrix Developer Workspace',
            category: 'Interactive Web Tooling',
            description: 'Modular developer dashboard with persistent workspace sessions, custom RESTful endpoints, and reactive state inspection designed for rapid prototyping.',
            technologies: 'React, TailwindCSS, Web Audio API, Vite, Express',
            imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com/REP-Julian',
            liveUrl: 'https://example.com',
            order: 3,
        },
    ];
    for (const p of projects) await prisma.project.create({ data: p });

    const hobbies = [
        {
            name: 'Urban & Architectural Photography',
            description: 'Exploring urban architectural minimalism, dramatic golden-hour shadows, and street composition.',
            imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
            iconName: 'Camera',
            order: 1,
        },
        {
            name: 'DAW Production & Lo-Fi Beats',
            description: 'Crafting warm analog synth textures and ambient coding soundtracks using digital audio workstations and hardware controllers.',
            imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
            iconName: 'Music',
            order: 2,
        },
        {
            name: 'Local LLM Benchmarking & Edge Inference',
            description: 'Benchmarking quantized GGUF models on local terminal workstations with Ollama to evaluate latency, memory overhead, and edge inference efficiency.',
            imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
            iconName: 'Terminal',
            order: 3,
        },
    ];
    for (const h of hobbies) await prisma.hobby.create({ data: h });

    console.log('Database seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });