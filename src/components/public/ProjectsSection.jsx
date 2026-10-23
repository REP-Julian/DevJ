import React, { useState, useEffect } from 'react';
import { Github, Sparkles, X, ArrowUpRight } from 'lucide-react';

export const ProjectsSection = ({ projects = [] }) => {
    const defaultProjects = [
        {
            id: '1',
            title: 'PawTrack Management System',
            category: 'Full-Stack Web App',
            description: 'A comprehensive rescue shelter platform built to help animal rescue teams track pet intakes, veterinary health records, and adoption workflows.',
            imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com/REP-Julian/Pawtrack-app',
            order: 1,
        },
        {
            id: '2',
            title: 'QCU Lost and Found Portal',
            category: 'Community Web App',
            description: 'A centralized digital lost-and-found management platform developed for Quezon City University students and faculty to log, search, and verify misplaced campus belongings.',
            imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com/REP-Julian/Lost-and-Found',
            order: 2,
        },
        {
            id: '3',
            title: 'Social Media Autonomous Reporter',
            category: 'Automation & Security',
            description: 'An automated desktop and web verification tool built with Python, Playwright, and a React interface to streamline rapid detection, monitoring, and reporting of impersonation profiles.',
            imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com/REP-Julian/Social-Media-Autonomous-Report-V2',
            order: 3,
        },
    ];

    const rawList = projects && projects.length > 0 ? projects : defaultProjects;

    const items = rawList.map((item, idx) => {
        const fallback = defaultProjects[idx % defaultProjects.length];
        return {
            ...fallback,
            ...item,
        };
    });

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeModalProject, setActiveModalProject] = useState(null);

    // Close modal on Escape key press
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

    // Extract unique categories for filter tabs
    const categories = ['All', ...new Set(items.map((p) => p.category || 'General'))];

    const filteredProjects = selectedCategory === 'All'
        ? items
        : items.filter((p) => p.category === selectedCategory);

    return (
        <section id="projects" className="py-20 sm:py-24 bg-white relative scroll-mt-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-devyellow-100 border border-devyellow-200 text-devorange-600 text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-devorange-500" />
                        <span>Featured Work</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-charcoal-900 tracking-tight">
                        Projects I've Built
                    </h2>
                    <p className="text-sm sm:text-base text-charcoal-500 font-normal leading-relaxed">
                        A collection of web applications, tools, and platforms I've developed. Focused on clean user interfaces, reliable backends, and practical problem-solving.
                    </p>
                </div>

                {/* Category Filter Tabs */}
                {categories.length > 2 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-10 sm:mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500 ${
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredProjects.map((project, idx) => (
                        <article
                            key={project.id || idx}
                            className="flex flex-col bg-white rounded-2xl border border-gray-200/90 shadow-warm-sm hover:shadow-warm-md hover:border-devorange-300 transition-all duration-300 overflow-hidden group"
                        >
                            {/* Project Screenshot / Preview */}
                            <div
                                className="relative aspect-[16/10] overflow-hidden bg-charcoal-950 cursor-pointer"
                                onClick={() => setActiveModalProject(project)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setActiveModalProject(project);
                                    }
                                }}
                                aria-label={`View details for ${project.title}`}
                            >
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
                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-charcoal-900/90 backdrop-blur-md border border-charcoal-700 text-devyellow-400 text-[11px] font-bold uppercase tracking-wider">
                                    {project.category}
                                </span>
                            </div>

                            {/* Content Body */}
                            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-2.5">
                                    <h3
                                        className="text-lg sm:text-xl font-black text-charcoal-900 group-hover:text-devorange-600 transition-colors cursor-pointer"
                                        onClick={() => setActiveModalProject(project)}
                                    >
                                        {project.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-normal">
                                        {project.description}
                                    </p>
                                </div>

                                {/* Action Links */}
                                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setActiveModalProject(project)}
                                        className="text-xs font-bold text-devorange-600 hover:text-devorange-700 inline-flex items-center gap-1 transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500 rounded"
                                    >
                                        <span>Details</span>
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </button>

                                    {project.githubUrl && project.githubUrl !== '#' && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={`GitHub source code for ${project.title}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-devyellow-400 text-xs font-bold transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
                                            title="View Source Code"
                                        >
                                            <Github className="w-3.5 h-3.5" />
                                            <span>Code</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* Simple, Compact Project Details Modal */}
            {activeModalProject && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm select-none"
                    onClick={() => setActiveModalProject(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="project-modal-title"
                >
                    <div
                        className="relative max-w-2xl w-full max-h-[90vh] bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-y-auto flex flex-col select-text"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
                            <div className="flex items-center gap-2.5 min-w-0 pr-3">
                                <span className="px-2.5 py-0.5 rounded-full bg-devyellow-100 text-devorange-600 text-xs font-bold uppercase tracking-wider shrink-0">
                                    {activeModalProject.category}
                                </span>
                                <h3 id="project-modal-title" className="text-base sm:text-lg font-black text-charcoal-900 truncate">
                                    {activeModalProject.title}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveModalProject(null)}
                                aria-label="Close project details"
                                className="p-2 rounded-full hover:bg-gray-100 text-charcoal-500 hover:text-charcoal-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 sm:p-7 space-y-6">
                            {/* Project Visual */}
                            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-charcoal-950 relative shadow-sm">
                                <img
                                    src={activeModalProject.imageUrl}
                                    alt={activeModalProject.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                                    }}
                                />
                            </div>

                            {/* Project Natural Description */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                                    About the Project
                                </h4>
                                <p className="text-sm text-charcoal-700 leading-relaxed font-normal">
                                    {activeModalProject.description}
                                </p>
                            </div>

                            {/* External Links */}
                            {activeModalProject.githubUrl && activeModalProject.githubUrl !== '#' && (
                                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
                                    <a
                                        href={activeModalProject.githubUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-5 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-devyellow-400 text-xs font-bold flex items-center gap-2 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
                                    >
                                        <Github className="w-4 h-4" />
                                        <span>GitHub Repository</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProjectsSection;
