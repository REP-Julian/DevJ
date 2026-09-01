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
            tagline: 'Artificial Intelligence Enthusiast, Vibe Developer and Creative Developer',
            description: 'I love turning ideas into interactive experiences and exploring the possibilities of artificial intelligence through creative development.',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            email: 'contact@devj.com',
            githubUrl: 'https://github.com',
            linkedinUrl: 'https://linkedin.com',
            twitterUrl: 'https://twitter.com',
        },
    });

    const skills = [
        { category: 'Artificial Intelligence', name: 'Generative AI & LLMs', description: 'Agentic workflows, prompt chaining, model fine-tuning & RAG architectures.', proficiency: 95, iconName: 'Brain', order: 1 },
        { category: 'Artificial Intelligence', name: 'Machine Learning', description: 'Predictive modeling, data classification, and automated intelligent pipelines.', proficiency: 88, iconName: 'Cpu', order: 2 },
        { category: 'Artificial Intelligence', name: 'Prompt Engineering', description: 'Crafting precise multi-modal contextual prompts and reasoning heuristics.', proficiency: 96, iconName: 'Sparkles', order: 3 },
        { category: 'Development', name: 'Frontend Architecture', description: 'Modern reactive component design, accessible 3D graphics, and lightning-fast UIs.', proficiency: 94, iconName: 'Layout', order: 4 },
        { category: 'Development', name: 'Backend & API Engineering', description: 'Robust RESTful API design, database schema modeling, and secure JWT auth.', proficiency: 90, iconName: 'Server', order: 5 },
        { category: 'Development', name: 'Creative Web Interaction', description: 'Physics-based animations, spatial depth rendering, and tactile UI patterns.', proficiency: 92, iconName: 'Layers', order: 6 },
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
            description: 'Awarded top honors for designing immersive 3D web interfaces balancing high frame-rate rendering and minimal accessibility compliance.',
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
    for (const a of achievements) await prisma.achievement.create({ data: a });

    const projects = [
        {
            title: 'NeuroCanvas AI',
            category: 'Generative AI Platform',
            description: 'Interactive generative canvas tool transforming contextual natural language sketches into production-ready SVG interfaces and layout tokens.',
            technologies: 'React, Node.js, TailwindCSS, OpenAI API, SQLite',
            imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com',
            liveUrl: 'https://example.com',
            order: 1,
        },
        {
            title: 'Aura CMS & Dynamic Engine',
            category: 'Creative Full-Stack',
            description: 'A blazing-fast content management suite powering reactive portfolios with native 3D spatial cards and zero-rebuild asset updates.',
            technologies: 'Node.js, Express, Prisma ORM, Vite, Vanilla 3D CSS',
            imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com',
            liveUrl: 'https://example.com',
            order: 2,
        },
        {
            title: 'VibeMatrix 3D Workspace',
            category: 'Spatial UI / WebGL',
            description: 'Browser-based developer dashboard with contextual multi-perspective workspaces and dynamic warm-lighting physics.',
            technologies: 'React, TailwindCSS, Web Audio API, Express',
            imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com',
            liveUrl: 'https://example.com',
            order: 3,
        },
    ];
    for (const p of projects) await prisma.project.create({ data: p });

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