import React, { useState, useEffect } from 'react';
import { Award, Calendar, Sparkles, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ExternalLink, X } from 'lucide-react';

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
    const [isHovered, setIsHovered] = useState(false);
    const [isActiveCardHovered, setIsActiveCardHovered] = useState(false);
    const [lightboxItem, setLightboxItem] = useState(null);
    const [lightboxZoom, setLightboxZoom] = useState(1);

    // Reset card hover state when switching items
    useEffect(() => {
        setIsActiveCardHovered(false);
    }, [currentIndex]);

    // Handle Escape key to close Lightbox Modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setLightboxItem(null);
                setLightboxZoom(1);
            }
        };
        if (lightboxItem) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
            setLightboxZoom(1);
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [lightboxItem]);

    // Auto-advance every 4.5 seconds with pause on hover
    useEffect(() => {
        if (isHovered || isActiveCardHovered || items.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 4500);

        return () => clearInterval(timer);
    }, [items.length, isHovered, isActiveCardHovered]);

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
        setIsActiveCardHovered(false);
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    const handleNext = () => {
        setIsActiveCardHovered(false);
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const activeItem = items[currentIndex] || items[0];

    // Calculate fluid positioning for each card in the 3D stage
    const getCardStyle = (idx) => {
        const total = items.length;
        const offset = (idx - currentIndex + total) % total;

        // Active Center Card
        if (offset === 0) {
            if (isActiveCardHovered) {
                return {
                    wrapper:
                        'z-50 opacity-100 scale-[1.08] sm:scale-[1.22] md:scale-[1.28] translate-x-0 rotate-0 cursor-zoom-in pointer-events-auto w-[280px] sm:w-[460px] md:w-[520px] h-[260px] sm:h-[340px] md:h-[370px]',
                    inner:
                        'p-1.5 bg-gradient-to-tr from-devyellow-400 via-devorange-400 to-devorange-500 border-4 border-white shadow-2xl shadow-charcoal-950/40 ring-4 ring-devyellow-400/30',
                    img: 'grayscale-0 brightness-100',
                    overlay: 'opacity-0',
                    showDetails: false,
                };
            }
            return {
                wrapper:
                    'z-30 opacity-100 scale-100 translate-x-0 rotate-0 cursor-zoom-in pointer-events-auto w-56 sm:w-80 h-64 sm:h-80',
                inner:
                    'p-1 bg-gradient-to-tr from-devyellow-300 via-devorange-400 to-devorange-500 border-4 border-white shadow-2xl shadow-devorange-500/20',
                img: 'grayscale-0 brightness-100',
                overlay: 'opacity-0',
                showDetails: true,
            };
        }

        // Right Background Card
        if (offset === 1) {
            return {
                wrapper:
                    'z-10 opacity-45 hover:opacity-90 scale-[0.84] translate-x-20 sm:translate-x-32 md:translate-x-40 rotate-6 hover:rotate-3 cursor-pointer pointer-events-auto w-56 sm:w-80 h-64 sm:h-80',
                inner:
                    'p-1 bg-white border border-gray-200/90 shadow-lg hover:shadow-xl hover:border-devorange-300',
                img: 'grayscale brightness-90 hover:grayscale-0 hover:brightness-100',
                overlay: 'opacity-40',
                showDetails: false,
            };
        }

        // Left Background Card
        if (offset === total - 1) {
            return {
                wrapper:
                    'z-10 opacity-45 hover:opacity-90 scale-[0.84] -translate-x-20 sm:-translate-x-32 md:-translate-x-40 -rotate-6 hover:-rotate-3 cursor-pointer pointer-events-auto w-56 sm:w-80 h-64 sm:h-80',
                inner:
                    'p-1 bg-white border border-gray-200/90 shadow-lg hover:shadow-xl hover:border-devorange-300',
                img: 'grayscale brightness-90 hover:grayscale-0 hover:brightness-100',
                overlay: 'opacity-40',
                showDetails: false,
            };
        }

        // Hidden cards for lists larger than 3
        return {
            wrapper:
                'z-0 opacity-0 scale-75 translate-x-0 rotate-0 pointer-events-none w-56 sm:w-80 h-64 sm:h-80',
            inner: 'p-1 bg-white',
            img: 'grayscale',
            overlay: 'opacity-0',
            showDetails: false,
        };
    };

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
                        <div
                            className="lg:col-span-7 relative"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => {
                                setIsHovered(false);
                                setIsActiveCardHovered(false);
                            }}
                        >
                            <div
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                className="relative min-h-[360px] sm:min-h-[420px] w-full flex items-center justify-center overflow-visible rounded-2xl touch-pan-y py-4"
                            >
                                {/* Ambient Warm Backlight Glow behind active card */}
                                <div
                                    className={`absolute w-56 sm:w-80 h-64 sm:h-80 bg-gradient-to-tr from-devyellow-400/25 via-devorange-400/20 to-devorange-500/25 rounded-3xl blur-2xl transform transition-all duration-700 pointer-events-none ${
                                        isActiveCardHovered ? 'scale-125 opacity-100' : 'scale-100 opacity-70'
                                    }`}
                                />

                                {/* Persistent Multi-Achievement Carousel Deck */}
                                {items.map((item, idx) => {
                                    const isCenter = (idx - currentIndex + items.length) % items.length === 0;
                                    const style = getCardStyle(idx);
                                    return (
                                        <div
                                            key={item.id || idx}
                                            onClick={() => {
                                                if (isCenter) {
                                                    setLightboxItem(item);
                                                } else {
                                                    setCurrentIndex(idx);
                                                }
                                            }}
                                            onMouseEnter={() => {
                                                if (isCenter) setIsActiveCardHovered(true);
                                            }}
                                            onMouseLeave={() => {
                                                if (isCenter) setIsActiveCardHovered(false);
                                            }}
                                            className={`absolute transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform rounded-2xl select-none ${style.wrapper}`}
                                        >
                                            <div
                                                className={`w-full h-full rounded-2xl transition-all duration-500 overflow-hidden ${style.inner}`}
                                            >
                                                <div className="w-full h-full rounded-xl overflow-hidden relative flex items-center justify-center bg-charcoal-950">
                                                    <img
                                                        src={item.imageUrl || defaultAchievements[idx % defaultAchievements.length]?.imageUrl}
                                                        alt={item.title}
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80';
                                                        }}
                                                        className={`w-full h-full transition-all duration-500 ease-out ${
                                                            isCenter && isActiveCardHovered
                                                                ? 'object-contain p-3 sm:p-4 drop-shadow-md'
                                                                : 'object-cover'
                                                        } ${style.img}`}
                                                    />
                                                    <div
                                                        className={`absolute inset-0 bg-charcoal-900/50 transition-opacity duration-500 pointer-events-none ${style.overlay}`}
                                                    />
                                                    <div
                                                        className={`absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-transparent to-transparent pointer-events-none transition-opacity duration-500 ${
                                                            isCenter && isActiveCardHovered ? 'opacity-0' : 'opacity-100'
                                                        }`}
                                                    />

                                                    {/* Hover Full Preview / Click to Zoom badge */}
                                                    {isCenter && (
                                                        <div
                                                            className={`absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-charcoal-900/85 backdrop-blur-md text-white border border-white/15 text-[11px] font-bold shadow-lg transition-all duration-300 pointer-events-none ${
                                                                isActiveCardHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
                                                            }`}
                                                        >
                                                            <ZoomIn className="w-3.5 h-3.5 text-devyellow-400" />
                                                            <span>Click for Fullscreen</span>
                                                        </div>
                                                    )}

                                                    <div
                                                        className={`absolute bottom-3 left-3 right-3 flex items-center justify-between text-white transition-opacity duration-500 ${
                                                            style.showDetails && !(isCenter && isActiveCardHovered)
                                                                ? 'opacity-100'
                                                                : 'opacity-0 pointer-events-none'
                                                        }`}
                                                    >
                                                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-charcoal-900/80 backdrop-blur-md">
                                                            {item.category}
                                                        </span>
                                                        <span className="text-xs font-extrabold px-2 py-1 rounded-lg bg-devyellow-400 text-charcoal-900">
                                                            {item.date}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Floating Arrow Controls & Indicators */}
                            <div className="flex items-center justify-center gap-4 mt-5">
                                <button
                                    onClick={handlePrev}
                                    className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-charcoal-800 hover:bg-devyellow-100 hover:text-devorange-600 transition-all hover:scale-105 active:scale-95"
                                    aria-label="Previous achievement"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-2">
                                    {items.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                                                currentIndex === idx
                                                    ? 'w-8 bg-gradient-to-r from-devyellow-400 to-devorange-500 shadow-sm'
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

            {/* Fullscreen Lightbox Modal */}
            {lightboxItem && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-charcoal-950/95 backdrop-blur-md transition-all animate-fade-in select-none"
                    onClick={() => {
                        setLightboxItem(null);
                        setLightboxZoom(1);
                    }}
                >
                    <div
                        className="relative max-w-5xl w-full max-h-[94vh] flex flex-col bg-charcoal-900 border border-charcoal-700/80 rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header bar: shrink-0 */}
                        <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 bg-charcoal-900 border-b border-charcoal-800 z-10">
                            <div className="flex items-center gap-2.5 min-w-0 pr-3">
                                <span className="shrink-0 px-2.5 py-1 rounded-md bg-devyellow-400 text-charcoal-900 text-xs font-black uppercase tracking-wider">
                                    {lightboxItem.category || 'Milestone'}
                                </span>
                                <h4 className="text-sm sm:text-base font-black text-white truncate">
                                    {lightboxItem.title}
                                </h4>
                            </div>

                            {/* Controls: Zoom In/Out, New Tab, Close */}
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setLightboxZoom((z) => Math.max(1, Number((z - 0.25).toFixed(2))))}
                                    disabled={lightboxZoom <= 1}
                                    className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 disabled:opacity-30 disabled:pointer-events-none text-charcoal-300 hover:text-white transition-colors"
                                    title="Zoom Out"
                                    aria-label="Zoom Out"
                                >
                                    <ZoomOut className="w-4 h-4" />
                                </button>
                                <span className="text-xs font-mono font-bold text-devyellow-400 px-1 min-w-[42px] text-center">
                                    {Math.round(lightboxZoom * 100)}%
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setLightboxZoom((z) => Math.min(2.5, Number((z + 0.25).toFixed(2))))}
                                    disabled={lightboxZoom >= 2.5}
                                    className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 disabled:opacity-30 disabled:pointer-events-none text-charcoal-300 hover:text-white transition-colors"
                                    title="Zoom In"
                                    aria-label="Zoom In"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                </button>
                                {lightboxItem.imageUrl && (
                                    <a
                                        href={lightboxItem.imageUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 hover:text-white transition-colors ml-1"
                                        title="Open full image in new tab"
                                        aria-label="Open full image in new tab"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLightboxItem(null);
                                        setLightboxZoom(1);
                                    }}
                                    className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 hover:text-white transition-colors ml-1"
                                    aria-label="Close full view"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Image display: flex-1 min-h-0 */}
                        <div
                            className={`flex-1 min-h-0 w-full flex items-center justify-center p-3 sm:p-6 bg-charcoal-950 ${
                                lightboxZoom > 1 ? 'overflow-auto cursor-grab active:cursor-grabbing' : 'overflow-hidden'
                            }`}
                        >
                            <img
                                src={lightboxItem.imageUrl || defaultAchievements[0]?.imageUrl}
                                alt={lightboxItem.title}
                                className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-200 block select-none"
                                style={{
                                    maxHeight: lightboxZoom === 1 ? 'calc(94vh - 145px)' : 'none',
                                    maxWidth: lightboxZoom === 1 ? '100%' : 'none',
                                    transform: lightboxZoom > 1 ? `scale(${lightboxZoom})` : 'none',
                                    transformOrigin: 'center center',
                                }}
                            />
                        </div>

                        {/* Footer with date and description: shrink-0 */}
                        <div className="shrink-0 px-4 sm:px-6 py-3 bg-charcoal-900 border-t border-charcoal-800 text-xs sm:text-sm text-charcoal-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-10">
                            <p className="line-clamp-2 max-w-3xl leading-relaxed">
                                {lightboxItem.description}
                            </p>
                            {lightboxItem.date && (
                                <span className="shrink-0 px-2.5 py-1 rounded bg-charcoal-800 border border-charcoal-700 text-devyellow-400 text-xs font-bold">
                                    {lightboxItem.date}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AchievementsSection;