import React from 'react';
import BrandIcon from '../common/BrandIcon';

export const SkillsSection = ({ skills = [] }) => {
    // Group skills by category
    const categories = [...new Set(skills.map((s) => s.category || 'Core Technologies'))];

    return (
        <section id="skills" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-devyellow-100/70 border border-devyellow-200 text-devorange-600 text-xs font-extrabold uppercase tracking-wider">
                        Capabilities & Stack
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-charcoal-900 tracking-tight">
                        Specialized AI & Technical Stack
                    </h2>
                    <p className="text-charcoal-500 text-base">
                        Mastery across frontier artificial intelligence models, agentic workflows, and full-stack software architecture.
                    </p>
                </div>

                {categories.length === 0 ? (
                    <div className="text-center py-12 text-charcoal-500">No skills added yet.</div>
                ) : (
                    categories.map((category) => {
                        const categorySkills = skills.filter((s) => s.category === category);
                        const isAiCategory = category.toLowerCase().includes('ai') || category.toLowerCase().includes('frontier') || category.toLowerCase().includes('specialized');

                        return (
                            <div key={category} className="mb-14 last:mb-0">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className={`w-3 h-3 rounded-full ${isAiCategory ? 'bg-gradient-to-r from-devorange-500 to-pink-500 animate-pulse' : 'bg-devyellow-400'}`} />
                                    <h3 className="text-xl font-extrabold text-charcoal-900 tracking-tight">
                                        {category}
                                    </h3>
                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-charcoal-600">
                                        {categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'technologies'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                                    {categorySkills.map((skill) => {
                                        return (
                                            <div
                                                key={skill.id || skill.name}
                                                className="p-4 sm:p-5 bg-white rounded-2xl border border-gray-200/80 shadow-warm-sm hover:shadow-warm-md hover:border-devorange-300 hover:-translate-y-1 transition-all duration-300 group flex items-center gap-3.5"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center justify-center p-2.5 shadow-sm group-hover:scale-110 group-hover:bg-white transition-all duration-300 flex-shrink-0">
                                                    <BrandIcon name={skill.iconName || skill.name} className="w-7 h-7" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-sm sm:text-base font-extrabold text-charcoal-900 group-hover:text-devorange-600 transition-colors truncate">
                                                        {skill.name}
                                                    </h4>
                                                    <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block truncate">
                                                        {isAiCategory ? 'Frontier AI' : 'Language & Tech'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default SkillsSection;