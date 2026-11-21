import React from 'react';
import { ArrowRight, Sparkles, FileText, CheckCircle2, Code2, Award } from 'lucide-react';

export const HeroSection = ({ profile }) => {
    // Cutout portrait with background removed, displayed flat on hero
    const cutoutImage = profile?.cutoutUrl || '/julian-cutout.png';

    return (
        <section
            id="home"
            className="relative min-h-[94vh] pt-32 pb-16 lg:pb-24 flex items-center justify-center overflow-hidden warm-mesh-bg bg-gradient-to-b from-white via-devyellow-100/15 to-white"
        >
            {/* Ambient Warm Aura */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-devyellow-300/25 via-devorange-300/15 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
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

                {/* Right Column: Flat Cutout Portrait (No Cards, Seamless Integration) */}
                <div className="lg:col-span-5 flex justify-center items-center relative">
                    <div className="relative w-full max-w-sm sm:max-w-md flex flex-col items-center justify-center">
                        {/* Ambient Glow Halo Behind Subject */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-88 h-72 sm:h-88 bg-gradient-to-tr from-devyellow-400/35 via-devorange-400/25 to-devorange-500/20 rounded-full blur-3xl pointer-events-none" />

                        {/* Floating Status Pill Top-Left */}
                        <div className="absolute top-4 -left-2 sm:-left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-gray-200/80 shadow-warm-sm text-charcoal-900">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-black tracking-wide">ICT Graduate</span>
                        </div>

                        {/* Floating Credential Pill Bottom-Right */}
                        <div className="absolute bottom-6 -right-2 sm:-right-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-devyellow-300/80 shadow-warm-md text-charcoal-900">
                            <Sparkles className="w-3.5 h-3.5 text-devorange-500 fill-devyellow-400" />
                            <span className="text-xs font-black">Full-Stack Engineer</span>
                        </div>

                        {/* Flat Cutout Portrait with Natural Depth Shadow */}
                        <div className="relative z-10 w-full flex justify-center">
                            <img
                                src={cutoutImage}
                                alt={profile?.name || 'Julian Agustino'}
                                width="440"
                                height="600"
                                loading="eager"
                                fetchPriority="high"
                                className="w-auto h-[380px] sm:h-[460px] lg:h-[500px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] transition-transform duration-500 hover:scale-[1.02]"
                            />
                        </div>

                        {/* Subtle Ground Shadow Baseline */}
                        <div className="w-48 sm:w-64 h-4 bg-charcoal-900/10 rounded-full blur-md -mt-3 z-0 pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;