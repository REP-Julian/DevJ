import React, { useState, useEffect } from 'react';
import { Shield, Key, Mail, Check, AlertCircle, Loader2, Eye, EyeOff, Smartphone, Globe, Lock } from 'lucide-react';
import { api } from '../../services/api';

export const SecuritySettings = () => {
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const loadInfo = async () => {
            try {
                const info = await api.getAdminInfo();
                setCurrentEmail(info.email || '');
                setNewEmail(info.email || '');
            } catch (err) {
                console.warn('Failed to load admin info:', err);
            }
        };
        loadInfo();
    }, []);

    const handleUpdateCredentials = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (!currentPassword) {
            setStatus({ type: 'error', message: 'Current password is required to make changes.' });
            return;
        }

        if (newPassword) {
            if (newPassword.length < 6) {
                setStatus({ type: 'error', message: 'New password must be at least 6 characters.' });
                return;
            }
            if (newPassword !== confirmPassword) {
                setStatus({ type: 'error', message: 'New passwords do not match.' });
                return;
            }
        }

        try {
            setLoading(true);
            await api.changePassword(
                currentPassword,
                newPassword || currentPassword,
                newEmail.trim() || currentEmail
            );
            setStatus({
                type: 'success',
                message: 'Credentials updated successfully in Firebase Cloud! You can now log in from any phone or computer with these credentials.'
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setCurrentEmail(newEmail.trim() || currentEmail);
        } catch (err) {
            setStatus({ type: 'error', message: err.message || 'Failed to update credentials.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-devyellow-100/80 flex items-center justify-center text-devorange-600">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-extrabold text-charcoal-900">Admin Security & Credentials</h2>
                        <p className="text-xs text-charcoal-500">
                            Synced via Firebase Cloud. Changes apply immediately across all devices (phones, laptops, and tablets).
                        </p>
                    </div>
                </div>
            </div>

            {/* Cloud Credentials Form */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-sm font-extrabold text-charcoal-900 flex items-center gap-2">
                            <Key className="w-4 h-4 text-devorange-500" />
                            Update Admin Login Credentials
                        </h3>
                        <p className="text-xs text-charcoal-500 mt-0.5">
                            Set your custom email and private password.
                        </p>
                    </div>
                    <span className="text-[10px] uppercase px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-bold border border-green-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Cloud Auth Active
                    </span>
                </div>

                {status.message && (
                    <div
                        className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                            status.type === 'success'
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                    >
                        {status.type === 'success' ? (
                            <Check className="w-4 h-4 text-green-600 shrink-0" />
                        ) : (
                            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                        <span>{status.message}</span>
                    </div>
                )}

                <form onSubmit={handleUpdateCredentials} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                            Admin Login Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="your-email@domain.com"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-devorange-500 text-xs font-medium"
                            />
                            <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                                Current Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPass ? 'text' : 'password'}
                                    required
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-devorange-500 text-xs font-medium"
                                />
                                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                                    className="absolute right-3 top-3 text-charcoal-400 hover:text-charcoal-700"
                                >
                                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                                New Password (Leave blank to keep current)
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPass ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password (min 6 chars)"
                                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-devorange-500 text-xs font-medium"
                                />
                                <Key className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPass(!showNewPass)}
                                    className="absolute right-3 top-3 text-charcoal-400 hover:text-charcoal-700"
                                >
                                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {newPassword && (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-type new password"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-devorange-500 text-xs font-medium"
                            />
                        </div>
                    )}

                    <div className="pt-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-devyellow-400 via-devorange-400 to-devorange-500 text-charcoal-900 shadow-warm-sm hover:shadow-warm-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Saving Credentials to Cloud...
                                </>
                            ) : (
                                <>
                                    <Shield className="w-4 h-4" /> Update & Sync to Cloud
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Mobile & Public Access Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Smartphone className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-charcoal-900 text-xs uppercase tracking-wider">Mobile Access</h4>
                    <p className="text-xs text-charcoal-600 leading-relaxed">
                        You can open your live portfolio on any mobile browser (Safari, Chrome) and navigate to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-devorange-600 font-bold">/login</code> to manage your portfolio directly from your phone.
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Globe className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-charcoal-900 text-xs uppercase tracking-wider">Cloud Firestore Persistence</h4>
                    <p className="text-xs text-charcoal-600 leading-relaxed">
                        Credentials and portfolio content are stored in your Google Firebase Firestore cloud. When you update on desktop or phone, changes are instantly live everywhere.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SecuritySettings;
