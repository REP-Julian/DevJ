import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Terminal, Code2, Flame, ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroSection = ({ profile }) => {
    // Array of distinct images to cycle through
    const defaultImages = [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    ];

    const images = [
        profile?.avatarUrl || defaultImages[0],
        profile?.avatarUrl2 || defaultImages[1],
        profile?.avatarUrl3 || defaultImages[2],
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-switch image every 3.5 seconds with pause on hover
    useEffect(() => {
        if (isHovered) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3500);

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
            className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-devyellow-100/20 to-white"
        >
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-devyellow-300/30 via-devorange-300/20 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                {/* Left Column: Typography & CTAs */}
                <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-devyellow-300 shadow-warm-sm text-xs font-bold text-devorange-600 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-devyellow-500 fill-devyellow-400" />
                        <span>AI Enthusiast & Creative Developer</span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="font-extrabold text-2xl text-devorange-600">DV</span>
                            <span className="text-sm font-semibold tracking-widest uppercase text-charcoal-500">
                                / {profile?.name || 'DevJ'}
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-charcoal-900 tracking-tight leading-[1.1]">
                            Hi, I'm{' '}
                            <span className="bg-gradient-to-r from-charcoal-900 via-devorange-600 to-devyellow-500 bg-clip-text text-transparent">
                                {profile?.name || 'Julian Agustino'}
                            </span>
                        </h1>
                    </div>

                    <p className="text-xl sm:text-2xl font-bold text-charcoal-800 leading-snug">
                        {profile?.tagline ||
                            'Artificial Intelligence Enthusiast, Vibe Developer and Creative Developer'}
                    </p>

                    <p className="text-base sm:text-lg text-charcoal-500 max-w-xl font-normal leading-relaxed">
                        {profile?.description ||
                            'I love turning ideas into interactive experiences and exploring the possibilities of artificial intelligence through creative development.'}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-4">
                        <a
                            href="#projects"
                            className="px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-devyellow-400 via-devorange-400 to-devorange-500 text-charcoal-900 shadow-warm-md hover:shadow-warm-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                        >
                            <span>Explore Works</span>
                            <ArrowRight className="w-4 h-4" />
                        </a>
                        <a
                            href="#contact"
                            className="px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider bg-white border border-gray-200 text-charcoal-800 hover:border-devorange-400 hover:text-devorange-600 hover:bg-devyellow-100/30 transition-all shadow-sm hover:-translate-y-0.5"
                        >
                            Contact Me
                        </a>
                    </div>

                    <div className="pt-8 border-t border-gray-100 flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-semibold text-charcoal-500">
                        <div className="flex items-center gap-1.5">
                            <Terminal className="w-4 h-4 text-devorange-500 shrink-0" /> Modern AI Architecture
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Code2 className="w-4 h-4 text-devyellow-500 shrink-0" /> Interactive Frontend
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-devorange-600 shrink-0" /> Dynamic CMS Driven
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
                        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-white via-devyellow-100/30 to-devorange-100/20 rounded-3xl border border-gray-100 shadow-warm-md hover:shadow-warm-lg transition-shadow duration-300">
                            {/* Top Badge */}
                            <div className="absolute -top-3 -right-3 z-40 bg-charcoal-900 text-white text-xs font-black px-4 py-2 rounded-xl shadow-warm-md border border-devyellow-400 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-devyellow-400 animate-pulse" />
                                <span>Creative Portfolio</span>
                            </div>

                            {/* Gallery 3D Stage with touch swipe support */}
                            <div
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                className="relative h-88 sm:h-96 w-full flex items-center justify-center rounded-2xl bg-white/40 p-4 overflow-hidden touch-pan-y"
                            >
                                {/* Ambient Warm Backlight Glow behind active portrait */}
                                <div className="absolute w-48 sm:w-56 h-64 sm:h-76 bg-gradient-to-tr from-devyellow-400/30 via-devorange-400/25 to-devorange-500/30 rounded-3xl blur-2xl transform transition-all duration-700 pointer-events-none" />

                                {/* Persistent Multi-Portrait Carousel Deck */}
                                {images.map((imgSrc, idx) => {
                                    const style = getCardStyle(idx);
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`absolute w-48 sm:w-56 h-64 sm:h-76 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform rounded-2xl select-none ${style.wrapper}`}
                                        >
                                            <div
                                                className={`w-full h-full rounded-2xl transition-all duration-700 ${style.inner}`}
                                            >
                                                <div className="w-full h-full rounded-[14px] overflow-hidden bg-white relative">
                                                    <img
                                                        src={imgSrc}
                                                        alt={`${profile?.name || 'DevJ'} portrait ${idx + 1}`}
                                                        onError={(e) => {
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
                                        {profile?.name || 'DevJ'}
                                    </h3>
                                    <p className="text-xs text-charcoal-500">AI Engineer & Creative Developer</p>
                                </div>

                                {/* Controls: Arrows & Dot Indicators */}
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <button
                                        onClick={handlePrev}
                                        aria-label="Previous photo"
                                        className="w-8 h-8 rounded-lg text-charcoal-500 hover:text-devorange-600 hover:bg-devyellow-100/50 transition-all active:scale-90 flex items-center justify-center touch-manipulation"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-1.5 px-1">
                                        {images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentIndex(idx)}
                                                aria-label={`View photo ${idx + 1}`}
                                                className={`h-2 rounded-full transition-all duration-500 ease-out touch-manipulation ${
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
                                        className="w-8 h-8 rounded-lg text-charcoal-500 hover:text-devorange-600 hover:bg-devyellow-100/50 transition-all active:scale-90 flex items-center justify-center touch-manipulation"
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