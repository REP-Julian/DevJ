import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
    LayoutDashboard,
    User,
    Wrench,
    Award,
    FolderGit2,
    Heart,
    Mail,
    LogOut,
    ExternalLink,
    Menu,
    X,
    Sparkles,
    Shield
} from 'lucide-react';

export const AdminLayout = ({ children, activeTab, setActiveTab }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { id: 'ai', label: 'AI Studio & Copilot', icon: Sparkles, badge: 'Gemini' },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'skills', label: 'Skills', icon: Wrench },
        { id: 'achievements', label: 'Achievements', icon: Award },
        { id: 'projects', label: 'Projects', icon: FolderGit2 },
        { id: 'hobbies', label: 'Hobbies', icon: Heart },
        { id: 'messages', label: 'Inquiries', icon: Mail },
        { id: 'settings', label: 'Security & Login', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-6 justify-between shrink-0">
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-charcoal-900 text-devyellow-400 font-extrabold flex items-center justify-center text-base">
                                DV
                            </div>
                            <div>
                                <h1 className="font-extrabold text-charcoal-900 text-base leading-tight">DevJ CMS</h1>
                                <p className="text-[10px] text-devorange-600 font-bold uppercase tracking-wider">Admin Workspace</p>
                            </div>
                        </Link>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            const isAi = item.id === 'ai';
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                        isActive
                                            ? 'bg-devyellow-100 text-devorange-600 shadow-sm'
                                            : isAi
                                            ? 'text-charcoal-900 bg-devyellow-50/50 hover:bg-devyellow-100/50 border border-devyellow-200/60'
                                            : 'text-charcoal-800 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-devorange-600' : isAi ? 'text-devorange-500 fill-devyellow-400' : 'text-charcoal-500'}`} />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.badge && (
                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-devorange-600 text-white shadow-xs">
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="pt-6 border-t border-gray-100 space-y-2">
                    <div className="px-3 py-2 rounded-xl bg-devyellow-100/50 border border-devyellow-200 flex items-center justify-between text-[10px] font-semibold text-charcoal-900">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Firebase & Cloudinary
                        </span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white text-devorange-600 border border-devyellow-300 font-extrabold">
                            Live Sync
                        </span>
                    </div>
                    <Link
                        to="/"
                        target="_blank"
                        className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-charcoal-800 hover:bg-gray-50"
                    >
                        <span>Live Portfolio</span>
                        <ExternalLink className="w-3.5 h-3.5 text-charcoal-500" />
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Topbar */}
            <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-charcoal-900 text-devyellow-400 font-extrabold flex items-center justify-center text-sm">
                        DV
                    </div>
                    <span className="font-extrabold text-charcoal-900 text-sm">DevJ Admin</span>
                </div>
                <button
                    onClick={() => setMobileNavOpen(!mobileNavOpen)}
                    className="p-2 text-charcoal-800"
                >
                    {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {mobileNavOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 p-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setMobileNavOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 rounded-lg text-xs font-bold ${activeTab === item.id ? 'bg-devyellow-100 text-devorange-600' : 'text-charcoal-800'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                    <div className="pt-2 border-t border-gray-100 flex gap-2">
                        <Link to="/" className="w-1/2 py-2 text-center text-xs font-bold border rounded-lg">
                            Live Site
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-1/2 py-2 text-center text-xs font-bold bg-red-50 text-red-600 rounded-lg"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Pane */}
            <main className="flex-1 p-6 md:p-10 max-w-6xl overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;