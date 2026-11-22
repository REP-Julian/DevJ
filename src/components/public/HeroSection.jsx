import React, { useState, useEffect } from 'react';
import { ArrowRight, Terminal, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

export const HeroSection = ({ profile }) => {
    // Array of distinct images to cycle through
    const defaultImages = [
        'https://sgp.cloud.appwrite.io/v1/storage/buckets/portfolio/files/6aa15e9e001617de4a5f/view?project=6aa1516d001f3ded0bc0',
        'https://sgp.cloud.appwrite.io/v1/storage/buckets/portfolio/files/6aa15eb6001e7c787293/view?project=6aa1516d001f3ded0bc0',
        'https://sgp.cloud.appwrite.io/v1/storage/buckets/portfolio/files/6aa15e810016d47a13ee/view?project=6aa1516d001f3ded0bc0',
    ];

    const images = [
        profile?.avatarUrl || defaultImages[0],
        profile?.avatarUrl2 || defaultImages[1],
        profile?.avatarUrl3 || defaultImages[2],
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-switch image every 4 seconds with pause on hover & reduced-motion check
    useEffect(() => {
        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isHovered || prefersReducedMotion) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [images.length, isHovered]);

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
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    // Calculate fluid positioning for each card in the 3D stage
    const getCardStyle = (idx) => {
        const total = images.length;
        const offset = (idx - currentIndex + total) % total;

        // Active Center Card
        if (offset === 0) {
            return {
                wrapper: 'z-30 opacity-100 scale-100 translate-x-0 rotate-0 cursor-default pointer-events-auto',
                inner: 'p-[3px] bg-gradient-to-tr from-devyellow-400 via-devorange-400 to-devorange-500 shadow-2xl shadow-devorange-500/20 ring-4 ring-white/80',
                img: 'grayscale-0 brightness-100 contrast-100',
                overlay: 'opacity-20',
            };
        }

        // Right Background Card
        if (offset === 1) {
            return {
                wrapper: 'z-10 opacity-45 hover:opacity-90 scale-[0.84] translate-x-20 sm:translate-x-28 md:translate-x-32 rotate-6 hover:rotate-3 cursor-pointer pointer-events-auto',
                inner: 'p-[2px] bg-white/95 border border-gray-200/90 shadow-lg hover:shadow-xl hover:border-devorange-300',
                img: 'grayscale brightness-90 hover:grayscale-0 hover:brightness-100',
                overlay: 'opacity-40',
            };
        }

        // Left Background Card
        if (offset === total - 1) {
            return {
                wrapper: 'z-10 opacity-45 hover:opacity-90 scale-[0.84] -translate-x-20 sm:-translate-x-28 md:-translate-x-32 -rotate-6 hover:-rotate-3 cursor-pointer pointer-events-auto',
                inner: 'p-[2px] bg-white/95 border border-gray-200/90 shadow-lg hover:shadow-xl hover:border-devorange-300',
                img: 'grayscale brightness-90 hover:grayscale-0 hover:brightness-100',
                overlay: 'opacity-40',
            };
        }

        // Hidden cards for lists larger than 3
        return {
            wrapper: 'z-0 opacity-0 scale-75 translate-x-0 rotate-0 pointer-events-none',
            inner: 'p-[2px] bg-white',
            img: 'grayscale',
            overlay: 'opacity-0',
        };
    };

    return (
        <section
            id="home"
            className="relative min-h-[90vh] pt-32 pb-20 flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-charcoal-50/40 to-white dark:from-charcoal-950 dark:via-charcoal-900/40 dark:to-charcoal-950 transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                {/* Left Column: Typography & CTAs */}
                <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-charcoal-900 border border-gray-200/90 dark:border-charcoal-800 shadow-warm-xs text-xs font-bold text-charcoal-800 dark:text-gray-200 uppercase tracking-wider">
                        <Terminal className="w-3.5 h-3.5 text-devorange-600 dark:text-amber-400" />
                        <span>Computer Science &amp; Web Development</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-charcoal-900 dark:text-white tracking-tight leading-[1.08]">
                            Julian Agustino
                        </h1>
                        <p className="text-xl sm:text-2xl font-bold text-devorange-600 dark:text-amber-400 leading-snug">
                            {profile?.tagline || 'Student & Developer at Quezon City University'}
                        </p>
                    </div>

                    <p className="text-base sm:text-lg text-charcoal-600 dark:text-gray-300 max-w-xl font-normal leading-relaxed">
                        {profile?.description ||
                            'Building practical web platforms, campus tools, and exploring modern AI integrations. Focused on clean user interfaces and resilient backend logic.'}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                        <a
                            href="#projects"
                            className="px-6 sm:px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider bg-charcoal-900 dark:bg-amber-400 text-devyellow-400 dark:text-charcoal-950 hover:bg-charcoal-800 dark:hover:bg-amber-300 shadow-warm-md hover:shadow-warm-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
                        >
                            <span>View Projects</span>
                            <ArrowRight className="w-4 h-4" />
                        </a>
                        <a
                            href="#contact"
                            className="px-6 sm:px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider bg-white dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700 text-charcoal-800 dark:text-gray-200 hover:border-devorange-400 hover:text-devorange-600 dark:hover:border-amber-400 dark:hover:text-amber-400 hover:bg-devyellow-100/30 dark:hover:bg-charcoal-800 transition-all shadow-sm hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
                        >
                            Contact Me
                        </a>
                        <a
                            href={profile?.resumeUrl || (profile?.email ? `mailto:${profile.email}?subject=Resume%20Request%20-%20${encodeURIComponent(profile?.name || 'Developer')}` : '#contact')}
                            target={profile?.resumeUrl ? "_blank" : undefined}
                            rel="noreferrer"
                            className="px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700 text-charcoal-700 dark:text-gray-300 hover:border-charcoal-400 hover:text-charcoal-900 dark:hover:text-white transition-all shadow-xs flex items-center gap-2 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
                            title="Download or Request Resume / CV"
                        >
                            <FileText className="w-4 h-4 text-devorange-600 dark:text-amber-400" />
                            <span>Resume / CV</span>
                        </a>
                    </div>

                    {/* Compact Core Technology Stack Badge Strip */}
                    <div className="pt-3 border-t border-gray-100 dark:border-charcoal-800 flex flex-col gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400 dark:text-charcoal-500">
                            Technologies I Work With
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                            {['React', 'Node.js & Express', 'SQLite / Prisma', 'Appwrite Cloud', 'Tailwind CSS', 'Google Gen AI'].map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2.5 py-1 rounded-md bg-white dark:bg-charcoal-900 border border-gray-200/90 dark:border-charcoal-800 text-[11px] font-semibold text-charcoal-700 dark:text-gray-300 shadow-xs"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Smooth 3D Multi-Portrait Visual Showcase */}
                <div className="lg:col-span-5 flex justify-center">
                    <div
                        className="w-full max-w-md"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="relative p-6 sm:p-8 bg-white dark:bg-charcoal-900 rounded-3xl border border-gray-200 dark:border-charcoal-800 shadow-warm-md hover:shadow-warm-lg transition-shadow duration-300">
                            {/* Top Badge */}
                            <div className="absolute -top-3 -right-3 z-40 bg-charcoal-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-warm-md border border-charcoal-700 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-bold text-gray-200">Active Developer</span>
                            </div>

                            {/* Gallery 3D Stage with touch swipe support */}
                            <div
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                className="relative h-[340px] sm:h-96 w-full flex items-center justify-center rounded-2xl bg-white/40 p-4 overflow-hidden touch-pan-y"
                            >
                                {/* Ambient Warm Backlight Glow behind active portrait */}
                                <div className="absolute w-44 sm:w-56 h-64 sm:h-76 bg-gradient-to-tr from-devyellow-400/30 via-devorange-400/25 to-devorange-500/30 rounded-3xl blur-2xl transform transition-all duration-700 pointer-events-none" />

                                {/* Persistent Multi-Portrait Carousel Deck */}
                                {images.map((imgSrc, idx) => {
                                    const style = getCardStyle(idx);
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`absolute w-44 sm:w-56 h-64 sm:h-76 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform rounded-2xl select-none ${style.wrapper}`}
                                        >
                                            <div
                                                className={`w-full h-full rounded-2xl transition-all duration-700 ${style.inner}`}
                                            >
                                                <div className="w-full h-full rounded-[14px] overflow-hidden bg-white relative">
                                                    <img
                                                        src={imgSrc}
                                                        alt={`Julian Agustino portrait ${idx + 1}`}
                                                        width="320"
                                                        height="420"
                                                        loading={idx === 0 ? "eager" : "lazy"}
                                                        fetchPriority={idx === 0 ? "high" : "low"}
                                                        onError={(e) => {
                                                             e.currentTarget.onerror = null;
                                                             e.currentTarget.src = defaultImages[idx % defaultImages.length];
                                                        }}
                                                        className={`w-full h-full object-cover transition-all duration-700 ease-out ${style.img}`}
                                                    />
                                                    <div
                                                        className={`absolute inset-0 bg-gradient-to-t from-charcoal-900/40 via-transparent to-transparent transition-opacity duration-700 pointer-events-none ${style.overlay}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Bottom Card Controls & Indicators */}
                            <div className="mt-5 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-gray-100 shadow-warm-sm flex items-center justify-between">
                                <div>
                                    <h3 className="font-extrabold text-charcoal-900 text-sm">
                                        {profile?.name || 'Julian Agustino'}
                                    </h3>
                                    <p className="text-xs text-charcoal-500 font-medium">{profile?.tagline || 'AI User & Tech Explorer'}</p>
                                </div>

                                {/* Controls: Arrows & Dot Indicators */}
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <button
                                        onClick={handlePrev}
                                        aria-label="Previous photo"
                                        className="w-8 h-8 rounded-lg text-charcoal-500 hover:text-devorange-600 hover:bg-devyellow-100/50 transition-all active:scale-90 flex items-center justify-center touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-1.5 px-1">
                                        {images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentIndex(idx)}
                                                aria-label={`View photo ${idx + 1}`}
                                                className={`h-2 rounded-full transition-all duration-500 ease-out touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500 ${
                                                    idx === currentIndex
                                                        ? 'w-6 bg-gradient-to-r from-devyellow-400 to-devorange-500 shadow-sm'
                                                        : 'w-2 bg-gray-200 hover:bg-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        aria-label="Next photo"
                                        className="w-8 h-8 rounded-lg text-charcoal-500 hover:text-devorange-600 hover:bg-devyellow-100/50 transition-all active:scale-90 flex items-center justify-center touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;