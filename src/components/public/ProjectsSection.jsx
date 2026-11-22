import React, { useState, useEffect } from 'react';
import { Github, FolderGit2, X, ArrowUpRight, ExternalLink } from 'lucide-react';

export const ProjectsSection = ({ projects = [] }) => {
    const defaultProjects = [
        {
            id: '1',
            title: 'PawTrack Management System',
            category: 'Web Application',
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
        <section id="projects" className="py-20 sm:py-24 bg-white dark:bg-charcoal-950 relative scroll-mt-16 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-devyellow-100 dark:bg-amber-950/40 border border-devyellow-200 dark:border-amber-800/60 text-devorange-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                        <FolderGit2 className="w-3.5 h-3.5 text-devorange-600 dark:text-amber-400" />
                        <span>Featured Work</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-charcoal-900 dark:text-white tracking-tight">
                        Projects I've Built
                    </h2>
                    <p className="text-sm sm:text-base text-charcoal-500 dark:text-gray-400 font-normal leading-relaxed">
                        A collection of web applications, tools, and platforms I've developed. Focused on clean user interfaces, reliable backends, and practical problem-solving.
                    </p>
                </div>

                {/* Category Filter Tabs */}
                {categories.length > 2 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-10 sm:mb-12">
                        {categories.map((cat) => {
                            const isSelected = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500 active:scale-95 ${
                                        isSelected
                                            ? 'bg-charcoal-900 dark:bg-amber-400 text-devyellow-400 dark:text-charcoal-950 shadow-md ring-1 ring-devorange-500/20'
                                            : 'bg-white dark:bg-charcoal-900 hover:bg-gray-100/80 dark:hover:bg-charcoal-800 text-charcoal-700 dark:text-gray-300 border border-gray-200/80 dark:border-charcoal-800 shadow-xs'
                                    }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Responsive Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredProjects.map((project, idx) => (
                        <article
                            key={project.id || idx}
                            className="glow-card flex flex-col bg-white dark:bg-charcoal-900 rounded-2xl border border-gray-200/90 dark:border-charcoal-800 shadow-warm-sm hover:shadow-warm-md hover:border-devorange-300 dark:hover:border-amber-400/50 transition-all duration-300 overflow-hidden group hover:-translate-y-1"
                        >
                            {/* Browser App-Frame Top Bar */}
                            <div className="bg-charcoal-900 px-3.5 py-2.5 flex items-center justify-between border-b border-charcoal-800">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                                </div>
                                <span className="text-[10px] font-mono font-medium text-charcoal-400 truncate max-w-[170px]">
                                    {project.githubUrl ? project.githubUrl.replace('https://github.com/REP-Julian/', 'devj://') : 'app.local'}
                                </span>
                                <span className="text-[9px] font-bold text-devyellow-400 bg-charcoal-800 px-2 py-0.5 rounded">
                                    {project.category}
                                </span>
                            </div>

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
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/75 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />
                            </div>

                            {/* Content Body */}
                            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-2.5">
                                    <h3
                                        className="text-lg sm:text-xl font-black text-charcoal-900 dark:text-white group-hover:text-devorange-600 dark:group-hover:text-amber-400 transition-colors cursor-pointer leading-snug"
                                        onClick={() => setActiveModalProject(project)}
                                    >
                                        {project.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-charcoal-600 dark:text-gray-300 leading-relaxed font-normal line-clamp-3">
                                        {project.description}
                                    </p>
                                </div>

                                {/* Action Links */}
                                <div className="pt-3 border-t border-gray-100 dark:border-charcoal-800 flex items-center justify-between gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setActiveModalProject(project)}
                                        className="text-xs font-bold text-devorange-600 dark:text-amber-400 hover:text-devorange-700 dark:hover:text-amber-300 inline-flex items-center gap-1 transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500 rounded group-hover:translate-x-0.5 duration-200"
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
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal-900 dark:bg-charcoal-800 hover:bg-charcoal-800 dark:hover:bg-charcoal-700 text-devyellow-400 text-xs font-bold transition-all shadow-xs hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500 active:scale-95 border border-transparent dark:border-charcoal-700"
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

            {/* Project Details Modal */}
            {activeModalProject && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm select-none"
                    onClick={() => setActiveModalProject(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="project-modal-title"
                >
                    <div
                        className="animate-popup-zoom relative max-w-2xl w-full max-h-[90vh] bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-y-auto flex flex-col select-text"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
                            <div className="flex items-center gap-2.5 min-w-0 pr-3">
                                <span className="px-2.5 py-0.5 rounded-full bg-devyellow-100 text-devorange-600 text-xs font-bold uppercase tracking-wider shrink-0 border border-devyellow-200">
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

                            {/* Project Description */}
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
                                        className="px-5 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-devyellow-400 text-xs font-bold flex items-center gap-2 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500 active:scale-95"
                                    >
                                        <Github className="w-4 h-4" />
                                        <span>View on GitHub</span>
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
