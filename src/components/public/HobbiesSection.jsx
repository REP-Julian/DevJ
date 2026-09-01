import React from 'react';
import { Camera, Music, Sparkles, Heart, Gamepad2, BookOpen, Coffee } from 'lucide-react';

const iconMap = {
    Camera: Camera,
    Music: Music,
    Sparkles: Sparkles,
    Heart: Heart,
    Gamepad2: Gamepad2,
    BookOpen: BookOpen,
    Coffee: Coffee,
};

export const HobbiesSection = ({ hobbies = [] }) => {
    return (
        <section id="hobbies" className="py-24 bg-charcoal-50/40 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-devyellow-100 text-devorange-600 text-xs font-bold uppercase tracking-wider">
                        Personal Pulse
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-charcoal-900 tracking-tight">
                        Hobbies & Creative Passions
                    </h2>
                    <p className="text-charcoal-500 text-base">
                        What inspires my design intuition outside of the command line.
                    </p>
                </div>

                {hobbies.length === 0 ? (
                    <div className="text-center py-12 text-charcoal-500">No hobbies added yet.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {hobbies.map((hobby) => {
                            const IconComp = iconMap[hobby.iconName] || Heart;
                            return (
                                <div
                                    key={hobby.id}
                                    className="h-full bg-white rounded-2xl overflow-hidden flex flex-col justify-between border border-gray-200 shadow-sm hover:shadow-warm-md hover:border-devyellow-400 hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    <div>
                                        <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                                            <img
                                                src={hobby.imageUrl}
                                                alt={hobby.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-devorange-600 p-2 rounded-xl shadow-sm">
                                                <IconComp className="w-5 h-5" />
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-charcoal-900 mb-1 group-hover:text-devorange-600 transition-colors">
                                                {hobby.name}
                                            </h3>
                                            <p className="text-xs text-charcoal-500 leading-relaxed">
                                                {hobby.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default HobbiesSection;