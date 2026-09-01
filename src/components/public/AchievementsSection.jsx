import React, { useState, useEffect } from 'react';
import { Award, Calendar, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export const AchievementsSection = ({ achievements = [] }) => {
    const defaultAchievements = [
        {
            id: '1',
            title: 'Global AI Innovation Hackathon Winner',
            category: 'Hackathon Award',
            date: '2025',
            description: 'Built a real-time multimodal autonomous assistant agent integrating computer vision and dynamic voice modulation.',
            imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80',
            order: 1,
        },
        {
            id: '2',
            title: 'Creative Frontend Excellence Award',
            category: 'Design Recognition',
            date: '2024',
            description: 'Awarded top honors for designing immersive web interfaces balancing high frame-rate rendering and minimal accessibility compliance.',
            imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
            order: 2,
        },
        {
            id: '3',
            title: 'Full Stack Systems Certification',
            category: 'Industry Certification',
            date: '2023',
            description: 'Validated mastery of distributed microservices, secure cryptographic tokens, and scalable cloud databases.',
            imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
            order: 3,
        },
    ];

    const items = achievements.length > 0 ? achievements : defaultAchievements;
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const activeItem = items[currentIndex] || items[0];
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    const nextIndex = (currentIndex + 1) % items.length;

    return (
        <section id="achievements" className="py-24 bg-charcoal-50/50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-devyellow-100 text-devorange-600 text-xs font-extrabold uppercase tracking-wider">
                        Milestones
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-charcoal-900 tracking-tight">
                        Honors & Achievements
                    </h2>
                    <p className="text-charcoal-500 text-base">
                        Recognitions in artificial intelligence hackathons, design competitions, and technical craftsmanship.
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-gray-200/80 shadow-warm-md">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                        {/* LEFT SIDE: 3D Pop-out Carousel Visual Stage */}
                        <div className="lg:col-span-7 relative">
                            <div className="relative h-72 sm:h-96 w-full flex items-center justify-center">
                                {/* Left Layered Background Card */}
                                <div
                                    onClick={handlePrev}
                                    className="absolute left-0 sm:left-4 w-44 sm:w-60 h-56 sm:h-72 rounded-2xl overflow-hidden opacity-40 scale-85 -rotate-6 grayscale hover:grayscale-0 hover:opacity-70 transition-all duration-500 border border-gray-200 shadow-lg cursor-pointer z-10"
                                >
                                    <img
                                        src={items[prevIndex]?.imageUrl || 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80'}
                                        alt="Previous Milestone"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-charcoal-900/30" />
                                </div>

                                {/* Right Layered Background Card */}
                                <div
                                    onClick={handleNext}
                                    className="absolute right-0 sm:right-4 w-44 sm:w-60 h-56 sm:h-72 rounded-2xl overflow-hidden opacity-40 scale-85 rotate-6 grayscale hover:grayscale-0 hover:opacity-70 transition-all duration-500 border border-gray-200 shadow-lg cursor-pointer z-10"
                                >
                                    <img
                                        src={items[nextIndex]?.imageUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80'}
                                        alt="Next Milestone"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-charcoal-900/30" />
                                </div>

                                {/* Active Center 3D Pop-out Card */}
                                <div className="relative z-30 w-56 sm:w-80 h-64 sm:h-84 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-tr from-devyellow-300 to-devorange-500 p-1 transition-all duration-500 hover:scale-105">
                                    <div className="w-full h-full rounded-xl overflow-hidden relative">
                                        <img
                                            key={currentIndex}
                                            src={activeItem?.imageUrl || 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80'}
                                            alt={activeItem?.title}
                                            className="w-full h-full object-cover transition-all duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent pointer-events-none" />
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-charcoal-900/80 backdrop-blur-md">
                                                {activeItem?.category}
                                            </span>
                                            <span className="text-xs font-extrabold px-2 py-1 rounded-lg bg-devyellow-400 text-charcoal-900">
                                                {activeItem?.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Arrow Controls */}
                            <div className="flex items-center justify-center gap-4 mt-4">
                                <button
                                    onClick={handlePrev}
                                    className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-charcoal-800 hover:bg-devyellow-100 hover:text-devorange-600 transition-all hover:scale-105 active:scale-95"
                                    aria-label="Previous achievement"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex gap-2">
                                    {items.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                                currentIndex === idx
                                                    ? 'w-8 bg-gradient-to-r from-devyellow-400 to-devorange-500'
                                                    : 'w-2.5 bg-gray-200 hover:bg-gray-300'
                                            }`}
                                            aria-label={`Slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={handleNext}
                                    className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-charcoal-800 hover:bg-devyellow-100 hover:text-devorange-600 transition-all hover:scale-105 active:scale-95"
                                    aria-label="Next achievement"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* RIGHT SIDE: Title, Category, Date, Description */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-devorange-50 text-devorange-600 border border-devorange-200 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                                    <Award className="w-3.5 h-3.5" />
                                    {activeItem?.category || 'Achievement'}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-gray-100 text-charcoal-700 text-xs font-bold flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-devorange-500" />
                                    {activeItem?.date || '2025'}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-2xl sm:text-4xl font-black text-charcoal-900 leading-tight">
                                    {activeItem?.title}
                                </h3>
                                <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed">
                                    {activeItem?.description}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-charcoal-500">
                                <span className="flex items-center gap-1 text-devorange-600">
                                    <Sparkles className="w-4 h-4" /> Official Milestone Recognition
                                </span>
                                <span>{currentIndex + 1} of {items.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AchievementsSection;