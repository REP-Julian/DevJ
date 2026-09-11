import React, { useState, useEffect } from 'react';
import { Github, ChevronLeft, ChevronRight, Sparkles, Code2, ZoomIn, ZoomOut, ExternalLink, X } from 'lucide-react';

export const ProjectsSection = ({ projects = [] }) => {
    const defaultProjects = [
        {
            id: '1',
            title: 'PawTrack Management System 2.0',
            category: 'Full-Stack Systems & SQL Database',
            description: 'Animal rescue operational platform solving paper record loss. Engineered a normalized relational schema for rescue intake, veterinary medical logs, and adoption candidate matching with role-based staff authentication.',
            problem: 'Paper record fragmentation and delayed medical histories during rescue operations.',
            architecture: 'Normalized SQLite schema with foreign key cascades, Express REST controllers, JWT middleware, and reactive React interface.',
            metrics: 'Eliminated manual intake errors; 100% digital audit trail with sub-50ms local database queries.',
            technologies: 'Node.js, Express, SQLite, React, TailwindCSS, JWT Auth',
            imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com/REP-Julian',
            order: 1,
        },
        {
            id: '2',
            title: 'DevJ AI Studio & Multi-Provider CMS',
            category: 'Distributed AI Architecture',
            description: 'Production Appwrite back-office engine orchestrating multi-provider LLMs (Gemini, Groq, Mistral, OpenRouter) with Server-Sent Events (SSE) streaming, automated fallback routing, token budgeting, and zero-rebuild live portfolio updates.',
            problem: 'Vendor lock-in, API rate limits, and constant frontend rebuilds required for content edits.',
            architecture: 'Node.js SSE streaming proxy with automatic fallback between 4 AI providers; Appwrite Cloud database and secure storage integration.',
            metrics: 'Zero downtime during provider rate limits, live token tracking, and 100% zero-rebuild content synchronizations.',
            technologies: 'React, Node.js, Express, Appwrite Cloud, SSE Streaming, Google Gen AI SDK',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com/REP-Julian/DevJ',
            order: 2,
        },
        {
            id: '3',
            title: 'VibeMatrix Developer Workspace',
            category: 'Interactive Web Tooling',
            description: 'Modular developer dashboard with persistent workspace sessions, custom RESTful endpoints, and reactive state inspection designed for rapid prototyping.',
            problem: 'Fragmented context switching between terminal benchmarking, API inspection, and note scratchpads.',
            architecture: 'Client-side state machine with persistent LocalStorage caching, modular widget bus, and lightweight Express mock server.',
            metrics: 'Sub-16ms render loop with zero layout thrashing across complex dashboard tiles.',
            technologies: 'React, TailwindCSS, Web Audio API, Vite, Express',
            imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com/REP-Julian',
            order: 3,
        },
    ];

    const items = projects.length > 0 ? projects : defaultProjects;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxItem, setLightboxItem] = useState(null);
    const [lightboxZoom, setLightboxZoom] = useState(1);

    // Handle Escape and Arrow keys to close or navigate Lightbox Modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setLightboxItem(null);
                setLightboxZoom(1);
            } else if (e.key === 'ArrowRight' && lightboxItem) {
                const currentIdx = items.findIndex((it) => (it.id || it.title) === (lightboxItem.id || lightboxItem.title));
                if (currentIdx !== -1) {
                    const nextIdx = (currentIdx + 1) % items.length;
                    setLightboxItem(items[nextIdx]);
                    setCurrentIndex(nextIdx);
                    setLightboxZoom(1);
                }
            } else if (e.key === 'ArrowLeft' && lightboxItem) {
                const currentIdx = items.findIndex((it) => (it.id || it.title) === (lightboxItem.id || lightboxItem.title));
                if (currentIdx !== -1) {
                    const prevIdx = (currentIdx - 1 + items.length) % items.length;
                    setLightboxItem(items[prevIdx]);
                    setCurrentIndex(prevIdx);
                    setLightboxZoom(1);
                }
            }
        };
        if (lightboxItem) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
            setLightboxZoom(1);
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [lightboxItem, items]);

    const [touchStartX, setTouchStartX] = useState(null);

    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        if (touchStartX === null) return;
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (diff > 45) {
            handleNext();
        } else if (diff < -45) {
            handlePrev();
        }
        setTouchStartX(null);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const activeItem = items[currentIndex] || items[0];

    const techList = activeItem?.technologies
        ? activeItem.technologies.split(',').map((t) => t.trim())
        : [];

    // Card positioning for each card in the stage (clean, static sizing without hover resize or transitions)
    const getCardStyle = (idx) => {
        const total = items.length;
        const offset = (idx - currentIndex + total) % total;

        // Active Center Card
        if (offset === 0) {
            return {
                wrapper:
                    'z-30 opacity-100 scale-100 translate-x-0 rotate-0 cursor-pointer pointer-events-auto w-56 sm:w-80 h-64 sm:h-80',
                inner:
                    'p-1 bg-gradient-to-tr from-devorange-400 via-devyellow-400 to-devorange-500 border-4 border-white shadow-2xl shadow-devorange-500/20',
                img: 'grayscale-0 brightness-100',
                overlay: 'opacity-0',
                showDetails: true,
            };
        }

        // Right Background Card
        if (offset === 1) {
            return {
                wrapper:
                    'z-10 opacity-50 scale-[0.84] translate-x-20 sm:translate-x-32 md:translate-x-40 rotate-6 cursor-pointer pointer-events-auto w-56 sm:w-80 h-64 sm:h-80',
                inner:
                    'p-1 bg-white border border-gray-200 shadow-md',
                img: 'grayscale brightness-90',
                overlay: 'opacity-40',
                showDetails: false,
            };
        }

        // Left Background Card
        if (offset === total - 1) {
            return {
                wrapper:
                    'z-10 opacity-50 scale-[0.84] -translate-x-20 sm:-translate-x-32 md:-translate-x-40 -rotate-6 cursor-pointer pointer-events-auto w-56 sm:w-80 h-64 sm:h-80',
                inner:
                    'p-1 bg-white border border-gray-200 shadow-md',
                img: 'grayscale brightness-90',
                overlay: 'opacity-40',
                showDetails: false,
            };
        }

        // Hidden cards for lists larger than 3
        return {
            wrapper:
                'z-0 opacity-0 scale-75 translate-x-0 rotate-0 pointer-events-none w-56 sm:w-80 h-64 sm:h-80',
            inner: 'p-1 bg-white',
            img: 'grayscale',
            overlay: 'opacity-0',
            showDetails: false,
        };
    };

    return (
        <section id="projects" className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-devyellow-100 text-devorange-600 text-xs font-extrabold uppercase tracking-wider">
                        Portfolio Work
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-charcoal-900 tracking-tight">
                        Featured Projects
                    </h2>
                </div>

                <div className="bg-charcoal-50/50 rounded-3xl p-6 sm:p-10 lg:p-14 border border-gray-200/80 shadow-warm-md">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                        {/* LEFT SIDE: Title, Category, Description, Tech Stack, Source Code */}
                        <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
                            <div className="flex items-center gap-3">
                                <span className="px-3.5 py-1 rounded-full bg-devyellow-100 text-charcoal-900 border border-devyellow-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                                    <Code2 className="w-3.5 h-3.5 text-devorange-600" />
                                    {activeItem?.category || 'Project'}
                                </span>
                                <span className="text-xs font-bold text-charcoal-500">
                                    {currentIndex + 1} / {items.length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-2xl sm:text-4xl font-black text-charcoal-900 leading-tight">
                                    {activeItem?.title}
                                </h3>
                                <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed">
                                    {activeItem?.description}
                                </p>

                                {/* Structured Engineering Breakdown */}
                                {(activeItem?.problem || activeItem?.architecture || activeItem?.metrics) && (
                                    <div className="space-y-2 pt-1 text-xs">
                                        {activeItem.problem && (
                                            <div className="p-3 rounded-xl bg-white border border-gray-200/90 shadow-sm">
                                                <span className="font-extrabold text-charcoal-900 block text-[10px] uppercase tracking-wider text-devorange-600 mb-0.5">
                                                    Core Problem Solved
                                                </span>
                                                <span className="text-charcoal-700 leading-normal">{activeItem.problem}</span>
                                            </div>
                                        )}
                                        {activeItem.architecture && (
                                            <div className="p-3 rounded-xl bg-white border border-gray-200/90 shadow-sm">
                                                <span className="font-extrabold text-charcoal-900 block text-[10px] uppercase tracking-wider text-devorange-600 mb-0.5">
                                                    System Architecture
                                                </span>
                                                <span className="text-charcoal-700 leading-normal">{activeItem.architecture}</span>
                                            </div>
                                        )}
                                        {activeItem.metrics && (
                                            <div className="p-3 rounded-xl bg-white border border-gray-200/90 shadow-sm">
                                                <span className="font-extrabold text-charcoal-900 block text-[10px] uppercase tracking-wider text-devorange-600 mb-0.5">
                                                    Key Metrics & Impact
                                                </span>
                                                <span className="text-charcoal-700 leading-normal">{activeItem.metrics}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Tech Stack Pills */}
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-charcoal-400 mb-2">
                                    Technologies Used
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {techList.map((t, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-charcoal-800 text-xs font-bold shadow-sm"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Source Code Action & Carousel Controls */}
                            <div className="pt-4 border-t border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                {activeItem?.githubUrl && activeItem.githubUrl !== '#' ? (
                                    <a
                                        href={activeItem.githubUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-devyellow-400 text-xs font-bold flex items-center gap-2 shadow-sm"
                                    >
                                        <Github className="w-4 h-4" /> View Source Code
                                    </a>
                                ) : (
                                    <span />
                                )}

                                {/* Arrow & Dot Pagination */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handlePrev}
                                        className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-charcoal-800 hover:bg-devyellow-100 hover:text-devorange-600"
                                        aria-label="Previous project"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-center gap-1.5">
                                        {items.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentIndex(idx)}
                                                className={`h-2 rounded-full ${
                                                    currentIndex === idx
                                                        ? 'w-6 bg-gradient-to-r from-devyellow-400 to-devorange-500 shadow-sm'
                                                        : 'w-2 bg-gray-300'
                                                }`}
                                                aria-label={`Go to slide ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-charcoal-800 hover:bg-devyellow-100 hover:text-devorange-600"
                                        aria-label="Next project"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE: Carousel Visual Stage */}
                        <div className="lg:col-span-7 relative order-1 lg:order-2">
                            <div
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                className="relative min-h-[360px] sm:min-h-[420px] w-full flex items-center justify-center overflow-visible rounded-2xl touch-pan-y py-4"
                            >
                                {/* Ambient Warm Backlight Glow behind active card */}
                                <div
                                    className="absolute w-56 sm:w-80 h-64 sm:h-80 bg-gradient-to-tr from-devorange-400/25 via-devyellow-400/20 to-devorange-500/25 rounded-3xl blur-2xl pointer-events-none opacity-70"
                                />

                                {/* Persistent Multi-Project Carousel Deck */}
                                {items.map((item, idx) => {
                                    const style = getCardStyle(idx);
                                    return (
                                        <div
                                            key={item.id || idx}
                                            onClick={() => {
                                                setCurrentIndex(idx);
                                                setLightboxItem(item);
                                            }}
                                            className={`absolute rounded-2xl select-none ${style.wrapper}`}
                                        >
                                            <div
                                                className={`w-full h-full rounded-2xl overflow-hidden ${style.inner}`}
                                            >
                                                <div className="w-full h-full rounded-xl overflow-hidden relative flex items-center justify-center bg-charcoal-950">
                                                    <img
                                                        src={item.imageUrl || defaultProjects[idx % defaultProjects.length]?.imageUrl}
                                                        alt={item.title}
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                                                        }}
                                                        className={`w-full h-full object-cover ${style.img}`}
                                                    />
                                                    <div
                                                        className={`absolute inset-0 bg-charcoal-900/50 pointer-events-none ${style.overlay}`}
                                                    />
                                                    <div
                                                        className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-transparent to-transparent pointer-events-none"
                                                    />

                                                    {style.showDetails && (
                                                        <div
                                                            className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white"
                                                        >
                                                            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-charcoal-900/80 backdrop-blur-md">
                                                                {item.category}
                                                            </span>
                                                            <span className="text-xs font-bold text-devyellow-300 flex items-center gap-1">
                                                                <Sparkles className="w-3.5 h-3.5" /> Featured
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Lightbox Modal */}
            {lightboxItem && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-charcoal-950/95 backdrop-blur-md select-none"
                    onClick={() => {
                        setLightboxItem(null);
                        setLightboxZoom(1);
                    }}
                >
                    <div
                        className="relative max-w-5xl w-full max-h-[94vh] flex flex-col bg-charcoal-900 border border-charcoal-700/80 rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header bar: shrink-0 */}
                        <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 bg-charcoal-900 border-b border-charcoal-800 z-10">
                            <div className="flex items-center gap-2.5 min-w-0 pr-3">
                                <span className="shrink-0 px-2.5 py-1 rounded-md bg-devyellow-400 text-charcoal-900 text-xs font-black uppercase tracking-wider">
                                    {lightboxItem.category || 'Featured'}
                                </span>
                                <h4 className="text-sm sm:text-base font-black text-white truncate">
                                    {lightboxItem.title}
                                </h4>
                            </div>

                            {/* Controls: Zoom In/Out, New Tab, Close */}
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setLightboxZoom((z) => Math.max(1, Number((z - 0.25).toFixed(2))))}
                                    disabled={lightboxZoom <= 1}
                                    className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 disabled:opacity-30 disabled:pointer-events-none text-charcoal-300 hover:text-white"
                                    title="Zoom Out"
                                    aria-label="Zoom Out"
                                >
                                    <ZoomOut className="w-4 h-4" />
                                </button>
                                <span className="text-xs font-mono font-bold text-devyellow-400 px-1 min-w-[42px] text-center">
                                    {Math.round(lightboxZoom * 100)}%
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setLightboxZoom((z) => Math.min(2.5, Number((z + 0.25).toFixed(2))))}
                                    disabled={lightboxZoom >= 2.5}
                                    className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 disabled:opacity-30 disabled:pointer-events-none text-charcoal-300 hover:text-white"
                                    title="Zoom In"
                                    aria-label="Zoom In"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                </button>
                                {lightboxItem.imageUrl && (
                                    <a
                                        href={lightboxItem.imageUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 hover:text-white ml-1"
                                        title="Open full image in new tab"
                                        aria-label="Open full image in new tab"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLightboxItem(null);
                                        setLightboxZoom(1);
                                    }}
                                    className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 hover:text-white ml-1"
                                    aria-label="Close full view"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Image display with navigation arrows: flex-1 min-h-0 */}
                        <div
                            className={`relative flex-1 min-h-0 w-full flex items-center justify-center p-3 sm:p-6 bg-charcoal-950 ${
                                lightboxZoom > 1 ? 'overflow-auto cursor-grab active:cursor-grabbing' : 'overflow-hidden'
                            }`}
                        >
                            {items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const currentIdx = items.findIndex((it) => (it.id || it.title) === (lightboxItem.id || lightboxItem.title));
                                        const prevIdx = (currentIdx - 1 + items.length) % items.length;
                                        setLightboxItem(items[prevIdx]);
                                        setCurrentIndex(prevIdx);
                                        setLightboxZoom(1);
                                    }}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-charcoal-900/80 hover:bg-charcoal-800 text-white border border-charcoal-700 shadow-lg z-20"
                                    title="Previous image"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}

                            <img
                                src={lightboxItem.imageUrl || defaultProjects[0]?.imageUrl}
                                alt={lightboxItem.title}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                                }}
                                className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl block select-none"
                                style={{
                                    maxHeight: lightboxZoom === 1 ? 'calc(94vh - 145px)' : 'none',
                                    maxWidth: lightboxZoom === 1 ? '100%' : 'none',
                                    transform: lightboxZoom > 1 ? `scale(${lightboxZoom})` : 'none',
                                    transformOrigin: 'center center',
                                }}
                            />

                            {items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const currentIdx = items.findIndex((it) => (it.id || it.title) === (lightboxItem.id || lightboxItem.title));
                                        const nextIdx = (currentIdx + 1) % items.length;
                                        setLightboxItem(items[nextIdx]);
                                        setCurrentIndex(nextIdx);
                                        setLightboxZoom(1);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-charcoal-900/80 hover:bg-charcoal-800 text-white border border-charcoal-700 shadow-lg z-20"
                                    title="Next image"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Footer with description, specs & links: shrink-0 */}
                        <div className="shrink-0 px-4 sm:px-6 py-4 bg-charcoal-900 border-t border-charcoal-800 text-xs sm:text-sm text-charcoal-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-10">
                            <div className="space-y-1.5 max-w-3xl">
                                <p className="leading-relaxed text-charcoal-200">
                                    {lightboxItem.description}
                                </p>
                                {(lightboxItem.architecture || lightboxItem.metrics) && (
                                    <div className="flex flex-wrap gap-2 text-xs text-charcoal-400 pt-1">
                                        {lightboxItem.architecture && (
                                            <span className="bg-charcoal-800 px-2.5 py-1 rounded-md text-devyellow-400 font-mono text-[11px] border border-charcoal-700">
                                                Arch: {lightboxItem.architecture}
                                            </span>
                                        )}
                                        {lightboxItem.metrics && (
                                            <span className="bg-charcoal-800 px-2.5 py-1 rounded-md text-devorange-400 font-mono text-[11px] border border-charcoal-700">
                                                Impact: {lightboxItem.metrics}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                            {lightboxItem.githubUrl && lightboxItem.githubUrl !== '#' && (
                                <a
                                    href={lightboxItem.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="shrink-0 px-4 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-devyellow-400 text-xs font-bold flex items-center gap-2 border border-charcoal-700 shadow-sm"
                                >
                                    <Github className="w-4 h-4" /> Source Code
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProjectsSection;