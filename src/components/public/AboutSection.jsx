import React from 'react';
import { User, Code2, Layers, Sparkles, ArrowRight, Heart } from 'lucide-react';

export const AboutSection = ({ profile = {} }) => {
    const approachPillars = [
        {
            icon: Code2,
            title: 'Clean & Maintainable',
            description: 'I favor simple solutions over over-engineering. Writing readable, modular code that is easy to extend and debug.',
        },
        {
            icon: Layers,
            title: 'Full-Stack Practicality',
            description: 'Comfortable working across the frontend and backend—from responsive React components to Express endpoints and SQLite databases.',
        },
        {
            icon: Sparkles,
            title: 'Pragmatic AI Tooling',
            description: 'Experimenting with LLMs and multimodal vision to build features that genuinely help users, not just follow hype.',
        },
    ];

    return (
        <section id="about" className="py-20 sm:py-24 bg-charcoal-50/50 relative scroll-mt-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-devyellow-100 border border-devyellow-200 text-devorange-600 text-xs font-bold uppercase tracking-wider">
                        <User className="w-3.5 h-3.5 text-devorange-500" />
                        <span>About Me</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-charcoal-900 tracking-tight">
                        Who I Am &amp; How I Work
                    </h2>
                    <p className="text-sm sm:text-base text-charcoal-500 font-normal leading-relaxed">
                        A quick look at my background, development philosophy, and what drives my work.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Personal Introduction Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-warm-sm space-y-4">
                        <h3 className="text-xl sm:text-2xl font-black text-charcoal-900">
                            Hi there, I'm Julian.
                        </h3>
                        <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed font-normal">
                            {profile.about ||
                                "I'm a full-stack developer who enjoys building practical web applications, experimenting with AI integrations, and learning new tools. My approach is simple: write clean code, keep the interface minimal, and focus on solving real problems."}
                        </p>
                        <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed font-normal">
                            I like working with modern web technologies like React, Node.js, Express, SQLite, and Appwrite. Whether I'm building a shelter management app or a developer workspace tool, I care about performance, clean visual hierarchy, and creating something people genuinely enjoy using.
                        </p>
                        <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-charcoal-500">
                            <Heart className="w-4 h-4 text-devorange-500" />
                            <span>Also passionate about architectural photography, music production, and experimenting with local LLMs.</span>
                        </div>
                    </div>

                    {/* 3 Approach Pillars */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {approachPillars.map((pillar, idx) => {
                            const IconComponent = pillar.icon;
                            return (
                                <div
                                    key={idx}
                                    className="p-6 bg-white rounded-2xl border border-gray-200/80 shadow-warm-xs hover:shadow-warm-sm hover:border-devorange-300 transition-all duration-200 space-y-3"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-devyellow-100/70 border border-devyellow-300 flex items-center justify-center text-devorange-600">
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-base font-bold text-charcoal-900">
                                        {pillar.title}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-normal">
                                        {pillar.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
