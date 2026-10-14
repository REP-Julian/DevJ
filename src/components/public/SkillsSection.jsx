import React, { useState } from 'react';
import BrandIcon from '../common/BrandIcon';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const SkillsSection = ({ skills = [] }) => {
    // Standard domain normalization for straightforward grouping
    const getNormalizedDomain = (skill) => {
        const cat = (skill.category || '').toLowerCase();
        const name = (skill.name || '').toLowerCase();

        if (cat.includes('frontend') || name.includes('react') || name.includes('tailwind') || name.includes('css') || name.includes('html')) {
            return 'Frontend';
        }
        if (cat.includes('backend') || name.includes('node') || name.includes('express') || name.includes('python') || name.includes('java') || name.includes('typescript')) {
            return 'Backend & APIs';
        }
        if (cat.includes('database') || cat.includes('cloud') || name.includes('sqlite') || name.includes('sql') || name.includes('appwrite') || name.includes('pinecone')) {
            return 'Databases & Cloud';
        }
        if (cat.includes('ai') || cat.includes('tool') || name.includes('gemini') || name.includes('openai') || name.includes('langchain') || name.includes('ollama') || name.includes('hugging')) {
            return 'AI & Tooling';
        }
        return skill.category || 'Other Technologies';
    };

    // Technologies actively used across Julian's projects
    const projectTechKeywords = ['react', 'tailwind', 'node', 'express', 'sqlite', 'appwrite', 'google gen ai', 'gemini', 'jwt'];
    const isUsedInProjects = (skill) => {
        if (skill.featured) return true;
        const n = (skill.name || '').toLowerCase();
        return projectTechKeywords.some(keyword => n.includes(keyword));
    };

    // Group skills by domain
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
        <section id="skills" className="py-20 sm:py-24 bg-white relative scroll-mt-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-devyellow-100 border border-devyellow-200 text-devorange-600 text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-devorange-500" />
                        <span>Skills &amp; Tech</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-charcoal-900 tracking-tight">
                        Technologies I Work With
                    </h2>
                    <p className="text-sm sm:text-base text-charcoal-500 font-normal leading-relaxed">
                        The languages, frameworks, and developer tools I use to build full-stack web applications.
                    </p>
                </div>

                {/* Filter Tabs */}
                {domains.length > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-10 sm:mb-12">
                        <button
                            type="button"
                            onClick={() => setActiveFilter('All')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500 ${
                                activeFilter === 'All'
                                    ? 'bg-charcoal-900 text-devyellow-400 shadow-sm'
                                    : 'bg-gray-100 hover:bg-gray-200 text-charcoal-600'
                            }`}
                        >
                            All ({skills.length})
                        </button>
                        {domains.map((dom) => (
                            <button
                                key={dom}
                                type="button"
                                onClick={() => setActiveFilter(dom)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500 ${
                                    activeFilter === dom
                                        ? 'bg-charcoal-900 text-devyellow-400 shadow-sm'
                                        : 'bg-gray-100 hover:bg-gray-200 text-charcoal-600'
                                }`}
                            >
                                {dom} ({grouped[dom].length})
                            </button>
                        ))}
                    </div>
                )}

                {/* Domain Sections */}
                <div className="space-y-10 sm:space-y-12">
                    {displayedDomains.map((domain) => {
                        const domainSkills = grouped[domain] || [];

                        return (
                            <div key={domain} className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="w-2.5 h-2.5 rounded-full bg-devorange-500" />
                                    <h3 className="text-lg sm:text-xl font-black text-charcoal-900 tracking-tight">
                                        {domain}
                                    </h3>
                                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-charcoal-500">
                                        {domainSkills.length} tools
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {domainSkills.map((skill) => {
                                        const inProject = isUsedInProjects(skill);
                                        return (
                                            <div
                                                key={skill.id || skill.name}
                                                className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-warm-xs hover:shadow-warm-sm hover:border-devorange-300 transition-all duration-200 flex items-start gap-3.5 group"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 group-hover:scale-105 group-hover:bg-white transition-all shrink-0">
                                                    <BrandIcon name={skill.iconName || skill.name} className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </div>
                                                <div className="min-w-0 flex-1 space-y-1">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h4 className="text-sm font-extrabold text-charcoal-900 group-hover:text-devorange-600 transition-colors truncate">
                                                            {skill.name}
                                                        </h4>
                                                        {inProject && (
                                                            <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-devyellow-100 text-charcoal-800 border border-devyellow-300">
                                                                Used in Projects
                                                            </span>
                                                        )}
                                                    </div>
                                                    {skill.description && (
                                                        <p className="text-xs text-charcoal-500 leading-relaxed font-normal">
                                                            {skill.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
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