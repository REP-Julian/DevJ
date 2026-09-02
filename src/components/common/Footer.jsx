import React, { useState } from 'react';
import { Github, Facebook, Instagram, Mail, ArrowUp } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import SocialQrModal from './SocialQrModal';

// Clean SVG Icon for Telegram
const TelegramIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.16-.04-.24-.02-.11.02-1.78 1.13-5.03 3.32-.48.33-.91.49-1.3.48-.43-.01-1.25-.24-1.86-.44-.75-.24-1.34-.37-1.29-.79.03-.22.33-.44.9-.68 3.51-1.53 5.86-2.54 7.05-3.04 3.35-1.4 4.05-1.64 4.5-1.65.1 0 .32.02.46.14.12.1.15.24.17.34-.01.07.01.23 0 .36z"/>
    </svg>
);

// Clean SVG Icon for WhatsApp
const WhatsAppIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.16 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.17-.47-.29z"/>
    </svg>
);

export const Footer = () => {
    const { portfolio } = usePortfolio();
    const profile = portfolio?.profile || {};
    const [qrModal, setQrModal] = useState({
        isOpen: false,
        platform: 'instagram',
        url: '',
        customQrUrl: '',
    });

    const openQr = (platform, url, customQrUrl) => {
        setQrModal({
            isOpen: true,
            platform,
            url,
            customQrUrl: customQrUrl || '',
        });
    };

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

                    <div className="flex items-center flex-wrap gap-3">
                        {profile.githubUrl && (
                            <button
                                type="button"
                                onClick={() => openQr('github', profile.githubUrl, profile.githubQrUrl)}
                                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-charcoal-800 hover:bg-devyellow-100 hover:text-devorange-600 transition-all hover:scale-105"
                                title="Click to view GitHub QR code"
                                aria-label="GitHub"
                            >
                                <Github className="w-4 h-4" />
                            </button>
                        )}
                        {profile.facebookUrl && (
                            <button
                                type="button"
                                onClick={() => openQr('facebook', profile.facebookUrl, profile.facebookQrUrl)}
                                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-charcoal-800 hover:bg-blue-50 hover:text-blue-600 transition-all hover:scale-105"
                                title="Click to view Facebook QR code"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-4 h-4" />
                            </button>
                        )}
                        {profile.instagramUrl && (
                            <button
                                type="button"
                                onClick={() => openQr('instagram', profile.instagramUrl, profile.instagramQrUrl)}
                                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-charcoal-800 hover:bg-pink-50 hover:text-pink-600 transition-all hover:scale-105"
                                title="Click to view Instagram QR code"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-4 h-4" />
                            </button>
                        )}
                        {profile.telegramUrl && (
                            <button
                                type="button"
                                onClick={() => openQr('telegram', profile.telegramUrl, profile.telegramQrUrl)}
                                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-charcoal-800 hover:bg-sky-50 hover:text-sky-500 transition-all hover:scale-105"
                                title="Click to view Telegram QR code"
                                aria-label="Telegram"
                            >
                                <TelegramIcon className="w-4 h-4" />
                            </button>
                        )}
                        {profile.whatsappUrl && (
                            <button
                                type="button"
                                onClick={() => openQr('whatsapp', profile.whatsappUrl, profile.whatsappQrUrl)}
                                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-charcoal-800 hover:bg-emerald-50 hover:text-emerald-600 transition-all hover:scale-105"
                                title="Click to view WhatsApp QR code"
                                aria-label="WhatsApp"
                            >
                                <WhatsAppIcon className="w-4 h-4" />
                            </button>
                        )}
                        {profile.email && (
                            <a
                                href={`mailto:${profile.email}`}
                                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-charcoal-800 hover:bg-devyellow-100 hover:text-devorange-600 transition-all hover:scale-105"
                                aria-label="Email"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        )}
                    </div>

                    <button
                        onClick={scrollToTop}
                        className="w-10 h-10 rounded-full bg-devyellow-100/70 border border-devyellow-300 text-charcoal-900 flex items-center justify-center hover:bg-devyellow-400 transition-all hover:scale-105"
                        aria-label="Back to top"
                    >
                        <ArrowUp className="w-4 h-4 text-devorange-600 font-bold" />
                    </button>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-500 gap-4">
                    <p>© {new Date().getFullYear()} DevJ. All rights reserved. Crafted with precision.</p>
                    <div className="flex gap-6">
                        <a href="#skills" className="hover:text-devorange-600">Skills</a>
                        <a href="#projects" className="hover:text-devorange-600">Projects</a>
                        <a href="#achievements" className="hover:text-devorange-600">Achievements</a>
                    </div>
                </div>
            </div>

            {/* Interactive Social QR Code Modal */}
            <SocialQrModal
                isOpen={qrModal.isOpen}
                onClose={() => setQrModal(prev => ({ ...prev, isOpen: false }))}
                platform={qrModal.platform}
                url={qrModal.url}
                customQrUrl={qrModal.customQrUrl}
                profileName={profile.name || 'Julian Agustino'}
            />
        </footer>
    );
};

export default Footer;