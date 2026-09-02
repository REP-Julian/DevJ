import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-white border-t border-gray-100 pt-14 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-charcoal-900 flex items-center justify-center text-devyellow-400 font-extrabold text-lg">
                            DV
                        </div>
                        <div>
                            <span className="font-extrabold text-xl tracking-tight text-charcoal-900">DevJ</span>
                            <p className="text-xs text-charcoal-500">Creative Web & AI Architecture</p>
                        </div>
                    </div>

                    <button
                        onClick={scrollToTop}
                        className="w-10 h-10 rounded-full bg-devyellow-100/70 border border-devyellow-300 text-charcoal-900 flex items-center justify-center hover:bg-devyellow-400 transition-all hover:scale-105 shadow-xs"
                        aria-label="Back to top"
                        title="Back to top"
                    >
                        <ArrowUp className="w-4 h-4 text-devorange-600 font-bold" />
                    </button>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-500 gap-4">
                    <p>© {new Date().getFullYear()} DevJ. All rights reserved. Crafted with precision.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;