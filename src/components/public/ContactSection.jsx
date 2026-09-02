import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Loader2, Github, Facebook, Instagram, QrCode } from 'lucide-react';
import { api } from '../../services/api';
import SocialQrModal from '../common/SocialQrModal';

export const ContactSection = ({ profile = {} }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [honeypot, setHoneypot] = useState('');
    const [status, setStatus] = useState({ loading: false, success: false, error: '' });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (honeypot.trim() !== '') {
            // Silently drop bot traffic
            setStatus({ loading: false, success: true, error: '' });
            return;
        }
        setStatus({ loading: true, success: false, error: '' });

        try {
            await api.sendMessage(formData);
            setStatus({ loading: false, success: true, error: '' });
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 6000);
        } catch (err) {
            setStatus({ loading: false, success: false, error: err.message || 'Failed to send message.' });
        }
    };

    return (
        <section id="contact" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-charcoal-900 to-charcoal-800 rounded-3xl p-8 sm:p-12 text-white shadow-warm-lg overflow-hidden relative">
                    {/* Subtle Decorative Yellow/Orange Spheres */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-devorange-500/20 via-devyellow-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
                        {/* Left Col: Contact Info */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal-800 border border-charcoal-700 text-devyellow-400 text-xs font-bold uppercase tracking-wider">
                                <Mail className="w-3.5 h-3.5" /> Direct Contact
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                                Let's Build Something <span className="text-devyellow-400">Exceptional</span> Together
                            </h2>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Have an AI project, web platform, or creative vision in mind? Send a message and let's bring it to reality.
                            </p>

                            <div className="pt-4 space-y-3">
                                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                                    Email
                                </div>
                                <a
                                    href={`mailto:${profile.email || 'agustino.julian@outlook.ph'}`}
                                    className="text-base font-bold text-white hover:text-devyellow-400 transition-colors block"
                                >
                                    {profile.email || 'agustino.julian@outlook.ph'}
                                </a>
                            </div>

                            <div className="pt-2 space-y-2">
                                <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <QrCode className="w-3.5 h-3.5 text-devyellow-400" />
                                    <span>Connect on Socials (Click to view QR)</span>
                                </div>
                                <div className="flex items-center flex-wrap gap-2.5">
                                    {profile.githubUrl && (
                                        <button
                                            type="button"
                                            onClick={() => openQr('github', profile.githubUrl, profile.githubQrUrl)}
                                            className="w-10 h-10 rounded-xl bg-charcoal-700/60 border border-charcoal-600 flex items-center justify-center text-white hover:text-devyellow-400 hover:border-devyellow-400 transition-all hover:scale-105 active:scale-95 shadow-xs"
                                            title="Click to view GitHub QR code"
                                            aria-label="GitHub QR"
                                        >
                                            <Github className="w-4 h-4" />
                                        </button>
                                    )}
                                    {profile.facebookUrl && (
                                        <button
                                            type="button"
                                            onClick={() => openQr('facebook', profile.facebookUrl, profile.facebookQrUrl)}
                                            className="w-10 h-10 rounded-xl bg-charcoal-700/60 border border-charcoal-600 flex items-center justify-center text-white hover:text-blue-400 hover:border-blue-400 transition-all hover:scale-105 active:scale-95 shadow-xs"
                                            title="Click to view Facebook QR code"
                                            aria-label="Facebook QR"
                                        >
                                            <Facebook className="w-4 h-4" />
                                        </button>
                                    )}
                                    {profile.instagramUrl && (
                                        <button
                                            type="button"
                                            onClick={() => openQr('instagram', profile.instagramUrl, profile.instagramQrUrl)}
                                            className="w-10 h-10 rounded-xl bg-charcoal-700/60 border border-charcoal-600 flex items-center justify-center text-white hover:text-pink-400 hover:border-pink-400 transition-all hover:scale-105 active:scale-95 shadow-xs"
                                            title="Click to view Instagram QR code"
                                            aria-label="Instagram QR"
                                        >
                                            <Instagram className="w-4 h-4" />
                                        </button>
                                    )}
                                    {profile.telegramUrl && (
                                        <button
                                            type="button"
                                            onClick={() => openQr('telegram', profile.telegramUrl, profile.telegramQrUrl)}
                                            className="w-10 h-10 rounded-xl bg-charcoal-700/60 border border-charcoal-600 flex items-center justify-center text-white hover:text-sky-400 hover:border-sky-400 transition-all hover:scale-105 active:scale-95 shadow-xs"
                                            title="Click to view Telegram QR code"
                                            aria-label="Telegram QR"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.16-.04-.24-.02-.11.02-1.78 1.13-5.03 3.32-.48.33-.91.49-1.3.48-.43-.01-1.25-.24-1.86-.44-.75-.24-1.34-.37-1.29-.79.03-.22.33-.44.9-.68 3.51-1.53 5.86-2.54 7.05-3.04 3.35-1.4 4.05-1.64 4.5-1.65.1 0 .32.02.46.14.12.1.15.24.17.34-.01.07.01.23 0 .36z"/>
                                            </svg>
                                        </button>
                                    )}
                                    {profile.whatsappUrl && (
                                        <button
                                            type="button"
                                            onClick={() => openQr('whatsapp', profile.whatsappUrl, profile.whatsappQrUrl)}
                                            className="w-10 h-10 rounded-xl bg-charcoal-700/60 border border-charcoal-600 flex items-center justify-center text-white hover:text-emerald-400 hover:border-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-xs"
                                            title="Click to view WhatsApp QR code"
                                            aria-label="WhatsApp QR"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.16 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.17-.47-.29z"/>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Col: Contact Form */}
                        <div className="lg:col-span-7 bg-white text-charcoal-900 p-8 rounded-2xl shadow-sm">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Bot Honeypot field */}
                                <div className="hidden" aria-hidden="true">
                                    <input
                                        type="text"
                                        name="website_url_honey"
                                        tabIndex="-1"
                                        autoComplete="off"
                                        value={honeypot}
                                        onChange={(e) => setHoneypot(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-devorange-500 focus:ring-2 focus:ring-devyellow-300 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-devorange-500 focus:ring-2 focus:ring-devyellow-300 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Describe your vision or inquiry..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-devorange-500 focus:ring-2 focus:ring-devyellow-300 text-sm"
                                    />
                                </div>

                                {status.success && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <span>Message received. I will be in touch shortly!</span>
                                    </div>
                                )}

                                {status.error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                        <span>{status.error}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status.loading}
                                    className="w-full py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-devyellow-400 via-devorange-400 to-devorange-500 text-charcoal-900 shadow-warm-sm hover:shadow-warm-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {status.loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
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
        </section>
    );
};

export default ContactSection;