import React, { useState, useEffect } from 'react';
import {
    GraduationCap,
    Calendar,
    Briefcase,
    BookOpen,
    CheckCircle2,
    Sparkles,
    Building2,
    Clock,
    Award,
    ArrowUpRight,
    X,
    FileText,
    BarChart3,
    Layers,
    Tag
} from 'lucide-react';

export const EducationSection = ({ education = [], roles = [], research = [] }) => {
    const [activeTab, setActiveTab] = useState('education');
    const [activeResearchModal, setActiveResearchModal] = useState(null);

    // Escape key listener for Research Modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setActiveResearchModal(null);
            }
        };

        if (activeResearchModal) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeResearchModal]);

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
            title: 'Utilizing Recycled Plastic Waste and Fly Ash for Low-Cost, Sustainable Urban Paving',
            subtitle: 'Science, Technology, and Society Investigatory Project',
            period: '2025',
            description: 'The Science, Technology, and Society investigatory project titled Evaluating Recycled Plastic, Fly Ash, and Hair Strands for Sustainable Urban Paving at QCU Batasan Campus evaluated the physical performance and cost efficiency of composite paving blocks at Quezon City University. Formulated experimental blocks using 40% cement, 40% sand, 10% fly ash, 5% recycled low-density polyethylene (LDPE) plastic, and 5% human hair strands, tested against standard commercial hardware bricks. In 2-meter drop tests, experimental blocks sustained an average of 28 drops before failure (n=2, p=0.0528 showing no statistically significant difference from commercial benchmarks). During submersion testing, the composite block absorbed 236.59 ml of water across 4 hours and 56 minutes (26 minutes slower than commercial bricks at 4h 30m), demonstrating superior moisture resistance. Composite blocks achieved a production cost of 20 PHP per unit compared to 25 PHP for commercial bricks, saving 5 PHP per unit and attaining a 20% cost efficiency gain for campus pedestrian walkways.',
            tags: ['Sustainable Materials', 'Urban Engineering', 'Experimental Study', 'Cost Efficiency'],
            highlights: ['20% Cost Efficiency', '4h 56m Water Resistance', '28 Drop Durability', 'LDPE Recycling'],
        },
        {
            id: 'res-2',
            title: 'Digital Divide And Its Impact On Academic Performance Among Senior High School At ACLC College Of Commonwealth',
            subtitle: 'Quantitative Correlational Research Study',
            period: '2024 - 2025',
            description: 'A quantitative correlational research study surveying 100 randomly selected Grade 11 and Grade 12 students at ACLC College of Commonwealth to evaluate how digital infrastructure disparities affect student scholastic achievement. Empirical findings indicated that 90% of respondents had employed parents, with 40% of households falling into the lowest income bracket of ₱1,000 to ₱5,000. While students demonstrated functional device access (mean 3.08) and mobile data utilization (mean 3.03), pervasive structural hurdles persisted: online assignment technical barriers (mean 3.13), frequent internet dropouts (mean 2.93), device sharing within families (mean 2.67), and absence of dedicated personal laptops (mean 2.26). Inferential statistical analysis revealed a moderate negative correlation between digital divide severity and student academic performance (r = -0.3785, p < 0.05), confirming that hardware deficits and unstable bandwidth significantly depress remote learning outcomes.',
            tags: ['Educational Technology', 'Statistical Analysis', 'Quantitative Survey', 'Digital Divide'],
            highlights: ['n = 100 Survey Sample', 'r = -0.3785 Correlation', 'ACLC Commonwealth', 'Socioeconomic Analysis'],
        },
        {
            id: 'res-3',
            title: 'PawTrack: Pet Adoption and Wellness Management System',
            subtitle: 'Applied Systems Architecture & Shelter Workflow Research',
            period: '2025',
            description: 'An applied systems architecture and software engineering inquiry into centralized animal rescue records, digital intake tracking, and medical event logging. Evaluates relational data normalization against document store workflows for municipal pet shelters, focusing on rapid multi-status query responsiveness, vaccination record integrity, and volunteer adoption coordination efficiency.',
            tags: ['Information Systems', 'Database Architecture', 'Shelter Workflow', 'Full-Stack Integration'],
            highlights: ['Relational Data Normalization', 'Real-Time Medical Logging', 'Adoption Workflow Optimization'],
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

                {/* Content: Education Timeline (Left-Aligned Linear Track) */}
                {activeTab === 'education' && (
                    <div className="max-w-3xl mx-auto pt-4">
                        <div className="space-y-6 sm:space-y-8">
                            {educationData.map((item, index) => {
                                const isLast = index === educationData.length - 1;
                                return (
                                    <div
                                        key={item.id}
                                        className="relative flex items-start gap-4 sm:gap-6 group"
                                    >
                                        {/* Spine & Node Column */}
                                        <div className="flex flex-col items-center self-stretch shrink-0 pt-1">
                                            {/* Node */}
                                            <div
                                                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border-2 sm:border-4 border-white dark:border-charcoal-950 shadow-warm-md transition-all duration-300 group-hover:scale-110 z-10 shrink-0 ${
                                                    item.isCurrent
                                                        ? 'bg-gradient-to-tr from-devyellow-400 to-devorange-500 text-charcoal-900 shadow-devorange-500/30 ring-4 ring-devorange-200/50 dark:ring-amber-500/20'
                                                        : 'bg-charcoal-900 text-devyellow-400 border-charcoal-800'
                                                }`}
                                            >
                                                <GraduationCap className={`w-5 h-5 sm:w-6 sm:h-6 ${item.isCurrent ? 'text-charcoal-900' : 'text-devyellow-400'}`} />
                                            </div>

                                            {/* Continuous Connecting Line to next item */}
                                            {!isLast && (
                                                <div
                                                    aria-hidden="true"
                                                    className="w-0.5 flex-1 my-2 bg-gradient-to-b from-devorange-400 via-devyellow-400/80 to-gray-200 dark:to-charcoal-800 rounded-full"
                                                />
                                            )}
                                        </div>

                                        {/* Content Card Container */}
                                        <div className="flex-1 pb-2">
                                            <div
                                                className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 hover:shadow-warm-lg ${
                                                    item.isCurrent
                                                        ? 'bg-gradient-to-br from-white via-orange-50/20 to-devyellow-50/30 dark:from-charcoal-900 dark:via-charcoal-900 dark:to-amber-950/20 border-devorange-400 dark:border-amber-500/50 shadow-warm-md ring-1 ring-devorange-400/20 dark:ring-amber-500/20'
                                                        : 'bg-white dark:bg-charcoal-900 border-gray-200/90 dark:border-charcoal-800 hover:border-devorange-200 dark:hover:border-amber-400/50'
                                                }`}
                                            >
                                                {/* Header Badges & Period */}
                                                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                                    <div className="flex flex-wrap items-center gap-2">
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
                                                            <span>{item.isCurrent ? 'Ongoing' : 'Completed'}</span>
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-600 dark:text-gray-300">
                                                        <Calendar className="w-3.5 h-3.5 text-devorange-500 dark:text-amber-400" />
                                                        <span>{item.period}</span>
                                                    </div>
                                                </div>

                                                {/* Institution Name & Degree */}
                                                <h3 className="text-xl sm:text-2xl font-black text-charcoal-900 dark:text-white group-hover:text-devorange-600 dark:group-hover:text-amber-400 transition-colors">
                                                    {item.institution}
                                                </h3>

                                                {/* Degree and Location */}
                                                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-devorange-600 dark:text-amber-400 mt-1 mb-3">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                                                        <span>{item.degree}</span>
                                                    </span>
                                                    <span aria-hidden="true" className="text-charcoal-300 dark:text-charcoal-700">&bull;</span>
                                                    <span className="text-charcoal-500 dark:text-gray-400 font-medium">{item.location}</span>
                                                </div>

                                                {/* Description */}
                                                <p className="text-xs sm:text-sm text-charcoal-600 dark:text-gray-300 leading-relaxed mb-4">
                                                    {item.description}
                                                </p>

                                                {/* Highlights */}
                                                <div className="flex flex-wrap gap-1.5">
                                                    {(item.highlights || []).map((h, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-gray-300 text-xs font-medium border border-transparent dark:border-charcoal-700"
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
                    <div className="max-w-7xl mx-auto pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {researchData.map((item, idx) => (
                                <article
                                    key={item.id || idx}
                                    className="glow-card flex flex-col justify-between p-7 rounded-3xl bg-white dark:bg-charcoal-900 border border-gray-200/90 dark:border-charcoal-800 shadow-warm-xs hover:shadow-warm-md hover:border-devorange-300 dark:hover:border-amber-400/50 transition-all duration-300 group hover:-translate-y-1"
                                >
                                    <div>
                                        {/* Card Header: Category & Period */}
                                        <div className="flex items-center justify-between gap-2 mb-3.5">
                                            <span className="px-2.5 py-1 rounded-full bg-devyellow-100 dark:bg-amber-950/40 text-charcoal-900 dark:text-amber-400 border border-devyellow-200 dark:border-amber-800/60 text-[11px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                                                <BookOpen className="w-3 h-3 text-devorange-500 dark:text-amber-400" />
                                                <span>Academic Inquiry</span>
                                            </span>
                                            <span className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1.5 shrink-0">
                                                <Calendar className="w-3.5 h-3.5 text-devorange-500 dark:text-amber-400" />
                                                {item.period}
                                            </span>
                                        </div>

                                        {/* Paper Title */}
                                        <h3
                                            onClick={() => setActiveResearchModal(item)}
                                            className="text-lg sm:text-xl font-black text-charcoal-900 dark:text-white group-hover:text-devorange-600 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-2 cursor-pointer"
                                            title={item.title}
                                        >
                                            {item.title}
                                        </h3>

                                        {/* Subtitle / Venue */}
                                        {item.subtitle && (
                                            <p className="text-xs font-bold text-devorange-600 dark:text-amber-400 mt-1 line-clamp-1">
                                                {item.subtitle}
                                            </p>
                                        )}

                                        {/* Abstract Snippet (Clamped to 3 lines for clean scannability) */}
                                        <p className="text-xs sm:text-sm text-charcoal-600 dark:text-gray-300 leading-relaxed my-3.5 line-clamp-3">
                                            {item.description}
                                        </p>

                                        {/* Key Findings Highlights Strip */}
                                        {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {item.highlights.slice(0, 3).map((hl, hIdx) => (
                                                    <span
                                                        key={hIdx}
                                                        className="px-2 py-0.5 rounded-md bg-devyellow-50 dark:bg-amber-950/40 text-devorange-700 dark:text-amber-300 border border-devyellow-200/70 dark:border-amber-800/60 text-[10px] font-extrabold tracking-tight inline-flex items-center gap-1"
                                                    >
                                                        <BarChart3 className="w-2.5 h-2.5 text-devorange-500 dark:text-amber-400" />
                                                        <span>{hl}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Bar: Modal Trigger & Taxonomy Tags */}
                                    <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-charcoal-800">
                                        <button
                                            type="button"
                                            onClick={() => setActiveResearchModal(item)}
                                            className="w-full py-2.5 px-3 rounded-xl bg-charcoal-900 dark:bg-charcoal-800 hover:bg-black dark:hover:bg-charcoal-700 text-devyellow-400 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:bg-devorange-500 group-hover:text-white dark:group-hover:bg-amber-400 dark:group-hover:text-charcoal-950"
                                        >
                                            <span>Read Paper &amp; Findings</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </button>

                                        {Array.isArray(item.tags) && item.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {item.tags.map((tag, tIdx) => (
                                                    <span
                                                        key={tIdx}
                                                        className="px-2 py-0.5 rounded-md bg-charcoal-50 dark:bg-charcoal-800/80 border border-gray-200/70 dark:border-charcoal-700 text-charcoal-600 dark:text-gray-400 text-[10px] font-semibold"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Research Paper & Findings Details Modal */}
            {activeResearchModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/85 backdrop-blur-md select-none animate-in fade-in duration-200"
                    onClick={() => setActiveResearchModal(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="research-modal-title"
                >
                    <div
                        className="animate-popup-zoom relative max-w-3xl w-full max-h-[92vh] bg-white dark:bg-charcoal-900 rounded-3xl border border-gray-200 dark:border-charcoal-800 shadow-2xl overflow-y-auto flex flex-col select-text"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 dark:border-charcoal-800 flex items-center justify-between z-10">
                            <div className="flex items-center gap-2.5 min-w-0 pr-3">
                                <span className="px-2.5 py-0.5 rounded-full bg-devyellow-100 dark:bg-amber-950/40 text-charcoal-900 dark:text-amber-400 text-xs font-black uppercase tracking-wider shrink-0 border border-devyellow-200 dark:border-amber-800/60 inline-flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5 text-devorange-500 dark:text-amber-400" />
                                    <span>Research Paper</span>
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-gray-300 text-xs font-bold">
                                    {activeResearchModal.period}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveResearchModal(null)}
                                aria-label="Close research paper details"
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-charcoal-800 text-charcoal-500 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 sm:p-8 space-y-6">
                            {/* Title & Subtitle */}
                            <div className="space-y-2">
                                <h3 id="research-modal-title" className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal-900 dark:text-white leading-tight">
                                    {activeResearchModal.title}
                                </h3>
                                {activeResearchModal.subtitle && (
                                    <p className="text-sm sm:text-base font-bold text-devorange-600 dark:text-amber-400 flex items-center gap-2">
                                        <FileText className="w-4 h-4 shrink-0" />
                                        <span>{activeResearchModal.subtitle}</span>
                                    </p>
                                )}
                            </div>

                            {/* Quantitative Findings & Key Metrics Highlight Bar */}
                            {Array.isArray(activeResearchModal.highlights) && activeResearchModal.highlights.length > 0 && (
                                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-devyellow-50/60 via-amber-50/40 to-devorange-50/30 dark:from-charcoal-850 dark:via-charcoal-850 dark:to-charcoal-850 border border-devyellow-200/80 dark:border-amber-800/40 space-y-2.5">
                                    <div className="text-xs font-black uppercase tracking-wider text-devorange-700 dark:text-amber-400 flex items-center gap-1.5">
                                        <BarChart3 className="w-3.5 h-3.5" />
                                        <span>Key Metrics &amp; Empirical Findings</span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                                        {activeResearchModal.highlights.map((hl, idx) => (
                                            <div
                                                key={idx}
                                                className="p-2.5 bg-white/90 dark:bg-charcoal-900/90 rounded-xl border border-devyellow-200/60 dark:border-charcoal-700 text-center shadow-2xs"
                                            >
                                                <div className="text-xs sm:text-sm font-black text-charcoal-900 dark:text-white">
                                                    {hl}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Full Abstract & Findings Section */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 dark:text-charcoal-500">
                                    Abstract &amp; Investigatory Details
                                </h4>
                                <div className="text-sm sm:text-base text-charcoal-700 dark:text-gray-300 leading-relaxed font-normal space-y-4">
                                    <p className="whitespace-pre-line">
                                        {activeResearchModal.description}
                                    </p>
                                </div>
                            </div>

                            {/* Methodology & Domain Taxonomy Tags */}
                            {Array.isArray(activeResearchModal.tags) && activeResearchModal.tags.length > 0 && (
                                <div className="pt-4 border-t border-gray-100 dark:border-charcoal-800 space-y-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400 dark:text-charcoal-500 block">
                                        Methodology &amp; Subject Areas
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {activeResearchModal.tags.map((tag, tIdx) => (
                                            <span
                                                key={tIdx}
                                                className="px-3 py-1 rounded-xl bg-gray-100 dark:bg-charcoal-800 border border-gray-200 dark:border-charcoal-700 text-charcoal-700 dark:text-gray-300 text-xs font-bold inline-flex items-center gap-1.5"
                                            >
                                                <Tag className="w-3 h-3 text-devorange-500 dark:text-amber-400" />
                                                <span>{tag}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Footer Action */}
                            <div className="pt-4 border-t border-gray-100 dark:border-charcoal-800 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setActiveResearchModal(null)}
                                    className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-charcoal-900 dark:bg-amber-400 hover:bg-black dark:hover:bg-amber-300 text-devyellow-400 dark:text-charcoal-950 transition-all shadow-sm"
                                >
                                    Close Paper View
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default EducationSection;
