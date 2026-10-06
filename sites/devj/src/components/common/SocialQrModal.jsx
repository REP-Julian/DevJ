import React, { useEffect, useState } from 'react';
import {
    X,
    ExternalLink,
    Copy,
    Check,
    Download,
    QrCode,
    Sparkles,
    ShieldCheck,
    Github,
    Facebook,
    Instagram
} from 'lucide-react';

const PLATFORM_CONFIG = {
    github: {
        name: 'GitHub',
        color: 'from-gray-900 via-charcoal-900 to-black',
        accentColor: 'text-gray-300',
        badgeBg: 'bg-charcoal-800 text-white border-charcoal-700',
        icon: (props) => <Github {...props} />,
        subtitle: 'Scan to explore open-source code & repositories'
    },
    facebook: {
        name: 'Facebook',
        color: 'from-blue-600 via-blue-700 to-blue-900',
        accentColor: 'text-blue-400',
        badgeBg: 'bg-blue-900/60 text-blue-200 border-blue-700',
        icon: (props) => <Facebook {...props} />,
        subtitle: 'Scan to connect on Facebook'
    },
    instagram: {
        name: 'Instagram',
        color: 'from-fuchsia-600 via-pink-600 to-amber-500',
        accentColor: 'text-pink-400',
        badgeBg: 'bg-pink-900/60 text-pink-200 border-pink-700',
        icon: (props) => <Instagram {...props} />,
        subtitle: 'Scan to connect on Instagram'
    },
    telegram: {
        name: 'Telegram',
        color: 'from-sky-500 via-blue-600 to-sky-700',
        accentColor: 'text-sky-400',
        badgeBg: 'bg-sky-900/60 text-sky-200 border-sky-700',
        icon: (props) => (
            <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.16-.04-.24-.02-.11.02-1.78 1.13-5.03 3.32-.48.33-.91.49-1.3.48-.43-.01-1.25-.24-1.86-.44-.75-.24-1.34-.37-1.29-.79.03-.22.33-.44.9-.68 3.51-1.53 5.86-2.54 7.05-3.04 3.35-1.4 4.05-1.64 4.5-1.65.1 0 .32.02.46.14.12.1.15.24.17.34-.01.07.01.23 0 .36z" />
            </svg>
        ),
        subtitle: 'Scan to message directly on Telegram'
    },
    whatsapp: {
        name: 'WhatsApp',
        color: 'from-emerald-600 via-teal-600 to-emerald-800',
        accentColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-900/60 text-emerald-200 border-emerald-700',
        icon: (props) => (
            <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.16 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.17-.47-.29z" />
            </svg>
        ),
        subtitle: 'Scan to chat on WhatsApp'
    }
};

export const SocialQrModal = ({
    isOpen,
    onClose,
    platform = 'instagram',
    url = '',
    customQrUrl = '',
    profileName = 'Julian Agustino'
}) => {
    const [copied, setCopied] = useState(false);

    // Keyboard navigation (ESC closes)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.instagram;

    // Use custom uploaded QR code if available, otherwise generate dynamic QR code via QRServer API
    const generatedQrUrl = url
        ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=400x400&margin=15&color=0e1117&bgcolor=ffffff`
        : '';
    const activeQrUrl = customQrUrl || generatedQrUrl;
    const isCustomUploaded = Boolean(customQrUrl);

    const handleCopy = () => {
        if (!url) return;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
            />

            {/* Modal Card */}
            <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                {/* Header with Platform Branding Gradient */}
                <div className={`p-6 bg-gradient-to-r ${config.color} text-white relative`}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-sm">
                            {config.icon({ className: 'w-6 h-6' })}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-black text-lg text-white leading-tight">{config.name}</h3>
                                {isCustomUploaded ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-devyellow-400 text-charcoal-900">
                                        Custom QR
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white">
                                        Auto QR
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-white/80 mt-0.5 font-medium">{profileName}</p>
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex flex-col items-center text-center space-y-4">
                    {/* QR Code Frame with Scanner Corners */}
                    <div className="relative p-4 bg-white rounded-3xl border-2 border-gray-100 shadow-warm-md">
                        {/* Scanner Corner Guides */}
                        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-devorange-500 rounded-tl-lg pointer-events-none" />
                        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-devorange-500 rounded-tr-lg pointer-events-none" />
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-devorange-500 rounded-bl-lg pointer-events-none" />
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-devorange-500 rounded-br-lg pointer-events-none" />

                        {activeQrUrl ? (
                            <img
                                src={activeQrUrl}
                                alt={`${config.name} QR Code`}
                                className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-2xl"
                            />
                        ) : (
                            <div className="w-56 h-56 sm:w-64 sm:h-64 flex flex-col items-center justify-center text-charcoal-400">
                                <QrCode className="w-12 h-12 mb-2 stroke-1" />
                                <span className="text-xs font-bold">No link or QR configured</span>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-charcoal-900 flex items-center justify-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-devyellow-500 fill-devyellow-400" />
                            Scan with your smartphone camera
                        </p>
                        <p className="text-[11px] text-charcoal-500">{config.subtitle}</p>
                    </div>

                    {/* URL Snippet Box */}
                    {url && (
                        <div className="w-full p-2.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between gap-2 text-xs">
                            <span className="text-charcoal-700 font-mono truncate text-[11px] max-w-[220px]">
                                {url}
                            </span>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="px-2.5 py-1 rounded-xl bg-white border border-gray-200 hover:border-devorange-400 text-charcoal-700 text-[11px] font-bold shrink-0 flex items-center gap-1 shadow-2xs transition-all"
                            >
                                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                <span>{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="w-full grid grid-cols-2 gap-2.5 pt-2">
                        {url && (
                            <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="py-2.5 px-3 rounded-2xl bg-charcoal-900 hover:bg-black text-devyellow-400 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-warm-sm"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Open Link</span>
                            </a>
                        )}

                        {activeQrUrl && (
                            <a
                                href={activeQrUrl}
                                download={`${platform}-qr-code.png`}
                                target="_blank"
                                rel="noreferrer"
                                className={`py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 border border-gray-200 hover:border-devorange-400 bg-gray-50 hover:bg-white text-charcoal-800 transition-all ${
                                    !url ? 'col-span-2' : ''
                                }`}
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>Save QR</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialQrModal;
