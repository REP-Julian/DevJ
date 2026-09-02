import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, Menu, X, ArrowUpRight } from 'lucide-react';

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

    const navLinks = [
        { name: 'Home', href: '/#home' },
        { name: 'Skills', href: '/#skills' },
        { name: 'Achievements', href: '/#achievements' },
        { name: 'Projects', href: '/#projects' },
        { name: 'Hobbies', href: '/#hobbies' },
        { name: 'Contact', href: '/#contact' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-warm-sm py-3.5'
                    : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-xl bg-charcoal-900 flex items-center justify-center text-devyellow-400 font-black text-lg tracking-tighter shadow-sm group-hover:scale-105 group-hover:bg-gradient-to-tr group-hover:from-charcoal-900 group-hover:to-charcoal-800 transition-all">
                        DV
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-charcoal-900 group-hover:text-devorange-600 transition-colors">
                        DevJ
                    </span>
                </Link>

                {/* Desktop & Tablet Nav */}
                <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-white/70 backdrop-blur-sm p-1 lg:p-1.5 rounded-full border border-gray-100 shadow-sm">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="px-2.5 lg:px-4 py-1.5 text-xs lg:text-sm font-medium text-charcoal-800 hover:text-devorange-600 hover:bg-devyellow-100/40 rounded-full transition-all"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Header CTA & Admin Link */}
                <div className="hidden md:flex items-center gap-2 lg:gap-3">
                    <Link
                        to={isAuthenticated ? '/admin' : '/login'}
                        className="flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-charcoal-800 hover:border-devorange-400 hover:text-devorange-600 bg-white shadow-sm transition-all"
                        title={isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
                    >
                        {isAuthenticated ? (
                            <>
                                <UserCheck className="w-3.5 h-3.5 text-devorange-600" />
                                <span>Dashboard</span>
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="w-3.5 h-3.5 text-charcoal-500" />
                                <span>Admin</span>
                            </>
                        )}
                    </Link>
                    <a
                        href="#contact"
                        className="px-3 lg:px-4 py-2 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-devyellow-400 via-devorange-400 to-devorange-500 text-charcoal-900 rounded-lg hover:shadow-warm-md hover:scale-102 active:scale-98 transition-all flex items-center gap-1"
                    >
                        Let's Talk <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg text-charcoal-800 hover:bg-gray-100"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200 px-6 py-4 space-y-3 shadow-lg">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 text-base font-medium text-charcoal-800 hover:text-devorange-600 border-b border-gray-50"
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="pt-2 flex flex-col gap-2">
                        <Link
                            to={isAuthenticated ? '/admin' : '/login'}
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full py-2.5 text-center text-sm font-semibold rounded-xl border border-gray-200 text-charcoal-800 bg-white"
                        >
                            {isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
                        </Link>
                        <a
                            href="#contact"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full py-2.5 text-center text-sm font-bold bg-gradient-to-r from-devyellow-400 to-devorange-500 text-charcoal-900 rounded-xl"
                        >
                            Contact Me
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;