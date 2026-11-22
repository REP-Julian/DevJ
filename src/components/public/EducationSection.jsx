import React, { useState } from 'react';
import {
    GraduationCap,
    Calendar,
    Briefcase,
    BookOpen,
    CheckCircle2,
    Sparkles,
    Building2,
    Clock,
    Award
} from 'lucide-react';

export const EducationSection = ({ education = [], roles = [], research = [] }) => {
    const [activeTab, setActiveTab] = useState('education');

    const defaultEducation = [
        {
            id: 'college',
            institution: 'Quezon City University',
            level: 'College',
            degree: 'Undergraduate Studies',
            period: '2025 - Present',
            status: 'Ongoing',
            isCurrent: true,
            description: 'Pursuing higher education, focusing on software engineering fundamentals, computational systems, and modern technology integration.',
            location: 'Quezon City, Philippines',
            highlights: ['Active Student', 'Software Engineering Focus'],
        },
        {
            id: 'shs',
            institution: 'ACLC College of Commonwealth',
            level: 'Senior High School',
            degree: 'Senior High School Diploma',
            period: '2023 - 2024',
            status: 'Completed',
            isCurrent: false,
            description: 'Completed upper secondary academic coursework with focus on technical foundations, practical computing, and academic excellence.',
            location: 'Quezon City, Philippines',
            highlights: ['Secondary Completion', 'Foundational Tech Prep'],
        },
        {
            id: 'jhs',
            institution: 'Culiat High School',
            level: 'Junior High School',
            degree: 'Junior High School Certificate',
            period: '2019 - 2022',
            status: 'Completed',
            isCurrent: false,
            description: 'General secondary education covering fundamental sciences, mathematics, communication, and introduction to digital literacy.',
            location: 'Quezon City, Philippines',
            highlights: ['Secondary Education', 'STEM Exploration'],
        },
        {
            id: 'elem',
            institution: 'Culiat Elementary School',
            level: 'Elementary School',
            degree: 'Primary Education Graduate',
            period: '2014 - 2019',
            status: 'Completed',
            isCurrent: false,
            description: 'Completed primary basic education with consistent diligence, curiosity for learning, and foundational academic discipline.',
            location: 'Quezon City, Philippines',
            highlights: ['Primary Foundation', 'Early Academic Merit'],
        },
    ];

    const educationData = Array.isArray(education) && education.length > 0 ? education : defaultEducation;

    const defaultRoles = [
        {
            id: 'role-1',
            title: 'Technical Projects & Team Roles',
            subtitle: 'Leadership & Collaborative Experience',
            period: '2024 - Present',
            description: 'Collaborative development across hackathons, team coding initiatives, and student technical projects.',
            tags: ['Team Collaboration', 'Web Development', 'Problem Solving'],
        },
    ];

    const defaultResearch = [
        {
            id: 'res-1',
            title: 'AI & Systems Exploration',
            subtitle: 'Academic Projects & Independent Inquiries',
            period: '2025 - Present',
            description: 'Researching applied artificial intelligence, multimodal agent workflows, and responsive full-stack web architectures.',
            tags: ['Applied AI', 'Agent Workflows', 'Web Performance'],
        },
    ];

    const rolesData = Array.isArray(roles) && roles.length > 0 ? roles : defaultRoles;
    const researchData = Array.isArray(research) && research.length > 0 ? research : defaultResearch;

    return (
        <section id="education" className="py-20 sm:py-24 bg-white dark:bg-charcoal-950 relative overflow-hidden scroll-mt-16 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-devyellow-100 dark:bg-amber-950/40 border border-devyellow-200 dark:border-amber-800/60 text-devorange-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                        <GraduationCap className="w-3.5 h-3.5 text-devorange-500 dark:text-amber-400" />
                        <span>Academic &amp; Professional Growth</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-charcoal-900 dark:text-white tracking-tight">
                        Education, Roles &amp; Research
                    </h2>
                    <p className="text-sm sm:text-base text-charcoal-500 dark:text-gray-400 font-normal leading-relaxed">
                        My complete academic journey, leadership roles, and research pursuits.
                    </p>

                    {/* Navigation Filter Tabs */}
                    <div className="flex items-center justify-center gap-2 pt-4">
                        <div className="inline-flex p-1.5 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-800 shadow-sm">
                            <button
                                type="button"
                                onClick={() => setActiveTab('education')}
                                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                                    activeTab === 'education'
                                        ? 'bg-white dark:bg-charcoal-800 text-devorange-600 dark:text-amber-400 shadow-sm'
                                        : 'text-charcoal-600 dark:text-gray-400 hover:text-charcoal-900 dark:hover:text-white'
                                }`}
                            >
                                <GraduationCap className="w-4 h-4" />
                                <span>Education ({educationData.length})</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('roles')}
                                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                                    activeTab === 'roles'
                                        ? 'bg-white dark:bg-charcoal-800 text-devorange-600 dark:text-amber-400 shadow-sm'
                                        : 'text-charcoal-600 dark:text-gray-400 hover:text-charcoal-900 dark:hover:text-white'
                                }`}
                            >
                                <Briefcase className="w-4 h-4" />
                                <span>Roles &amp; Leadership ({rolesData.length})</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('research')}
                                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                                    activeTab === 'research'
                                        ? 'bg-white dark:bg-charcoal-800 text-devorange-600 dark:text-amber-400 shadow-sm'
                                        : 'text-charcoal-600 dark:text-gray-400 hover:text-charcoal-900 dark:hover:text-white'
                                }`}
                            >
                                <BookOpen className="w-4 h-4" />
                                <span>Research ({researchData.length})</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content: Education Timeline */}
                {activeTab === 'education' && (
                    <div className="max-w-4xl mx-auto relative pt-4">
                        {/* Vertical Spine Line */}
                        <div
                            aria-hidden="true"
                            className="absolute left-6 sm:left-1/2 top-4 bottom-8 -translate-x-1/2 w-1 bg-gradient-to-b from-devorange-400 via-devyellow-400 to-gray-200 dark:to-charcoal-800 rounded-full"
                        />

                        <div className="space-y-8 sm:space-y-12">
                            {educationData.map((item, index) => {
                                const isEven = index % 2 === 0;
                                return (
                                    <div
                                        key={item.id}
                                        className="relative flex flex-col sm:flex-row items-start sm:items-center group"
                                    >
                                        {/* Center Icon Node */}
                                        <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                                            <div
                                                className={`w-11 h-11 rounded-2xl flex items-center justify-center border-4 border-white dark:border-charcoal-950 shadow-warm-md transition-transform duration-300 group-hover:scale-110 ${
                                                    item.isCurrent
                                                        ? 'bg-gradient-to-tr from-devyellow-400 to-devorange-500 text-charcoal-900 shadow-devorange-500/30 ring-4 ring-devorange-200/50 dark:ring-amber-500/20'
                                                        : 'bg-charcoal-900 text-devyellow-400 border-charcoal-800'
                                                }`}
                                            >
                                                <GraduationCap className={`w-5 h-5 ${item.isCurrent ? 'text-charcoal-900' : 'text-devyellow-400'}`} />
                                            </div>
                                        </div>

                                        {/* Content Card Container */}
                                        <div
                                            className={`w-full sm:w-1/2 pl-16 sm:pl-0 ${
                                                isEven ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 sm:ml-auto'
                                            }`}
                                        >
                                            <div
                                                className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 hover:shadow-warm-lg ${
                                                    item.isCurrent
                                                        ? 'bg-gradient-to-br from-white via-orange-50/20 to-devyellow-50/30 dark:from-charcoal-900 dark:via-charcoal-900 dark:to-amber-950/20 border-devorange-300 dark:border-amber-500/40 shadow-warm-md'
                                                        : 'bg-white dark:bg-charcoal-900 border-gray-200/90 dark:border-charcoal-800 hover:border-devorange-200 dark:hover:border-amber-400/50'
                                                }`}
                                            >
                                                {/* Header Badges */}
                                                <div
                                                    className={`flex flex-wrap items-center gap-2 mb-3 ${
                                                        isEven ? 'sm:justify-end' : 'sm:justify-start'
                                                    }`}
                                                >
                                                    <span className="px-2.5 py-0.5 rounded-full bg-devyellow-100 dark:bg-amber-950/50 border border-devyellow-200 dark:border-amber-800/60 text-devorange-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider">
                                                        {item.level}
                                                    </span>
                                                    <span
                                                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                                                            item.isCurrent
                                                                ? 'bg-devorange-500 dark:bg-amber-500 text-white dark:text-charcoal-950 shadow-sm'
                                                                : 'bg-gray-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-gray-300'
                                                        }`}
                                                    >
                                                        {item.isCurrent ? (
                                                            <Clock className="w-3 h-3 animate-pulse" />
                                                        ) : (
                                                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                                        )}
                                                        <span>{item.status}</span>
                                                    </span>
                                                </div>

                                                {/* Institution Name & Degree */}
                                                <h3 className="text-xl sm:text-2xl font-black text-charcoal-900 dark:text-white group-hover:text-devorange-600 dark:group-hover:text-amber-400 transition-colors">
                                                    {item.institution}
                                                </h3>
                                                <p className="text-xs sm:text-sm font-semibold text-devorange-600 dark:text-amber-400 mt-1 flex items-center gap-1.5 sm:inline-flex">
                                                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                                                    <span>{item.degree}</span>
                                                </p>

                                                {/* Year and Location */}
                                                <div
                                                    className={`flex items-center gap-3 text-xs font-medium text-charcoal-500 dark:text-gray-400 my-3 ${
                                                        isEven ? 'sm:justify-end' : 'sm:justify-start'
                                                    }`}
                                                >
                                                    <span className="flex items-center gap-1 font-bold text-charcoal-700 dark:text-gray-300">
                                                        <Calendar className="w-3.5 h-3.5 text-devorange-500 dark:text-amber-400" />
                                                        {item.period}
                                                    </span>
                                                    <span aria-hidden="true" className="text-charcoal-400 dark:text-charcoal-600">&bull;</span>
                                                    <span>{item.location}</span>
                                                </div>

                                                {/* Description */}
                                                <p className="text-xs sm:text-sm text-charcoal-600 dark:text-gray-300 leading-relaxed mb-4">
                                                    {item.description}
                                                </p>

                                                {/* Highlights */}
                                                <div
                                                    className={`flex flex-wrap gap-1.5 ${
                                                        isEven ? 'sm:justify-end' : 'sm:justify-start'
                                                    }`}
                                                >
                                                    {(item.highlights || []).map((h, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-gray-300 text-[11px] font-semibold border border-transparent dark:border-charcoal-700"
                                                        >
                                                            {h}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Content: Roles Tab */}
                {activeTab === 'roles' && (
                    <div className="max-w-5xl mx-auto pt-4">
                        <div className={`grid grid-cols-1 ${rolesData.length > 1 ? 'md:grid-cols-2' : ''} gap-6`}>
                            {rolesData.map((role, idx) => (
                                <div
                                    key={role.id || idx}
                                    className="p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-gray-200/90 dark:border-charcoal-800 shadow-warm-md hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                            <div>
                                                <span className="px-3 py-1 rounded-full bg-devorange-50 dark:bg-amber-950/40 text-devorange-600 dark:text-amber-400 border border-devorange-200 dark:border-amber-800/60 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                                                    <Briefcase className="w-3.5 h-3.5" />
                                                    Leadership &amp; Roles
                                                </span>
                                                <h3 className="text-2xl font-black text-charcoal-900 dark:text-white">
                                                    {role.title}
                                                </h3>
                                                {role.subtitle && (
                                                    <p className="text-sm font-semibold text-devorange-600 dark:text-amber-400 mt-1">
                                                        {role.subtitle}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="self-start sm:self-auto px-3 py-1 rounded-xl bg-gray-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1.5 shrink-0">
                                                <Calendar className="w-3.5 h-3.5 text-devorange-500 dark:text-amber-400" />
                                                {role.period}
                                            </span>
                                        </div>
                                        <p className="text-charcoal-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                                            {role.description}
                                        </p>
                                    </div>
                                    {Array.isArray(role.tags) && role.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-charcoal-800">
                                            {role.tags.map((tag, tIdx) => (
                                                <span
                                                    key={tIdx}
                                                    className="px-3 py-1 rounded-lg bg-charcoal-50 dark:bg-charcoal-800 border border-gray-200 dark:border-charcoal-700 text-charcoal-700 dark:text-gray-300 text-xs font-bold"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content: Research Tab */}
                {activeTab === 'research' && (
                    <div className="max-w-5xl mx-auto pt-4">
                        <div className={`grid grid-cols-1 ${researchData.length > 1 ? 'md:grid-cols-2' : ''} gap-6`}>
                            {researchData.map((item, idx) => (
                                <div
                                    key={item.id || idx}
                                    className="p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-gray-200/90 dark:border-charcoal-800 shadow-warm-md hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                            <div>
                                                <span className="px-3 py-1 rounded-full bg-devyellow-100 dark:bg-amber-950/40 text-charcoal-900 dark:text-amber-400 border border-devyellow-200 dark:border-amber-800/60 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                                                    <BookOpen className="w-3.5 h-3.5 text-devorange-500 dark:text-amber-400" />
                                                    Academic Inquiries
                                                </span>
                                                <h3 className="text-2xl font-black text-charcoal-900 dark:text-white">
                                                    {item.title}
                                                </h3>
                                                {item.subtitle && (
                                                    <p className="text-sm font-semibold text-devorange-600 dark:text-amber-400 mt-1">
                                                        {item.subtitle}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="self-start sm:self-auto px-3 py-1 rounded-xl bg-gray-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1.5 shrink-0">
                                                <Calendar className="w-3.5 h-3.5 text-devorange-500 dark:text-amber-400" />
                                                {item.period}
                                            </span>
                                        </div>
                                        <p className="text-charcoal-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                                            {item.description}
                                        </p>
                                    </div>
                                    {Array.isArray(item.tags) && item.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-charcoal-800">
                                            {item.tags.map((tag, tIdx) => (
                                                <span
                                                    key={tIdx}
                                                    className="px-3 py-1 rounded-lg bg-charcoal-50 dark:bg-charcoal-800 border border-gray-200 dark:border-charcoal-700 text-charcoal-700 dark:text-gray-300 text-xs font-bold"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default EducationSection;
