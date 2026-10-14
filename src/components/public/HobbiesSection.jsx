import React from 'react';
import { Camera, Music, Sparkles, Heart, Gamepad2, BookOpen, Coffee, Terminal } from 'lucide-react';

const iconMap = {
    Camera: Camera,
    Music: Music,
    Sparkles: Sparkles,
    Heart: Heart,
    Gamepad2: Gamepad2,
    BookOpen: BookOpen,
    Coffee: Coffee,
    Terminal: Terminal,
};

export const HobbiesSection = ({ hobbies = [] }) => {
    return (
        <section id="hobbies" className="py-20 sm:py-24 bg-white relative scroll-mt-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-devyellow-100 text-devorange-600 text-xs font-bold uppercase tracking-wider">
                        Personal Pursuits
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-charcoal-900 tracking-tight">
                        Interests &amp; Pursuits
                    </h2>
                    <p className="text-charcoal-500 text-sm sm:text-base font-normal leading-relaxed">
                        Creative exploration outside of software development—from photography to music production and tinkering.
                    </p>
                </div>

                {hobbies.length === 0 ? (
                    <div className="text-center py-12 text-charcoal-500 text-sm">No hobbies listed yet.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {hobbies.map((hobby) => {
                            const IconComp = iconMap[hobby.iconName] || Heart;
                            return (
                                <article
                                    key={hobby.id}
                                    className="h-full bg-white rounded-2xl overflow-hidden flex flex-col justify-between border border-gray-200/90 shadow-warm-xs hover:shadow-warm-md hover:border-devorange-300 hover:-translate-y-0.5 transition-all duration-300 group"
                                >
                                    <div>
                                        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                                            <img
                                                src={hobby.imageUrl}
                                                alt={`${hobby.name}`}
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80';
                                                }}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-devorange-600 p-2.5 rounded-xl shadow-xs border border-gray-100">
                                                <IconComp className="w-4 h-4" />
                                            </div>
                                        </div>

                                        <div className="p-6 space-y-1.5">
                                            <h3 className="text-base sm:text-lg font-bold text-charcoal-900 group-hover:text-devorange-600 transition-colors">
                                                {hobby.name}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-charcoal-500 leading-relaxed font-normal">
                                                {hobby.description}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default HobbiesSection;