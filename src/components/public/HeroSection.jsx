import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

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
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const deckRef = useRef(null);

    // Auto-switch image every 4.5 seconds when not hovered
    useEffect(() => {
        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isHovered || prefersReducedMotion) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4500);

        return () => clearInterval(timer);
    }, [images.length, isHovered]);

    // Smooth 3D Mouse Parallax
    const handleMouseMove = (e) => {
        if (!deckRef.current) return;
        const rect = deckRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Max tilt of ~10 degrees
        const tiltX = ((centerY - mouseY) / (rect.height / 2)) * 10;
        const tiltY = ((mouseX - centerX) / (rect.width / 2)) * 10;

        setTilt({
            x: Math.min(Math.max(tiltX, -10), 10),
            y: Math.min(Math.max(tiltY, -10), 10),
        });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    // Touch swipe support for mobile
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

    // Card fan geometry and styling
    const getCardStyle = (idx) => {
        const total = images.length;
        const offset = (idx - currentIndex + total) % total;

        // Center Active Card
        if (offset === 0) {
            return {
                wrapper: 'z-30 opacity-100 scale-100 translate-x-0 rotate-0 cursor-default pointer-events-auto',
                inner: 'p-[3px] bg-gradient-to-tr from-devyellow-400 via-devorange-400 to-devorange-500 shadow-[0_20px_50px_-10px_rgba(249,115,22,0.32),0_10px_25px_-5px_rgba(0,0,0,0.08)] ring-4 ring-white/90',
                img: 'grayscale-0 brightness-100 contrast-[1.02]',
                overlay: 'opacity-10',
            };
        }

        // Right Fan Card
        if (offset === 1) {
            return {
                wrapper: 'z-10 opacity-60 hover:opacity-95 scale-[0.86] translate-x-20 sm:translate-x-28 md:translate-x-32 rotate-6 hover:rotate-3 cursor-pointer pointer-events-auto',
                inner: 'p-[2px] bg-white/95 border border-gray-200/90 shadow-xl hover:shadow-2xl hover:border-devorange-300',
                img: 'grayscale-[50%] brightness-95 hover:grayscale-0 hover:brightness-100',
                overlay: 'opacity-30',
            };
        }

        // Left Fan Card
        if (offset === total - 1) {
            return {
                wrapper: 'z-10 opacity-60 hover:opacity-95 scale-[0.86] -translate-x-20 sm:-translate-x-28 md:-translate-x-32 -rotate-6 hover:-rotate-3 cursor-pointer pointer-events-auto',
                inner: 'p-[2px] bg-white/95 border border-gray-200/90 shadow-xl hover:shadow-2xl hover:border-devorange-300',
                img: 'grayscale-[50%] brightness-95 hover:grayscale-0 hover:brightness-100',
                overlay: 'opacity-30',
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

                {/* Right Column: Sleek 3D Floating Tilt Deck */}
                <div className="lg:col-span-5 flex justify-center perspective-1000">
                    <div
                        ref={deckRef}
                        onMouseMove={handleMouseMove}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                            transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                        className="w-full max-w-md relative select-none transform-style-3d"
                    >
                        {/* Ambient Golden Warm Aura Behind Deck */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-devyellow-400/30 via-devorange-400/25 to-devorange-500/30 rounded-[3rem] blur-3xl opacity-70 pointer-events-none" />

                        {/* Outer Glass Card Stage */}
                        <div className="relative p-6 sm:p-8 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/80 shadow-[0_20px_50px_-15px_rgba(234,88,12,0.12),0_10px_20px_-5px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_-12px_rgba(234,88,12,0.2)] transition-shadow duration-300">
                            
                            {/* Floating Top Badge */}
                            <div className="absolute -top-3.5 right-6 z-40 bg-charcoal-900 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-warm-md border border-devyellow-400/70 flex items-center gap-1.5 tracking-wide">
                                <Sparkles className="w-3.5 h-3.5 text-devyellow-400 fill-devyellow-400" />
                                <span>Developer Portfolio</span>
                            </div>

                            {/* 3D Multi-Portrait Fan Stage */}
                            <div
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                className="relative h-[340px] sm:h-[380px] w-full flex items-center justify-center overflow-visible rounded-2xl touch-pan-y"
                            >
                                {/* Inner Radial Ambient Light Beam */}
                                <div className="absolute w-48 sm:w-60 h-68 sm:h-80 bg-gradient-to-tr from-devyellow-400/35 via-devorange-400/30 to-devorange-500/30 rounded-3xl blur-2xl transform transition-all duration-700 pointer-events-none" />

                                {/* Persistent Multi-Portrait Card Fan */}
                                {images.map((imgSrc, idx) => {
                                    const style = getCardStyle(idx);
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`absolute w-48 sm:w-60 h-68 sm:h-80 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform rounded-3xl select-none ${style.wrapper}`}
                                        >
                                            <div
                                                className={`w-full h-full rounded-3xl transition-all duration-700 ${style.inner}`}
                                            >
                                                <div className="w-full h-full rounded-[21px] overflow-hidden bg-charcoal-900 relative">
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
                                                        className={`absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent transition-opacity duration-700 pointer-events-none ${style.overlay}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Bottom Card Controls & Indicators */}
                            <div className="mt-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-gray-100/90 shadow-warm-sm flex items-center justify-between">
                                <div className="min-w-0 pr-2">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-extrabold text-charcoal-900 text-sm truncate">
                                            {profile?.name || 'Julian Agustino'}
                                        </h3>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    </div>
                                    <p className="text-xs text-charcoal-500 font-medium truncate">
                                        Full-Stack Developer
                                    </p>
                                </div>

                                {/* Controls: Arrows & Active Indicator Pills */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        onClick={handlePrev}
                                        aria-label="Previous photo"
                                        className="w-8 h-8 rounded-xl text-charcoal-600 hover:text-devorange-600 hover:bg-devyellow-100/60 transition-all active:scale-90 flex items-center justify-center touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-1 px-1">
                                        {images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentIndex(idx)}
                                                aria-label={`View photo ${idx + 1}`}
                                                className={`h-2 rounded-full transition-all duration-500 ease-out touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500 ${
                                                    idx === currentIndex
                                                        ? 'w-6 bg-gradient-to-r from-devyellow-400 to-devorange-500 shadow-xs'
                                                        : 'w-2 bg-gray-200 hover:bg-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        aria-label="Next photo"
                                        className="w-8 h-8 rounded-xl text-charcoal-600 hover:text-devorange-600 hover:bg-devyellow-100/60 transition-all active:scale-90 flex items-center justify-center touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
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