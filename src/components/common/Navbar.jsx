import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setMobileMenuOpen(false);
        };
        if (mobileMenuOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mobileMenuOpen]);

    const navLinks = [
        { name: 'Home', href: '/#home' },
        { name: 'Projects', href: '/#projects' },
        { name: 'Skills', href: '/#skills' },
        { name: 'Education', href: '/#education' },
        { name: 'Achievements', href: '/#achievements' },
        { name: 'Hobbies', href: '/#hobbies' },
        { name: 'Contact', href: '/#contact' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-warm-sm py-3'
                    : 'bg-transparent py-4 sm:py-5'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500 rounded-xl"
                    aria-label="Julian Agustino portfolio homepage"
                >
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-charcoal-900 flex items-center justify-center text-devyellow-400 font-black text-lg tracking-tighter shadow-md group-hover:scale-105 group-hover:bg-gradient-to-tr group-hover:from-charcoal-900 group-hover:to-charcoal-800 transition-all duration-300 ring-1 ring-black/5">
                            DV
                        </div>
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white"></span>
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-xl tracking-tight text-charcoal-900 group-hover:text-devorange-600 transition-colors leading-none">
                            DevJ
                        </span>
                        <span className="text-[10px] font-bold text-charcoal-500 tracking-wider uppercase mt-0.5">
                            Portfolio
                        </span>
                    </div>
                </Link>

                {/* Desktop & Tablet Nav */}
                <nav className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-gray-200/80 shadow-xs" aria-label="Main Navigation">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="px-3.5 py-1.5 text-xs lg:text-sm font-semibold text-charcoal-800 hover:text-devorange-600 hover:bg-devorange-50/70 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500 active:scale-95"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Header CTA & Admin Link */}
                <div className="hidden md:flex items-center gap-2 lg:gap-3">
                    {isAuthenticated && (
                        <Link
                            to="/admin"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-devorange-300 text-devorange-700 bg-devyellow-50/70 shadow-xs hover:bg-devyellow-100/70 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
                            title="Admin Dashboard"
                        >
                            <UserCheck className="w-3.5 h-3.5 text-devorange-600" />
                            <span>Dashboard</span>
                        </Link>
                    )}
                    <a
                        href="#contact"
                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-devyellow-400 via-devorange-400 to-devorange-500 text-charcoal-900 rounded-xl shadow-warm-sm hover:shadow-warm-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500 ring-1 ring-devorange-400/30"
                    >
                        <span>Say Hello</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-xl text-charcoal-800 hover:bg-gray-100 active:bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6 text-charcoal-900" /> : <Menu className="w-6 h-6 text-charcoal-900" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200/90 px-6 py-5 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-3 duration-250">
                    <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between py-2.5 text-base font-semibold text-charcoal-800 hover:text-devorange-600 border-b border-gray-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500 rounded-lg px-2 active:bg-devorange-50/50"
                            >
                                <span>{link.name}</span>
                                <ArrowUpRight className="w-4 h-4 text-charcoal-400" />
                            </a>
                        ))}
                    </nav>
                    <div className="pt-2 flex flex-col gap-2.5">
                        {isAuthenticated && (
                            <Link
                                to="/admin"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full py-3 text-center text-sm font-semibold rounded-xl border border-devorange-300 text-devorange-700 bg-devyellow-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
                            >
                                Admin Dashboard
                            </Link>
                        )}
                        <a
                            href="#contact"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full py-3 text-center text-sm font-bold bg-gradient-to-r from-devyellow-400 to-devorange-500 text-charcoal-900 rounded-xl shadow-warm-md active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devorange-500"
                        >
                            Say Hello
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
