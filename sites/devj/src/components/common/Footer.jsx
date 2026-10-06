import React from 'react';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';

export const Footer = ({ profile = {} }) => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navLinks = [
        { name: 'Home', href: '/#home' },
        { name: 'Skills', href: '/#skills' },
        { name: 'Achievements', href: '/#achievements' },
        { name: 'Projects', href: '/#projects' },
        { name: 'Hobbies', href: '/#hobbies' },
        { name: 'Contact', href: '/#contact' },
    ];

    const email = profile.email || '';
    const githubUrl = profile.githubUrl && profile.githubUrl !== '#' ? profile.githubUrl : 'https://github.com/REP-Julian';
    const linkedinUrl = profile.linkedinUrl && profile.linkedinUrl !== '#' ? profile.linkedinUrl : 'https://linkedin.com';

    return (
        <footer className="bg-white border-t border-gray-100 pt-14 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-gray-100 items-start">
                    {/* Brand & Availability Status (Col 1-5) */}
                    <div className="md:col-span-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-charcoal-900 flex items-center justify-center text-devyellow-400 font-extrabold text-lg shadow-sm">
                                DV
                            </div>
                            <div>
                                <span className="font-extrabold text-xl tracking-tight text-charcoal-900">
                                    Julian Agustino
                                </span>
                                <span className="text-xs text-charcoal-500 font-semibold ml-1.5">(DevJ)</span>
                                <p className="text-xs text-charcoal-500">
                                    Full-Stack Developer &amp; AI Systems Integrator
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-charcoal-500 max-w-sm leading-relaxed">
                            Building reliable full-stack applications with React, Node.js, and Appwrite, integrated with modern LLM endpoints and custom REST APIs.
                        </p>

                    </div>

                    {/* Quick Navigation Links (Col 6-8) */}
                    <div className="md:col-span-4 space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                            Navigation
                        </div>
                        <nav className="grid grid-cols-2 gap-2 text-xs font-medium">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-charcoal-600 hover:text-devorange-600 transition-colors py-1 inline-flex items-center gap-1"
                                >
                                    <span>{link.name}</span>
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Direct Social Shortcuts & Back-to-Top (Col 9-12) */}
                    <div className="md:col-span-3 space-y-4 md:text-right flex flex-col md:items-end">
                        <div className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                            Connect &amp; Social
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-charcoal-700 hover:text-devorange-600 hover:border-devorange-400 hover:bg-white transition-all shadow-xs"
                                title="GitHub"
                                aria-label="Julian Agustino GitHub"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-charcoal-700 hover:text-devorange-600 hover:border-devorange-400 hover:bg-white transition-all shadow-xs"
                                title="LinkedIn"
                                aria-label="Julian Agustino LinkedIn"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                            {email && (
                                <a
                                    href={`mailto:${email}`}
                                    className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-charcoal-700 hover:text-devorange-600 hover:border-devorange-400 hover:bg-white transition-all shadow-xs"
                                    title={`Email: ${email}`}
                                    aria-label="Send email"
                                >
                                    <Mail className="w-4 h-4" />
                                </a>
                            )}
                            <button
                                onClick={scrollToTop}
                                className="w-9 h-9 rounded-xl bg-devyellow-100/80 border border-devyellow-300 text-charcoal-900 flex items-center justify-center hover:bg-devyellow-400 hover:scale-105 active:scale-95 transition-all shadow-xs ml-1"
                                aria-label="Back to top"
                                title="Back to top"
                            >
                                <ArrowUp className="w-4 h-4 text-devorange-600 font-bold" />
                            </button>
                        </div>
                        {email && (
                            <span className="text-[11px] text-charcoal-400 font-medium">
                                {email}
                            </span>
                        )}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-500 gap-4">
                    <p>© {new Date().getFullYear()} Julian Agustino (DevJ). All rights reserved.</p>
                    <p className="inline-flex items-center gap-1.5 font-medium text-charcoal-400">
                        <span>Engineered with React 18, Node.js, Appwrite &amp; Tailwind CSS</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;