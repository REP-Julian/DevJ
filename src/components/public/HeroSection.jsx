import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, FileText, CheckCircle2, Terminal, Code2 } from 'lucide-react';

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

    const imageLabels = [
        'ICT Graduate',
        'Developer & AI',
        'Studio Portrait'
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-switch image every 4.5 seconds with pause on hover & reduced-motion check
    useEffect(() => {
        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isHovered || prefersReducedMotion) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4500);

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

    return (
        <section
            id="home"
            className="relative min-h-[94vh] pt-32 pb-20 flex items-center justify-center overflow-hidden warm-mesh-bg bg-gradient-to-b from-white via-devyellow-100/15 to-white"
        >
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-devyellow-300/25 via-devorange-300/15 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center relative z-10">
                {/* Left Column: Typography & CTAs */}
                <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-devorange-200/80 shadow-warm-sm text-xs font-bold text-devorange-600 uppercase tracking-wider">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Full-Stack Developer &bull; Available for Roles</span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="font-extrabold text-2xl text-devorange-600">DV</span>
                            <span className="text-sm font-semibold tracking-widest uppercase text-charcoal-500">
                                / {profile?.name || 'Julian Agustino'}
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-charcoal-900 tracking-tight leading-[1.08]">
                            Hi, I'm{' '}
                            <span className="text-gradient-warm">
                                {profile?.name || 'Julian Agustino'}
                            </span>
                        </h1>
                    </div>

                    <p className="text-xl sm:text-2xl font-bold text-charcoal-800 leading-snug">
                        {profile?.tagline || 'Building clean, practical web applications'}
                    </p>

                    <p className="text-base sm:text-lg text-charcoal-500 max-w-xl font-normal leading-relaxed">
                        {profile?.description ||
                            'I build responsive web applications and developer tools using React, Node.js, and modern APIs. Focused on clean code, good UX, and solving real problems.'}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                        <a
                            href="#projects"
                            className="px-6 sm:px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-devyellow-400 via-devorange-400 to-devorange-500 text-charcoal-900 shadow-warm-md hover:shadow-warm-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500 ring-1 ring-devorange-400/30"
                        >
                            <span>View Projects</span>
                            <ArrowRight className="w-4 h-4" />
                        </a>
                        <a
                            href="#contact"
                            className="px-6 sm:px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider bg-white/90 backdrop-blur-sm border border-gray-200/90 text-charcoal-800 hover:border-devorange-400 hover:text-devorange-600 hover:bg-devyellow-100/30 transition-all duration-200 shadow-xs hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
                        >
                            Contact Me
                        </a>
                        <a
                            href={profile?.resumeUrl || (profile?.email ? `mailto:${profile.email}?subject=Resume%20Request%20-%20${encodeURIComponent(profile?.name || 'Developer')}` : '#contact')}
                            target={profile?.resumeUrl ? "_blank" : undefined}
                            rel="noreferrer"
                            className="px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white/90 backdrop-blur-sm border border-gray-200/90 text-charcoal-700 hover:border-charcoal-400 hover:text-charcoal-900 transition-all duration-200 shadow-xs flex items-center gap-2 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
                            title="Download or Request Resume / CV"
                        >
                            <FileText className="w-4 h-4 text-devorange-600" />
                            <span>Resume / CV</span>
                        </a>
                    </div>

                    {/* Compact Core Technology Stack Badge Strip */}
                    <div className="pt-3 border-t border-gray-100/80 flex flex-col gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
                            Core Technologies
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                            {['React', 'Node.js & Express', 'SQLite / Prisma', 'Appwrite Cloud', 'Tailwind CSS', 'Google Gen AI'].map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200/80 text-[11px] font-semibold text-charcoal-700 shadow-xs hover:border-devorange-300 hover:text-devorange-600 transition-colors"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: 100x Better Studio Pro Developer Showcase */}
                <div className="lg:col-span-5 flex justify-center">
                    <div
                        className="w-full max-w-md relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Ambient Aura Radiance Behind Chassis */}
                        <div className="absolute -inset-2 bg-gradient-to-tr from-devorange-500/30 via-devyellow-400/25 to-devorange-600/30 rounded-[2.8rem] blur-2xl opacity-75 transform -rotate-1 pointer-events-none" />

                        {/* Studio Card Chassis */}
                        <div className="relative rounded-[2.5rem] bg-gradient-to-b from-charcoal-900 via-[#18191E] to-[#121316] p-4 sm:p-5 border border-charcoal-800/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45),0_0_35px_rgba(249,115,22,0.12)] ring-1 ring-white/10">
                            
                            {/* HUD Top Bar */}
                            <div className="flex items-center justify-between pb-3.5 border-b border-white/10 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                    <span className="ml-2 px-2 py-0.5 rounded-md bg-white/5 border border-white/5 font-mono text-[10px] text-gray-400 tracking-tight">
                                        devj.julian / portfolio
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>Live Portfolio</span>
                                </div>
                            </div>

                            {/* Main Portrait Display Stage */}
                            <div
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                className="relative mt-4 aspect-[4/5] w-full rounded-2xl overflow-hidden bg-charcoal-950/80 border border-white/10 shadow-inner group touch-pan-y"
                            >
                                {/* Floating Badge Top-Left: Engineering Credentials */}
                                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal-900/90 backdrop-blur-md border border-white/15 text-white shadow-xl">
                                    <div className="w-5 h-5 rounded-lg bg-devorange-500/20 border border-devorange-400/40 flex items-center justify-center">
                                        <Code2 className="w-3 h-3 text-devorange-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-devyellow-400">
                                            {imageLabels[currentIndex] || 'Full-Stack'}
                                        </span>
                                        <span className="text-[9px] text-gray-300 font-medium leading-none">
                                            Software Engineer
                                        </span>
                                    </div>
                                </div>

                                {/* Floating Badge Bottom-Right: Verified Status */}
                                <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-charcoal-900/90 backdrop-blur-md border border-white/15 text-white shadow-xl">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-[10px] font-bold text-gray-200">
                                        Verified Developer
                                    </span>
                                </div>

                                {/* Active Image Crossfade Showcase */}
                                {images.map((imgSrc, idx) => (
                                    <div
                                        key={idx}
                                        className={`absolute inset-0 transition-all duration-700 ease-out ${
                                            idx === currentIndex
                                                ? 'opacity-100 scale-100 pointer-events-auto'
                                                : 'opacity-0 scale-105 pointer-events-none'
                                        }`}
                                    >
                                        <img
                                            src={imgSrc}
                                            alt={`Julian Agustino - ${imageLabels[idx] || 'Portrait'}`}
                                            width="400"
                                            height="500"
                                            loading={idx === 0 ? "eager" : "lazy"}
                                            fetchPriority={idx === 0 ? "high" : "low"}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = defaultImages[idx % defaultImages.length];
                                            }}
                                            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent opacity-60" />
                                    </div>
                                ))}

                                {/* Overlay Navigation Arrows on Image */}
                                <button
                                    onClick={handlePrev}
                                    aria-label="Previous photo"
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/75 text-white/80 hover:text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    aria-label="Next photo"
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/75 text-white/80 hover:text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Bottom Interactive Thumbnail Selector & Details */}
                            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                                {/* Profile Info */}
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-extrabold text-white text-sm truncate">
                                            {profile?.name || 'Julian Agustino'}
                                        </h3>
                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-devyellow-400 text-charcoal-950 font-black">
                                            DV
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-400 font-medium truncate">
                                        Full-Stack Developer &bull; Quezon City, PH
                                    </p>
                                </div>

                                {/* Interactive Thumbnail Selector Strip */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {images.map((imgSrc, idx) => {
                                        const isActive = idx === currentIndex;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentIndex(idx)}
                                                aria-label={`Switch to photo ${idx + 1}`}
                                                className={`relative w-9 h-11 rounded-lg overflow-hidden transition-all duration-300 ${
                                                    isActive
                                                        ? 'ring-2 ring-devorange-500 scale-105 shadow-md shadow-devorange-500/25 brightness-105'
                                                        : 'opacity-40 hover:opacity-80 ring-1 ring-white/10 grayscale hover:grayscale-0'
                                                }`}
                                            >
                                                <img
                                                    src={imgSrc}
                                                    alt={`Thumb ${idx + 1}`}
                                                    className="w-full h-full object-cover object-top"
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = defaultImages[idx % defaultImages.length];
                                                    }}
                                                />
                                                {isActive && (
                                                    <span className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-devyellow-400 to-devorange-500" />
                                                )}
                                            </button>
                                        );
                                    })}
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