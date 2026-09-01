import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Terminal, Code2, Flame } from 'lucide-react';

export const HeroSection = ({ profile }) => {
    // Array of images to cycle through every 2 seconds
    const images = [
        profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        profile?.avatarUrl2 || profile?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        profile?.avatarUrl3 || profile?.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-switch image every 2 seconds (2000ms)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000);

        return () => clearInterval(timer);
    }, [images.length]);

    const leftIndex = (currentIndex - 1 + images.length) % images.length;
    const rightIndex = (currentIndex + 1) % images.length;

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
                            View My Projects <ArrowRight className="w-4 h-4" />
                        </a>
                        <a
                            href="#contact"
                            className="px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider bg-white border border-gray-200 text-charcoal-800 hover:border-devorange-400 hover:text-devorange-600 hover:bg-devyellow-100/30 transition-all shadow-sm hover:-translate-y-0.5"
                        >
                            Contact Me
                        </a>
                    </div>

                    <div className="pt-8 border-t border-gray-100 flex items-center gap-6 text-xs font-semibold text-charcoal-500">
                        <div className="flex items-center gap-1.5">
                            <Terminal className="w-4 h-4 text-devorange-500" /> Modern AI Architecture
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Code2 className="w-4 h-4 text-devyellow-500" /> Interactive Frontend
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-devorange-600" /> Dynamic CMS Driven
                        </div>
                    </div>
                </div>

                {/* Right Column: Clean Multi-Portrait Visual Showcase */}
                <div className="lg:col-span-5 flex justify-center">
                    <div className="w-full max-w-md">
                        <div className="relative p-6 bg-gradient-to-br from-white via-devyellow-100/30 to-devorange-100/20 rounded-3xl border border-gray-100 shadow-warm-md hover:shadow-warm-lg transition-shadow duration-300">
                            {/* Top Badge */}
                            <div className="absolute -top-3 -right-3 z-40 bg-charcoal-900 text-white text-xs font-black px-4 py-2 rounded-xl shadow-warm-md border border-devyellow-400 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-devyellow-400 animate-pulse" />
                                <span>Creative Portfolio</span>
                            </div>

                            {/* Clean Gallery Stage */}
                            <div className="relative h-80 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-white/60">
                                {/* Left Background Card */}
                                <div className="absolute left-2 w-40 h-56 rounded-xl overflow-hidden opacity-40 scale-90 transition-all duration-700 ease-in-out border border-gray-200 shadow-sm">
                                    <img
                                        src={images[leftIndex]}
                                        alt="Previous portrait"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
                                        }}
                                        className="w-full h-full object-cover grayscale brightness-95"
                                    />
                                </div>

                                {/* Right Background Card */}
                                <div className="absolute right-2 w-40 h-56 rounded-xl overflow-hidden opacity-40 scale-90 transition-all duration-700 ease-in-out border border-gray-200 shadow-sm">
                                    <img
                                        src={images[rightIndex]}
                                        alt="Next portrait"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80';
                                        }}
                                        className="w-full h-full object-cover grayscale brightness-95"
                                    />
                                </div>

                                {/* Active Foreground Image */}
                                <div className="relative z-30 w-52 h-68 rounded-2xl overflow-hidden shadow-warm-md border-2 border-white bg-gradient-to-tr from-devyellow-300 via-devorange-400 to-devorange-500 p-1 transition-all duration-500">
                                    <img
                                        key={currentIndex}
                                        src={images[currentIndex]}
                                        alt={profile?.name || 'DevJ'}
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
                                        }}
                                        className="w-full h-full object-cover rounded-xl transition-opacity duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 via-transparent to-transparent pointer-events-none rounded-xl" />
                                </div>
                            </div>

                            {/* Bottom Card Controls & Indicators */}
                            <div className="mt-5 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-gray-100 shadow-warm-sm flex items-center justify-between">
                                <div>
                                    <h3 className="font-extrabold text-charcoal-900 text-sm">
                                        {profile?.name || 'DevJ'}
                                    </h3>
                                    <p className="text-xs text-charcoal-500">AI Engineer & Creative Developer</p>
                                </div>

                                {/* Dot Indicators */}
                                <div className="flex items-center gap-1.5">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            aria-label={`View photo ${idx + 1}`}
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                idx === currentIndex
                                                    ? 'w-6 bg-devorange-500'
                                                    : 'w-2 bg-gray-200 hover:bg-gray-300'
                                            }`}
                                        />
                                    ))}
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