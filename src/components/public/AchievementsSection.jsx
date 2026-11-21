import React, { useState, useEffect, useCallback } from 'react';
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
            title: 'AI Literacy & Tech Basics Certification',
            category: 'Foundational Milestone',
            date: '2023',
            description: 'Completed foundational coursework covering essential AI concepts, prompt fundamentals, and introductory Python.',
            imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
            order: 3,
        },
    ];

    const items = achievements.length > 0 ? achievements : defaultAchievements;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState('next');
    const [isHovered, setIsHovered] = useState(false);
    const [isTouching, setIsTouching] = useState(false);
    const [isDocVisible, setIsDocVisible] = useState(true);
    const [lightboxItem, setLightboxItem] = useState(null);
    const [lightboxZoom, setLightboxZoom] = useState(1);

    // Track document visibility to pause autoplay when tab is unfocused
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsDocVisible(!document.hidden);
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const handlePrev = useCallback(() => {
        setDirection('prev');
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    const handleNext = useCallback(() => {
        setDirection('next');
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const handleDotClick = (idx) => {
        if (idx === currentIndex) return;
        setDirection(idx > currentIndex ? 'next' : 'prev');
        setCurrentIndex(idx);
    };

    const handleCardClick = (idx, item) => {
        if (idx === currentIndex) {
            setLightboxItem(item);
            setLightboxZoom(1);
        } else {
            const total = items.length;
            const diff = (idx - currentIndex + total) % total;
            if (diff <= total / 2) {
                setDirection('next');
            } else {
                setDirection('prev');
            }
            setCurrentIndex(idx);
        }
    };

    // Auto-play timer: 5 seconds interval, paused on hover, touch, lightbox, or background tab
    const isPaused = isHovered || isTouching || Boolean(lightboxItem) || !isDocVisible;

    useEffect(() => {
        if (isPaused || items.length <= 1) return;

        const interval = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused, items.length, handleNext]);

    // Handle Escape and Arrow keys to close or navigate Lightbox Modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setLightboxItem(null);
                setLightboxZoom(1);
            } else if (e.key === 'ArrowRight' && lightboxItem) {
                const currentIdx = items.findIndex((it) => (it.id || it.title) === (lightboxItem.id || lightboxItem.title));
                if (currentIdx !== -1) {
                    const nextIdx = (currentIdx + 1) % items.length;
                    setDirection('next');
                    setLightboxItem(items[nextIdx]);
                    setCurrentIndex(nextIdx);
                    setLightboxZoom(1);
                }
            } else if (e.key === 'ArrowLeft' && lightboxItem) {
                const currentIdx = items.findIndex((it) => (it.id || it.title) === (lightboxItem.id || lightboxItem.title));
                if (currentIdx !== -1) {
                    const prevIdx = (currentIdx - 1 + items.length) % items.length;
                    setDirection('prev');
                    setLightboxItem(items[prevIdx]);
                    setCurrentIndex(prevIdx);
                    setLightboxZoom(1);
                }
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
    }, [lightboxItem, items]);

    const [touchStartX, setTouchStartX] = useState(null);

    const handleTouchStart = (e) => {
        setIsTouching(true);
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        setIsTouching(false);
        if (touchStartX === null) return;
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (diff > 45) {
            handleNext();
        } else if (diff < -45) {
            handlePrev();
        }
        setTouchStartX(null);
    };

    const activeItem = items[currentIndex] || items[0];

    // Card positioning for each card in the stage with smooth 3D coverflow transforms
    const getCardStyle = (idx) => {
        const total = items.length;
        if (total === 1) {
            return {
                wrapper:
                    'z-30 opacity-100 scale-100 translate-x-0 rotate-0 cursor-zoom-in pointer-events-auto',
                inner:
                    'p-1 bg-gradient-to-tr from-devyellow-300 via-devorange-400 to-devorange-500 border-4 border-white shadow-2xl shadow-devorange-500/25',
                img: 'grayscale-0 brightness-100',
                overlay: 'opacity-0',
                isActive: true,
            };
        }

        const offset = (idx - currentIndex + total) % total;

        // Active Center Card
        if (offset === 0) {
            return {
                wrapper:
                    'z-30 opacity-100 scale-100 translate-x-0 rotate-0 cursor-zoom-in pointer-events-auto',
                inner:
                    'p-1 bg-gradient-to-tr from-devyellow-300 via-devorange-400 to-devorange-500 border-4 border-white shadow-2xl shadow-devorange-500/25',
                img: 'grayscale-0 brightness-100',
                overlay: 'opacity-0',
                isActive: true,
            };
        }

        // Two items case: the other card is placed to the right
        if (total === 2) {
            return {
                wrapper:
                    'z-10 opacity-50 hover:opacity-85 scale-[0.84] translate-x-20 sm:translate-x-32 md:translate-x-40 rotate-6 cursor-pointer pointer-events-auto',
                inner:
                    'p-1 bg-white border border-gray-200 shadow-md hover:shadow-lg',
                img: 'grayscale brightness-90',
                overlay: 'opacity-40 hover:opacity-20',
                isActive: false,
            };
        }

        // Right Background Card (offset === 1)
        if (offset === 1) {
            return {
                wrapper:
                    'z-10 opacity-50 hover:opacity-85 scale-[0.84] translate-x-20 sm:translate-x-32 md:translate-x-40 rotate-6 cursor-pointer pointer-events-auto',
                inner:
                    'p-1 bg-white border border-gray-200 shadow-md hover:shadow-lg',
                img: 'grayscale brightness-90',
                overlay: 'opacity-40 hover:opacity-20',
                isActive: false,
            };
        }

        // Left Background Card (offset === total - 1)
        if (offset === total - 1) {
            return {
                wrapper:
                    'z-10 opacity-50 hover:opacity-85 scale-[0.84] -translate-x-20 sm:-translate-x-32 md:-translate-x-40 -rotate-6 cursor-pointer pointer-events-auto',
                inner:
                    'p-1 bg-white border border-gray-200 shadow-md hover:shadow-lg',
                img: 'grayscale brightness-90',
                overlay: 'opacity-40 hover:opacity-20',
                isActive: false,
            };
        }

        // Hidden cards for lists larger than 3
        return {
            wrapper:
                'z-0 opacity-0 scale-75 translate-x-0 rotate-0 pointer-events-none',
            inner: 'p-1 bg-white',
            img: 'grayscale',
            overlay: 'opacity-0',
            isActive: false,
        };
    };

    return (
        <section id="achievements" className="py-20 sm:py-24 bg-charcoal-50/50 relative overflow-hidden scroll-mt-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-devyellow-100 border border-devyellow-200 text-devorange-600 text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-devorange-500" />
                        <span>Milestones &amp; Honors</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-charcoal-900 tracking-tight">
                        Achievements &amp; Milestones
                    </h2>
                    <p className="text-sm sm:text-base text-charcoal-500 font-normal leading-relaxed">
                        Hackathons, awards, and certifications earned throughout my development journey.
                    </p>
                </div>

                <div
                    className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-gray-200/90 shadow-warm-md hover:shadow-warm-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-devorange-400/50"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    tabIndex={0}
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Achievements &amp; Milestones Carousel"
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowLeft') {
                            e.preventDefault();
                            handlePrev();
                        } else if (e.key === 'ArrowRight') {
                            e.preventDefault();
                            handleNext();
                        }
                    }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                        {/* LEFT SIDE: Carousel Visual Stage */}
                        <div className="lg:col-span-7 relative">
                            <div
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                className="relative min-h-[360px] sm:min-h-[420px] w-full flex items-center justify-center overflow-visible rounded-2xl touch-pan-y py-4 perspective-1000"
                            >
                                {/* Ambient Warm Backlight Glow behind active card with subtle breathing animation */}
                                <div
                                    aria-hidden="true"
                                    className="absolute w-56 sm:w-80 h-64 sm:h-80 bg-gradient-to-tr from-devyellow-400/30 via-devorange-400/25 to-devorange-500/30 rounded-3xl blur-2xl pointer-events-none animate-breathing-glow"
                                />

                                {/* Persistent Multi-Achievement Carousel Deck */}
                                {items.map((item, idx) => {
                                    const style = getCardStyle(idx);
                                    return (
                                        <div
                                            key={item.id || idx}
                                            onClick={() => handleCardClick(idx, item)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    handleCardClick(idx, item);
                                                }
                                            }}
                                            role="button"
                                            tabIndex={style.isActive ? 0 : -1}
                                            aria-label={`${item.title}${style.isActive ? ' (Active certificate, click to view full size)' : ' (Click to view)'}`}
                                            className={`group absolute rounded-2xl select-none w-56 sm:w-80 h-64 sm:h-80 transition-all duration-500 ease-out transform will-change-transform ${style.wrapper}`}
                                        >
                                            <div
                                                className={`w-full h-full rounded-2xl overflow-hidden transition-all duration-500 ease-out ${style.inner}`}
                                            >
                                                <div className="w-full h-full rounded-xl overflow-hidden relative flex items-center justify-center bg-charcoal-950">
                                                    <img
                                                        src={item.imageUrl || defaultAchievements[idx % defaultAchievements.length]?.imageUrl}
                                                        alt={`${item.title} - Julian Agustino`}
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80';
                                                        }}
                                                        className={`w-full h-full object-cover transition-all duration-500 ease-out ${style.img}`}
                                                    />
                                                    <div
                                                        className={`absolute inset-0 bg-charcoal-900/50 pointer-events-none transition-opacity duration-500 ease-out ${style.overlay}`}
                                                    />
                                                    <div
                                                        className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-transparent to-transparent pointer-events-none"
                                                    />

                                                    {/* Category & Date badge on card with smooth fade & subtle translate */}
                                                    <div
                                                        className={`absolute bottom-3 left-3 right-3 flex items-center justify-between text-white transition-all duration-300 ease-out ${
                                                            style.isActive
                                                                ? 'opacity-100 translate-y-0'
                                                                : 'opacity-0 translate-y-2 pointer-events-none'
                                                        }`}
                                                    >
                                                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-charcoal-900/80 backdrop-blur-md shadow">
                                                            {item.category}
                                                        </span>
                                                        <span className="text-xs font-extrabold px-2 py-1 rounded-lg bg-devyellow-400 text-charcoal-900 shadow">
                                                            {item.date}
                                                        </span>
                                                    </div>

                                                    {/* Hover zoom affordance on active card */}
                                                    {style.isActive && (
                                                        <div className="absolute inset-0 bg-charcoal-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal-900/85 backdrop-blur-md text-white text-xs font-bold shadow-lg transform translate-y-1 group-hover:translate-y-0 transition-transform duration-200">
                                                                <ZoomIn className="w-3.5 h-3.5 text-devyellow-400" />
                                                                <span>Click to enlarge</span>
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Arrow Controls & Indicators */}
                            <div className="flex items-center justify-center gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-charcoal-800 hover:bg-devyellow-100 hover:text-devorange-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-devorange-400"
                                    aria-label="Previous achievement"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-2" role="tablist" aria-label="Achievements navigation">
                                    {items.map((_, idx) => (
                                        <button
                                            type="button"
                                            key={idx}
                                            role="tab"
                                            aria-selected={currentIndex === idx}
                                            onClick={() => handleDotClick(idx)}
                                            className={`h-2.5 rounded-full transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-devorange-400 focus:ring-offset-1 ${
                                                currentIndex === idx
                                                    ? 'w-8 bg-gradient-to-r from-devyellow-400 to-devorange-500 shadow-sm shadow-devorange-500/30'
                                                    : 'w-2.5 bg-gray-200 hover:bg-gray-300'
                                            }`}
                                            aria-label={`Go to slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-charcoal-800 hover:bg-devyellow-100 hover:text-devorange-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-devorange-400"
                                    aria-label="Next achievement"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* RIGHT SIDE: Title, Category, Date, Description with directional slide & fade */}
                        <div
                            key={currentIndex}
                            className="lg:col-span-5 space-y-6"
                        >
                            <div
                                className={`flex items-center gap-3 ${
                                    direction === 'next' ? 'animate-slide-in-right' : 'animate-slide-in-left'
                                }`}
                                style={{ animationDelay: '0ms' }}
                            >
                                <span className="px-3 py-1 rounded-full bg-devorange-50 text-devorange-600 border border-devorange-200 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-warm-sm">
                                    <Award className="w-3.5 h-3.5" />
                                    {activeItem?.category || 'Achievement'}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-gray-100 text-charcoal-700 text-xs font-bold flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-devorange-500" />
                                    {activeItem?.date || '2025'}
                                </span>
                            </div>

                            <div
                                className={`space-y-3 ${
                                    direction === 'next' ? 'animate-slide-in-right' : 'animate-slide-in-left'
                                }`}
                                style={{ animationDelay: '60ms' }}
                            >
                                <h3 className="text-2xl sm:text-4xl font-black text-charcoal-900 leading-tight">
                                    {activeItem?.title}
                                </h3>
                                <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed">
                                    {activeItem?.description}
                                </p>
                            </div>

                            <div
                                className={`pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-charcoal-500 ${
                                    direction === 'next' ? 'animate-slide-in-right' : 'animate-slide-in-left'
                                }`}
                                style={{ animationDelay: '120ms' }}
                            >
                                <span className="flex items-center gap-1 text-devorange-600">
                                    <Sparkles className="w-4 h-4" /> Milestone Recognition
                                </span>
                                <span className="tabular-nums">
                                    {currentIndex + 1} of {items.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Lightbox Modal */}
            {lightboxItem && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-charcoal-950/95 backdrop-blur-md select-none"
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
                                    className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 disabled:opacity-30 disabled:pointer-events-none text-charcoal-300 hover:text-white"
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
                                    className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 disabled:opacity-30 disabled:pointer-events-none text-charcoal-300 hover:text-white"
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
                                        className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 hover:text-white ml-1"
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
                                    className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 hover:text-white ml-1"
                                    aria-label="Close full view"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Image display with navigation arrows: flex-1 min-h-0 */}
                        <div
                            className={`relative flex-1 min-h-0 w-full flex items-center justify-center p-3 sm:p-6 bg-charcoal-950 ${
                                lightboxZoom > 1 ? 'overflow-auto cursor-grab active:cursor-grabbing' : 'overflow-hidden'
                            }`}
                        >
                            {items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const currentIdx = items.findIndex((it) => (it.id || it.title) === (lightboxItem.id || lightboxItem.title));
                                        const prevIdx = (currentIdx - 1 + items.length) % items.length;
                                        setLightboxItem(items[prevIdx]);
                                        setCurrentIndex(prevIdx);
                                        setLightboxZoom(1);
                                    }}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-charcoal-900/80 hover:bg-charcoal-800 text-white border border-charcoal-700 shadow-lg z-20"
                                    title="Previous image"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}

                            <img
                                src={lightboxItem.imageUrl || defaultAchievements[0]?.imageUrl}
                                alt={lightboxItem.title}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80';
                                }}
                                className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl block select-none"
                                style={{
                                    maxHeight: lightboxZoom === 1 ? 'calc(94vh - 145px)' : 'none',
                                    maxWidth: lightboxZoom === 1 ? '100%' : 'none',
                                    transform: lightboxZoom > 1 ? `scale(${lightboxZoom})` : 'none',
                                    transformOrigin: 'center center',
                                }}
                            />

                            {items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const currentIdx = items.findIndex((it) => (it.id || it.title) === (lightboxItem.id || lightboxItem.title));
                                        const nextIdx = (currentIdx + 1) % items.length;
                                        setLightboxItem(items[nextIdx]);
                                        setCurrentIndex(nextIdx);
                                        setLightboxZoom(1);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-charcoal-900/80 hover:bg-charcoal-800 text-white border border-charcoal-700 shadow-lg z-20"
                                    title="Next image"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            )}
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