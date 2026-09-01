import React, { useState } from 'react';
import ImageUploader from '../common/ImageUploader';
import { api } from '../../services/api';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

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
        facebookUrl: profile?.facebookUrl || '',
        instagramUrl: profile?.instagramUrl || '',
        telegramUrl: profile?.telegramUrl || '',
        whatsappUrl: profile?.whatsappUrl || '',
    });

    const [status, setStatus] = useState({ loading: false, success: false, error: '' });

    const handleSave = async (e) => {
        e.preventDefault();
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

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                        Exact Tagline
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
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

                {/* Social Media Handles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                            GitHub URL
                        </label>
                        <input
                            type="text"
                            placeholder="https://github.com/..."
                            value={formData.githubUrl}
                            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-devorange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                            Facebook URL
                        </label>
                        <input
                            type="text"
                            placeholder="https://facebook.com/..."
                            value={formData.facebookUrl}
                            onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-devorange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                            Instagram URL
                        </label>
                        <input
                            type="text"
                            placeholder="https://instagram.com/..."
                            value={formData.instagramUrl}
                            onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-devorange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                            Telegram Link / Username
                        </label>
                        <input
                            type="text"
                            placeholder="https://t.me/username"
                            value={formData.telegramUrl}
                            onChange={(e) => setFormData({ ...formData, telegramUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-devorange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                            WhatsApp Direct Link / Number
                        </label>
                        <input
                            type="text"
                            placeholder="https://wa.me/1234567890"
                            value={formData.whatsappUrl}
                            onChange={(e) => setFormData({ ...formData, whatsappUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-devorange-500"
                        />
                    </div>
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