import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, Code2, Sparkles, X, ChevronRight, CheckCircle2, Layers, Cpu, Database } from 'lucide-react';

export const ProjectsSection = ({ projects = [] }) => {
    const defaultProjects = [
        {
            id: '1',
            title: 'PawTrack Management System 2.0',
            category: 'Full-Stack Systems & SQL Database',
            description: 'Animal rescue operational platform solving paper record loss. Engineered a normalized relational schema for rescue intake, veterinary medical logs, and adoption candidate matching with role-based staff authentication.',
            problem: 'Animal rescue shelters frequently suffer from fragmented paper records, lost medical history, and untracked pet intake workflows.',
            solution: 'Engineered a centralized management system with relational SQLite database modeling, role-based JWT authentication, medical auditing logs, and structured adoption pipelines.',
            contribution: 'Architected the normalized relational schema, built Express REST endpoints, and created a responsive React dashboard with verified audit tracking.',
            results: 'Eliminated redundant paperwork, provided instantaneous pet record lookups, and secured staff operations with cryptographic authentication.',
            technologies: 'Node.js, Express, SQLite, React, TailwindCSS, JWT Auth',
            imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com/REP-Julian',
            liveUrl: '',
            order: 1,
        },
        {
            id: '2',
            title: 'DevJ AI Studio & Multi-Provider CMS',
            category: 'Distributed AI Architecture',
            description: 'Production Appwrite back-office engine orchestrating multi-provider LLMs (Gemini, Groq, Mistral, Anymodel) with Server-Sent Events (SSE) streaming, automated fallback routing, token budgeting, and zero-rebuild live portfolio updates.',
            problem: 'Third-party AI API outages, strict rate limits, and slow CMS rebuilds cause downtime and poor administrative flexibility.',
            solution: 'Architected a resilient multi-provider AI cascade router with automated failover, Server-Sent Events (SSE) real-time streaming, and Appwrite dual-cloud persistent synchronization.',
            contribution: 'Designed the streaming proxy pipeline, built the multi-provider cascade algorithm, and implemented zero-downtime content synchronization.',
            results: 'Maintained 100% assistant uptime through automated failovers and reduced content deployment cycles to zero rebuild delay.',
            technologies: 'React, Node.js, Express, Appwrite Cloud, SSE Streaming, Google Gen AI SDK',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com/REP-Julian/DevJ',
            liveUrl: '',
            order: 2,
        },
        {
            id: '3',
            title: 'VibeMatrix Developer Workspace',
            category: 'Interactive Web Tooling',
            description: 'Modular developer dashboard with persistent workspace sessions, custom RESTful endpoints, and reactive state inspection designed for rapid prototyping.',
            problem: 'Developers experience constant mental friction and context-switching across disjointed terminal windows and disparate test tools.',
            solution: 'Built an integrated client-side developer workspace featuring persistent state inspection, quick-test endpoint runners, and ambient audio feedback.',
            contribution: 'Engineered reactive state stores, responsive workspace components, and Web Audio API synthesizer modules with zero external bloat.',
            results: 'Delivered sub-100ms UI interaction latency and persistent session continuity across browser reloads.',
            technologies: 'React, TailwindCSS, Web Audio API, Vite, Express',
            imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com/REP-Julian',
            liveUrl: '',
            order: 3,
        },
    ];

    const rawList = projects && projects.length > 0 ? projects : defaultProjects;

    // Normalize projects with problem/solution/contribution/results fallbacks
    const items = rawList.map((item, idx) => {
        const fallback = defaultProjects[idx % defaultProjects.length];
        return {
            ...fallback,
            ...item,
            problem: item.problem || fallback.problem,
            solution: item.solution || fallback.solution,
            contribution: item.contribution || fallback.contribution,
            results: item.results || fallback.results,
        };
    });

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeModalProject, setActiveModalProject] = useState(null);

    // Extract unique categories for filter tabs
    const categories = ['All', ...new Set(items.map((p) => p.category || 'General'))];

    const filteredProjects = selectedCategory === 'All'
        ? items
        : items.filter((p) => p.category === selectedCategory);

    // Modal keyboard accessibility: Escape key to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setActiveModalProject(null);
            }
        };
        if (activeModalProject) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeModalProject]);

    return (
        <section id="projects" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-devyellow-100 border border-devyellow-200 text-devorange-600 text-xs font-extrabold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-devorange-500" />
                        <span>Engineering Portfolio</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-charcoal-900 tracking-tight">
                        Featured Systems & Case Studies
                    </h2>
                    <p className="text-sm sm:text-base text-charcoal-500 font-medium max-w-2xl mx-auto">
                        Real-world software engineering projects solving concrete operational challenges—built with normalized databases, cryptographic authentication, and resilient cloud architectures.
                    </p>
                </div>

                {/* Category Filter Tabs */}
                {categories.length > 2 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-charcoal-900 text-devyellow-400 shadow-sm'
                                        : 'bg-gray-100 hover:bg-gray-200 text-charcoal-600'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Responsive Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, idx) => {
                        const techPills = typeof project.technologies === 'string'
                            ? project.technologies.split(',').map((t) => t.trim())
                            : Array.isArray(project.technologies)
                            ? project.technologies
                            : [];

                        return (
                            <article
                                key={project.id || idx}
                                className="flex flex-col bg-white rounded-2xl border border-gray-200/90 shadow-warm-sm hover:shadow-warm-md hover:border-devorange-300 transition-all duration-300 overflow-hidden group"
                            >
                                {/* Project Screenshot Header */}
                                <div className="relative aspect-[16/10] overflow-hidden bg-charcoal-950">
                                    <img
                                        src={project.imageUrl || defaultProjects[idx % defaultProjects.length]?.imageUrl}
                                        alt={`${project.title} screenshot`}
                                        loading="lazy"
                                        width="600"
                                        height="375"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                                        }}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent" />
                                    <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-charcoal-900/90 backdrop-blur-md border border-charcoal-700 text-devyellow-400 text-[11px] font-black uppercase tracking-wider">
                                        {project.category}
                                    </span>
                                </div>

                                {/* Content Body */}
                                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-black text-charcoal-900 group-hover:text-devorange-600 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed line-clamp-3">
                                            {project.description}
                                        </p>

                                        {/* Structured Engineering Highlights */}
                                        <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
                                            <div>
                                                <span className="font-extrabold text-charcoal-800">Problem: </span>
                                                <span className="text-charcoal-500">{project.problem}</span>
                                            </div>
                                            <div>
                                                <span className="font-extrabold text-charcoal-800">Contribution: </span>
                                                <span className="text-charcoal-500">{project.contribution}</span>
                                            </div>
                                        </div>

                                        {/* Tech Stack Pills */}
                                        <div className="flex flex-wrap gap-1.5 pt-2">
                                            {techPills.slice(0, 5).map((tech, tIdx) => (
                                                <span
                                                    key={tIdx}
                                                    className="px-2 py-0.5 rounded-md bg-devyellow-100/60 border border-devyellow-200 text-charcoal-800 text-[11px] font-bold"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {techPills.length > 5 && (
                                                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-charcoal-500 text-[11px] font-medium">
                                                    +{techPills.length - 5}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Footers */}
                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setActiveModalProject(project)}
                                            className="inline-flex items-center gap-1.5 text-xs font-black text-charcoal-900 hover:text-devorange-600 transition-colors"
                                        >
                                            <span>Full Case Study</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>

                                        <div className="flex items-center gap-2">
                                            {project.githubUrl && project.githubUrl !== '#' && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    aria-label={`View source code for ${project.title}`}
                                                    className="p-2 rounded-lg bg-gray-100 hover:bg-charcoal-900 text-charcoal-700 hover:text-devyellow-400 transition-all"
                                                    title="View Source Code"
                                                >
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            )}
                                            {project.liveUrl && project.liveUrl !== '#' && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    aria-label={`View live demo for ${project.title}`}
                                                    className="p-2 rounded-lg bg-gray-100 hover:bg-devorange-600 text-charcoal-700 hover:text-white transition-all"
                                                    title="View Live Demo"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>

            {/* Expandable Case Study Modal */}
            {activeModalProject && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal-950/85 backdrop-blur-sm"
                    onClick={() => setActiveModalProject(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="case-study-title"
                >
                    <div
                        className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-y-auto flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
                            <div className="flex items-center gap-2 min-w-0 pr-3">
                                <span className="px-2.5 py-0.5 rounded-full bg-devyellow-100 text-devorange-600 text-xs font-black uppercase tracking-wider shrink-0">
                                    {activeModalProject.category}
                                </span>
                                <h3 id="case-study-title" className="text-base sm:text-lg font-black text-charcoal-900 truncate">
                                    {activeModalProject.title}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveModalProject(null)}
                                aria-label="Close case study"
                                className="p-2 rounded-full hover:bg-gray-100 text-charcoal-500 hover:text-charcoal-900 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 sm:p-8 space-y-6">
                            {/* Project Visual */}
                            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-charcoal-950 relative">
                                <img
                                    src={activeModalProject.imageUrl}
                                    alt={activeModalProject.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Deep Architectural Breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                                    <div className="flex items-center gap-2 text-xs font-black text-rose-600 uppercase tracking-wider">
                                        <Layers className="w-4 h-4" /> Operational Problem
                                    </div>
                                    <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                                        {activeModalProject.problem}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                                    <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-wider">
                                        <Cpu className="w-4 h-4" /> Architectural Solution
                                    </div>
                                    <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                                        {activeModalProject.solution}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                                    <div className="flex items-center gap-2 text-xs font-black text-devorange-600 uppercase tracking-wider">
                                        <Database className="w-4 h-4" /> Individual Contribution
                                    </div>
                                    <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                                        {activeModalProject.contribution}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                                    <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-wider">
                                        <CheckCircle2 className="w-4 h-4" /> Verified Engineering Results
                                    </div>
                                    <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                                        {activeModalProject.results}
                                    </p>
                                </div>
                            </div>

                            {/* Technologies Used */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-black uppercase tracking-wider text-charcoal-500">
                                    Technology Architecture & Libraries
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {(typeof activeModalProject.technologies === 'string'
                                        ? activeModalProject.technologies.split(',')
                                        : activeModalProject.technologies || []
                                    ).map((tech, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 rounded-lg bg-devyellow-100/70 border border-devyellow-300 text-charcoal-900 text-xs font-bold"
                                        >
                                            {tech.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* External Links */}
                            <div className="pt-4 border-t border-gray-100 flex items-center gap-4">
                                {activeModalProject.githubUrl && activeModalProject.githubUrl !== '#' && (
                                    <a
                                        href={activeModalProject.githubUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-5 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-devyellow-400 text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                                    >
                                        <Github className="w-4 h-4" /> View GitHub Repository
                                    </a>
                                )}
                                {activeModalProject.liveUrl && activeModalProject.liveUrl !== '#' && (
                                    <a
                                        href={activeModalProject.liveUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-5 py-2.5 rounded-xl bg-devorange-600 hover:bg-devorange-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                                    >
                                        <ExternalLink className="w-4 h-4" /> Open Live Application
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProjectsSection;