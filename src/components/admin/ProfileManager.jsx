import React, { useState } from 'react';
import ImageUploader from '../common/ImageUploader';
import { api } from '../../services/api';
import { aiService } from '../../services/aiService';
import { Save, CheckCircle2, AlertCircle, Loader2, Sparkles, QrCode, Trash2, Eye, ExternalLink, Github, Facebook, Instagram } from 'lucide-react';

export const ProfileManager = ({ profile, onUpdated }) => {
    const [formData, setFormData] = useState({
        name: profile?.name || '',
        tagline: profile?.tagline || 'Artificial Intelligence Enthusiast, Vibe Developer and Creative Developer',
        description: profile?.description || '',
        avatarUrl: profile?.avatarUrl || '',
        avatarUrl2: profile?.avatarUrl2 || '',
        avatarUrl3: profile?.avatarUrl3 || '',
        email: profile?.email || '',
        githubUrl: profile?.githubUrl || '',
        githubQrUrl: profile?.githubQrUrl || '',
        facebookUrl: profile?.facebookUrl || '',
        facebookQrUrl: profile?.facebookQrUrl || '',
        instagramUrl: profile?.instagramUrl || '',
        instagramQrUrl: profile?.instagramQrUrl || '',
        telegramUrl: profile?.telegramUrl || '',
        telegramQrUrl: profile?.telegramQrUrl || '',
        whatsappUrl: profile?.whatsappUrl || '',
        whatsappQrUrl: profile?.whatsappQrUrl || '',
    });

    const [status, setStatus] = useState({ loading: false, success: false, error: '' });
    const [qrSaveStatus, setQrSaveStatus] = useState({ loading: false, success: '', error: '' });
    const [aiPolishing, setAiPolishing] = useState(false);
    const [activeSocialTab, setActiveSocialTab] = useState('instagram');

    // Keep formData synchronized without wiping non-empty user QR codes with empty strings
    React.useEffect(() => {
        if (profile) {
            setFormData(prev => ({
                ...prev,
                name: profile.name || prev.name,
                tagline: profile.tagline || prev.tagline,
                description: profile.description || prev.description,
                avatarUrl: profile.avatarUrl || prev.avatarUrl,
                avatarUrl2: profile.avatarUrl2 || prev.avatarUrl2,
                avatarUrl3: profile.avatarUrl3 || prev.avatarUrl3,
                email: (profile.email && profile.email !== 'contact@devj.com') ? profile.email : (prev.email || profile.email || 'agustino.julian@outlook.ph'),
                githubUrl: profile.githubUrl || prev.githubUrl,
                githubQrUrl: profile.githubQrUrl || prev.githubQrUrl || '',
                facebookUrl: profile.facebookUrl || prev.facebookUrl,
                facebookQrUrl: profile.facebookQrUrl || prev.facebookQrUrl || '',
                instagramUrl: profile.instagramUrl || prev.instagramUrl,
                instagramQrUrl: profile.instagramQrUrl || prev.instagramQrUrl || '',
                telegramUrl: profile.telegramUrl || prev.telegramUrl,
                telegramQrUrl: profile.telegramQrUrl || prev.telegramQrUrl || '',
                whatsappUrl: profile.whatsappUrl || prev.whatsappUrl,
                whatsappQrUrl: profile.whatsappQrUrl || prev.whatsappQrUrl || '',
            }));
        }
    }, [profile]);

    // Instant auto-save when a custom QR code finishes uploading
    const handleQrUploaded = async (platformId, url) => {
        if (!url) return;
        const qrKey = `${platformId}QrUrl`;
        setQrSaveStatus({ loading: true, success: '', error: '' });

        setFormData(prev => {
            const updated = { ...prev, [qrKey]: url };
            // Auto-persist immediately to Firestore and localStorage
            api.updateProfile(updated)
                .then(() => {
                    setQrSaveStatus({ loading: false, success: `✓ Saved ${platformId.toUpperCase()} QR code!`, error: '' });
                    if (onUpdated) onUpdated();
                    setTimeout(() => setQrSaveStatus(p => ({ ...p, success: '' })), 4000);
                })
                .catch(err => {
                    console.error('Error auto-saving QR code:', err);
                    setQrSaveStatus({ loading: false, success: '', error: err.message || 'Failed to save QR code' });
                });
            return updated;
        });
    };

    // Instant auto-save when reverting a custom QR code
    const handleQrRemove = async (platformId) => {
        const qrKey = `${platformId}QrUrl`;
        setQrSaveStatus({ loading: true, success: '', error: '' });

        setFormData(prev => {
            const updated = { ...prev, [qrKey]: '' };
            api.updateProfile(updated)
                .then(() => {
                    setQrSaveStatus({ loading: false, success: `✓ Reverted ${platformId.toUpperCase()} to auto QR!`, error: '' });
                    if (onUpdated) onUpdated();
                    setTimeout(() => setQrSaveStatus(p => ({ ...p, success: '' })), 4000);
                })
                .catch(err => {
                    console.error('Error reverting QR code:', err);
                    setQrSaveStatus({ loading: false, success: '', error: err.message || 'Failed to revert QR code' });
                });
            return updated;
        });
    };

    const handleSave = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setStatus({ loading: true, success: false, error: '' });

        try {
            await api.updateProfile(formData);
            setStatus({ loading: false, success: true, error: '' });
            onUpdated();
            setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 4000);
        } catch (err) {
            setStatus({ loading: false, success: false, error: err.message || 'Failed to update profile' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-black text-charcoal-900">Profile Management</h2>
                <p className="text-xs text-charcoal-500">
                    Modify your hero information, dynamic rotating avatars, and public brand metadata.
                </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6 max-w-4xl bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                {status.success && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Profile successfully saved and updated!
                    </div>
                )}

                {status.error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" /> {status.error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                            Your Full Display Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-devorange-500 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                            Primary Contact Email
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-devorange-500 text-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800">
                        Exact Tagline & Bio
                    </label>
                    <button
                        type="button"
                        onClick={async () => {
                            setAiPolishing(true);
                            try {
                                const res = await aiService.generateProfileBio(formData, 'innovative and visionary');
                                setFormData(prev => ({
                                    ...prev,
                                    tagline: res.tagline || prev.tagline,
                                    description: res.description || prev.description,
                                }));
                            } catch (e) {
                                alert(e.message || 'AI generation failed');
                            } finally {
                                setAiPolishing(false);
                            }
                        }}
                        disabled={aiPolishing}
                        className="px-3 py-1 rounded-xl bg-devyellow-100 hover:bg-devyellow-200 text-devorange-600 border border-devyellow-300 text-xs font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                    >
                        {aiPolishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-devyellow-600 fill-devyellow-400" />}
                        <span>{aiPolishing ? 'Polishing with Gemini...' : '✨ AI Polish Bio & Tagline'}</span>
                    </button>
                </div>

                <div>
                    <label className="block text-xs font-bold text-charcoal-700 mb-1">
                        Tagline
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-devorange-500 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-charcoal-700 mb-1">
                        Personal Bio & Overview
                    </label>
                    <textarea
                        rows={4}
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-devorange-500 text-sm"
                    />
                </div>

                {/* Dynamic 3-Hero Image Upload Section */}
                <div className="space-y-3 pt-2">
                    <div>
                        <h3 className="text-sm font-extrabold text-charcoal-900">Hero 3D Rotating Portraits (3 Photos)</h3>
                        <p className="text-xs text-charcoal-500">Upload up to 3 portrait pictures to cycle through in the 3D Hero Carousel.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ImageUploader
                            label="Photo 1 (Primary Portrait)"
                            currentImage={formData.avatarUrl}
                            onImageUploaded={(url) => setFormData({ ...formData, avatarUrl: url })}
                        />
                        <ImageUploader
                            label="Photo 2 (Carousel Card 2)"
                            currentImage={formData.avatarUrl2}
                            onImageUploaded={(url) => setFormData({ ...formData, avatarUrl2: url })}
                        />
                        <ImageUploader
                            label="Photo 3 (Carousel Card 3)"
                            currentImage={formData.avatarUrl3}
                            onImageUploaded={(url) => setFormData({ ...formData, avatarUrl3: url })}
                        />
                    </div>
                </div>

                {/* Social Media & Interactive QR Codes */}
                <div className="pt-4 border-t border-gray-100 space-y-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <QrCode className="w-4 h-4 text-devorange-500" />
                            <h3 className="text-sm font-black uppercase tracking-wider text-charcoal-800">
                                Social Media Links & Interactive QR Codes
                            </h3>
                        </div>
                        <p className="text-xs text-charcoal-500 mt-0.5">
                            When visitors click your social icons on the portfolio, an interactive QR modal opens. You can upload your own custom QR code for each platform (from mobile app), or leave it empty to automatically generate a smart QR code from your link.
                        </p>
                    </div>

                    {/* Platform Selector Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: 'instagram', label: 'Instagram' },
                            { id: 'github', label: 'GitHub' },
                            { id: 'telegram', label: 'Telegram' },
                            { id: 'whatsapp', label: 'WhatsApp' },
                            { id: 'facebook', label: 'Facebook' },
                        ].map((tab) => {
                            const isCustom = Boolean(formData[`${tab.id}QrUrl`]);
                            const hasUrl = Boolean(formData[`${tab.id}Url`]);
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveSocialTab(tab.id)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                                        activeSocialTab === tab.id
                                            ? 'bg-charcoal-900 text-devyellow-400 border-charcoal-900 shadow-sm'
                                            : 'bg-white text-charcoal-700 border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="capitalize">{tab.label}</span>
                                    {isCustom ? (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-devyellow-400 text-charcoal-900">
                                            Custom QR
                                        </span>
                                    ) : hasUrl ? (
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Auto QR Ready" />
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>

                    {/* Feedback Alert for QR code saving */}
                    {qrSaveStatus.success && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{qrSaveStatus.success}</span>
                        </div>
                    )}
                    {qrSaveStatus.error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                            <span>{qrSaveStatus.error}</span>
                        </div>
                    )}

                    {/* Active Platform Settings Card */}
                    {(() => {
                        const urlKey = `${activeSocialTab}Url`;
                        const qrKey = `${activeSocialTab}QrUrl`;
                        const currentUrl = formData[urlKey] || '';
                        const currentCustomQr = formData[qrKey] || '';
                        const autoQrUrl = currentUrl
                            ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(currentUrl)}&size=300x300&margin=10&color=0e1117&bgcolor=ffffff`
                            : '';
                        const displayQr = currentCustomQr || autoQrUrl;

                        return (
                            <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-200 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                    <div className="md:col-span-8 space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-charcoal-800 mb-1 capitalize">
                                                {activeSocialTab} Profile Link / URL
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={`https://${activeSocialTab}.com/...`}
                                                value={currentUrl}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setFormData(prev => ({ ...prev, [urlKey]: val }));
                                                }}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:border-devorange-500 font-mono shadow-2xs"
                                            />
                                        </div>

                                        <ImageUploader
                                            key={`${activeSocialTab}-${currentCustomQr ? 'custom' : 'empty'}`}
                                            label={`Upload Custom ${activeSocialTab.toUpperCase()} QR Code (Auto-saves on upload)`}
                                            currentImage={currentCustomQr}
                                            onImageUploaded={(url) => handleQrUploaded(activeSocialTab, url)}
                                        />

                                        <div className="flex items-center gap-3 pt-1">
                                            {currentCustomQr && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleQrRemove(activeSocialTab)}
                                                    className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5 transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Revert to Auto-Generated QR
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={handleSave}
                                                disabled={status.loading || qrSaveStatus.loading}
                                                className="px-3.5 py-1.5 rounded-xl bg-charcoal-900 hover:bg-black text-devyellow-400 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                                            >
                                                {status.loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                                <span>Save All Links & QRs</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Live QR Preview Box */}
                                    <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-200 shadow-xs text-center space-y-2">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-charcoal-400">
                                            Live QR Code Preview
                                        </span>

                                        <div className="w-36 h-36 rounded-xl border border-gray-100 p-2 flex items-center justify-center bg-gray-50 relative overflow-hidden">
                                            {displayQr ? (
                                                <img
                                                    src={displayQr}
                                                    alt={`${activeSocialTab} QR Preview`}
                                                    className="w-full h-full object-contain rounded-lg"
                                                />
                                            ) : (
                                                <div className="text-charcoal-400 flex flex-col items-center justify-center space-y-1">
                                                    <QrCode className="w-8 h-8 stroke-1" />
                                                    <span className="text-[10px] font-bold">Enter URL or upload QR</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-[10px] font-extrabold uppercase">
                                            {currentCustomQr ? (
                                                <span className="px-2 py-0.5 rounded-full bg-devyellow-100 text-devorange-700 border border-devyellow-300">
                                                    Custom Uploaded QR
                                                </span>
                                            ) : currentUrl ? (
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    Auto-Generated QR
                                                </span>
                                            ) : (
                                                <span className="text-charcoal-400">Not configured</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={status.loading}
                        className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-devyellow-400 via-devorange-400 to-devorange-500 text-charcoal-900 shadow-warm-sm hover:shadow-warm-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {status.loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> Save Profile Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileManager;