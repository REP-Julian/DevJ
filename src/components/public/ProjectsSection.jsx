import React, { useState, useEffect } from 'react';
import { Github, ChevronLeft, ChevronRight, Sparkles, Code2 } from 'lucide-react';

export const ProjectsSection = ({ projects = [] }) => {
    const defaultProjects = [
        {
            id: '1',
            title: 'NeuroCanvas AI',
            category: 'Generative AI Platform',
            description: 'Interactive generative canvas tool transforming contextual natural language sketches into production-ready SVG interfaces and layout tokens.',
            technologies: 'React, Node.js, TailwindCSS, OpenAI API',
            imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com',
            order: 1,
        },
        {
            id: '2',
            title: 'Aura CMS & Dynamic Engine',
            category: 'Creative Full-Stack',
            description: 'A blazing-fast content management suite powering reactive portfolios with native components and zero-rebuild asset updates.',
            technologies: 'React, Cloudflare Pages, TailwindCSS, Vite',
            imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com',
            order: 2,
        },
        {
            id: '3',
            title: 'VibeMatrix Workspace',
            category: 'Interactive UI',
            description: 'Browser-based developer dashboard with contextual workspaces, clean themes, and productivity tooling.',
            technologies: 'React, TailwindCSS, Web Audio API, Vite',
            imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
            githubUrl: 'https://github.com',
            order: 3,
        },
    ];

    const items = projects.length > 0 ? projects : defaultProjects;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-advance every 4.5 seconds with pause on hover
    useEffect(() => {
        if (isHovered || items.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 4500);

        return () => clearInterval(timer);
    }, [items.length, isHovered]);

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

    // Calculate fluid positioning for each card in the 3D stage
    const getCardStyle = (idx) => {
        const total = items.length;
        if (total === 1) {
            return {
                wrapper: 'z-30 opacity-100 scale-100 translate-x-0 rotate-0 cursor-default pointer-events-auto',
                inner: 'p-1 bg-gradient-to-tr from-devorange-400 via-devyellow-400 to-devorange-500 border-4 border-white shadow-2xl shadow-devorange-500/20',
                img: 'grayscale-0 brightness-100',
                overlay: 'opacity-0',
                showDetails: true,
            };
        }

        const offset = (idx - currentIndex + total) % total;

        // Active Center Card
        if (offset === 0) {
            return {
                wrapper: 'z-30 opacity-100 scale-100 translate-x-0 rotate-0 cursor-default pointer-events-auto',
                inner: 'p-1 bg-gradient-to-tr from-devorange-400 via-devyellow-400 to-devorange-500 border-4 border-white shadow-2xl shadow-devorange-500/20',
                img: 'grayscale-0 brightness-100',
                overlay: 'opacity-0',
                showDetails: true,
            };
        }

        // Right Background Card
        if (offset === 1) {
            return {
                wrapper: 'z-10 opacity-45 hover:opacity-90 scale-[0.84] translate-x-20 sm:translate-x-32 md:translate-x-40 rotate-6 hover:rotate-3 cursor-pointer pointer-events-auto',
                inner: 'p-1 bg-white border border-gray-200/90 shadow-lg hover:shadow-xl hover:border-devorange-300',
                img: 'grayscale brightness-90 hover:grayscale-0 hover:brightness-100',
                overlay: 'opacity-40',
                showDetails: false,
            };
        }

        // Left Background Card
        if (offset === total - 1) {
            return {
                wrapper: 'z-10 opacity-45 hover:opacity-90 scale-[0.84] -translate-x-20 sm:-translate-x-32 md:-translate-x-40 -rotate-6 hover:-rotate-3 cursor-pointer pointer-events-auto',
                inner: 'p-1 bg-white border border-gray-200/90 shadow-lg hover:shadow-xl hover:border-devorange-300',
                img: 'grayscale brightness-90 hover:grayscale-0 hover:brightness-100',
                overlay: 'opacity-40',
                showDetails: false,
            };
        }

        // Hidden cards for lists larger than 3
        return {
            wrapper: 'z-0 opacity-0 scale-75 translate-x-0 rotate-0 pointer-events-none',
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
                    <p className="text-charcoal-500 text-base">
                        Explorations across generative AI platforms, spatial interactive UI, and high-velocity web services.
                    </p>
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
                                        className="px-4 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-devyellow-400 text-xs font-bold flex items-center gap-2 transition-all shadow-sm hover:scale-105 active:scale-95"
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
                                        className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-charcoal-800 hover:bg-devyellow-100 hover:text-devorange-600 transition-all hover:scale-105 active:scale-95"
                                        aria-label="Previous project"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-center gap-1.5">
                                        {items.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentIndex(idx)}
                                                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                                                    currentIndex === idx
                                                        ? 'w-6 bg-gradient-to-r from-devyellow-400 to-devorange-500 shadow-sm'
                                                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                                                }`}
                                                aria-label={`Go to slide ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-charcoal-800 hover:bg-devyellow-100 hover:text-devorange-600 transition-all hover:scale-105 active:scale-95"
                                        aria-label="Next project"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE: 3D Pop-out Carousel Visual Stage */}
                        <div
                            className="lg:col-span-7 relative order-1 lg:order-2"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <div
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                className="relative h-72 sm:h-96 w-full flex items-center justify-center overflow-hidden rounded-2xl touch-pan-y"
                            >
                                {/* Ambient Warm Backlight Glow behind active card */}
                                <div className="absolute w-56 sm:w-80 h-64 sm:h-84 bg-gradient-to-tr from-devorange-400/25 via-devyellow-400/20 to-devorange-500/25 rounded-3xl blur-2xl transform transition-all duration-700 pointer-events-none" />

                                {/* Persistent Multi-Project Carousel Deck */}
                                {items.map((item, idx) => {
                                    const style = getCardStyle(idx);
                                    return (
                                        <div
                                            key={item.id || idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`absolute w-56 sm:w-80 h-64 sm:h-84 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform rounded-2xl select-none ${style.wrapper}`}
                                        >
                                            <div
                                                className={`w-full h-full rounded-2xl transition-all duration-700 overflow-hidden ${style.inner}`}
                                            >
                                                <div className="w-full h-full rounded-xl overflow-hidden relative">
                                                    <img
                                                        src={item.imageUrl || defaultProjects[idx % defaultProjects.length]?.imageUrl}
                                                        alt={item.title}
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                                                        }}
                                                        className={`w-full h-full object-cover transition-all duration-700 ease-out ${style.img}`}
                                                    />
                                                    <div
                                                        className={`absolute inset-0 bg-charcoal-900/50 transition-opacity duration-700 pointer-events-none ${style.overlay}`}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-transparent to-transparent pointer-events-none" />

                                                    <div
                                                        className={`absolute bottom-3 left-3 right-3 flex items-center justify-between text-white transition-opacity duration-500 ${
                                                            style.showDetails ? 'opacity-100' : 'opacity-0'
                                                        }`}
                                                    >
                                                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-charcoal-900/80 backdrop-blur-md">
                                                            {item.category}
                                                        </span>
                                                        <span className="text-xs font-bold text-devyellow-300 flex items-center gap-1">
                                                            <Sparkles className="w-3.5 h-3.5" /> Featured
                                                        </span>
                                                    </div>
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
        </section>
    );
};

export default ProjectsSection;