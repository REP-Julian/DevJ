import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, ArrowLeft, Shield, AlertTriangle, Lock } from 'lucide-react';
import { checkLoginRateLimit, recordFailedLoginAttempt, clearLoginRateLimit } from '../utils/security';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [honeypot, setHoneypot] = useState(''); // Hidden trap field for bots
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [lockoutTime, setLockoutTime] = useState(0);

    const { login } = useAuth();
    const navigate = useNavigate();

    // Check rate limiter on mount & countdown
    useEffect(() => {
        const check = checkLoginRateLimit();
        if (!check.allowed) {
            setLockoutTime(check.remainingSeconds || 180);
            setError(check.message);
        }
    }, []);

    useEffect(() => {
        if (lockoutTime <= 0) return;
        const timer = setInterval(() => {
            setLockoutTime((prev) => {
                if (prev <= 1) {
                    setError('');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [lockoutTime]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // 1. Bot Honeypot trap check
        if (honeypot.trim() !== '') {
            console.warn('Bot traffic detected & discarded.');
            setError('Access Denied: Automated traffic blocked.');
            return;
        }

        // 2. Rate Limit Lockout check
        const rateLimitCheck = checkLoginRateLimit();
        if (!rateLimitCheck.allowed) {
            setLockoutTime(rateLimitCheck.remainingSeconds || 180);
            setError(rateLimitCheck.message);
            return;
        }

        setLoading(true);

        try {
            await login(email, password);
            clearLoginRateLimit();
            navigate('/admin');
        } catch (err) {
            const attemptInfo = recordFailedLoginAttempt();
            if (attemptInfo.locked) {
                setLockoutTime(attemptInfo.remainingSeconds);
                setError(`Too many failed attempts. Security lockout active for ${attemptInfo.remainingSeconds}s.`);
            } else {
                setError(`${err.message || 'Invalid credentials'}. (${attemptInfo.remainingAttempts} attempts remaining)`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
            {/* Background Ambience */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-devyellow-300/30 to-devorange-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-700 hover:text-devorange-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Portfolio
                </Link>

                <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-warm-md">
                    <div className="text-center space-y-2 mb-7">
                        <div className="w-12 h-12 rounded-xl bg-charcoal-900 text-devyellow-400 font-black text-xl flex items-center justify-center mx-auto shadow-sm">
                            DV
                        </div>
                        <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full w-fit mx-auto">
                            <Shield className="w-3.5 h-3.5" /> Protected Portal
                        </div>
                        <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">Admin Authentication</h1>
                        <p className="text-xs text-charcoal-500">
                            Sign in to manage DevJ portfolio architecture & content
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Hidden Honeypot field for bot trapping */}
                        <div className="hidden" aria-hidden="true">
                            <input
                                type="text"
                                name="username_website_val"
                                tabIndex="-1"
                                autoComplete="off"
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                required
                                disabled={lockoutTime > 0}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@devj.com"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-devorange-500 focus:ring-2 focus:ring-devyellow-300 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    disabled={lockoutTime > 0}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-devorange-500 focus:ring-2 focus:ring-devyellow-300 text-sm pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500 hover:text-charcoal-900"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-medium flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || lockoutTime > 0}
                            className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-devyellow-400 via-devorange-400 to-devorange-500 text-charcoal-900 shadow-warm-sm hover:shadow-warm-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                                </>
                            ) : lockoutTime > 0 ? (
                                `Locked (${lockoutTime}s)`
                            ) : (
                                <>
                                    <Lock className="w-3.5 h-3.5" /> Sign In to CMS
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;