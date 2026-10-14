import React, { useState } from 'react';
import BrandIcon from '../common/BrandIcon';
import { Layers, Sparkles } from 'lucide-react';

export const SkillsSection = ({ skills = [] }) => {
    // Dynamic domain normalization for clear technical grouping
    const getNormalizedDomain = (skill) => {
        const cat = (skill.category || '').toLowerCase();
        const name = (skill.name || '').toLowerCase();

        if (cat.includes('ai') || cat.includes('frontier') || cat.includes('model') || cat.includes('langchain') || cat.includes('ollama')) {
            return 'AI Systems & LLM Engineering';
        }
        if (name.includes('react') || name.includes('tailwind') || name.includes('css') || name.includes('html') || name.includes('frontend')) {
            return 'Frontend & UI Architecture';
        }
        if (name.includes('node') || name.includes('express') || name.includes('python') || name.includes('java') || name.includes('typescript')) {
            return 'Backend & Distributed Services';
        }
        if (name.includes('sqlite') || name.includes('sql') || name.includes('appwrite') || name.includes('cloud') || name.includes('pinecone') || name.includes('database')) {
            return 'Databases, Cloud & DevOps';
        }
        return skill.category || 'Core Technologies';
    };

    // Group skills
    const grouped = {};
    skills.forEach((s) => {
        const domain = getNormalizedDomain(s);
        if (!grouped[domain]) grouped[domain] = [];
        grouped[domain].push(s);
    });

    const domains = Object.keys(grouped);
    const [activeFilter, setActiveFilter] = useState('All');

    const displayedDomains = activeFilter === 'All' ? domains : [activeFilter];

    return (
        <section id="skills" className="py-24 bg-charcoal-50/40 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-devyellow-100 border border-devyellow-200 text-devorange-600 text-xs font-extrabold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-devorange-500" />
                        <span>Technical Capabilities</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-charcoal-900 tracking-tight">
                        Engineering Stack & Core Competencies
                    </h2>
                    <p className="text-sm sm:text-base text-charcoal-500 font-medium max-w-2xl mx-auto">
                        Competencies proven in production systems—organized by domain, demonstrating hands-on architectural implementations and zero vanity metrics.
                    </p>
                </div>

                {/* Filter Tabs */}
                {domains.length > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                        <button
                            onClick={() => setActiveFilter('All')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                activeFilter === 'All'
                                    ? 'bg-charcoal-900 text-devyellow-400 shadow-sm'
                                    : 'bg-white hover:bg-gray-100 text-charcoal-600 border border-gray-200'
                            }`}
                        >
                            All Capabilities ({skills.length})
                        </button>
                        {domains.map((dom) => (
                            <button
                                key={dom}
                                onClick={() => setActiveFilter(dom)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    activeFilter === dom
                                        ? 'bg-charcoal-900 text-devyellow-400 shadow-sm'
                                        : 'bg-white hover:bg-gray-100 text-charcoal-600 border border-gray-200'
                                }`}
                            >
                                {dom} ({grouped[dom].length})
                            </button>
                        ))}
                    </div>
                )}

                {/* Domain Sections */}
                <div className="space-y-12">
                    {displayedDomains.map((domain) => {
                        const domainSkills = grouped[domain] || [];
                        const isAi = domain.includes('AI');

                        return (
                            <div key={domain} className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`w-2.5 h-2.5 rounded-full ${
                                            isAi ? 'bg-gradient-to-r from-devorange-500 to-amber-500 animate-pulse' : 'bg-charcoal-800'
                                        }`}
                                    />
                                    <h3 className="text-lg sm:text-xl font-black text-charcoal-900 tracking-tight">
                                        {domain}
                                    </h3>
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-charcoal-500">
                                        {domainSkills.length} verified technologies
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {domainSkills.map((skill) => (
                                        <div
                                            key={skill.id || skill.name}
                                            className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-warm-xs hover:shadow-warm-sm hover:border-devorange-300 transition-all duration-200 flex items-start gap-3.5 group"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 group-hover:scale-105 group-hover:bg-white transition-all shrink-0">
                                                <BrandIcon name={skill.iconName || skill.name} className="w-5 h-5 sm:w-6 sm:h-6" />
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-1">
                                                <h4 className="text-sm font-extrabold text-charcoal-900 group-hover:text-devorange-600 transition-colors">
                                                    {skill.name}
                                                </h4>
                                                {skill.description && (
                                                    <p className="text-xs text-charcoal-500 leading-relaxed font-normal">
                                                        {skill.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default SkillsSection;