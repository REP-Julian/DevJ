import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { aiService } from '../../services/aiService';
import { notify } from '../../services/notificationService';
import {
    Mail,
    Trash2,
    Calendar,
    User,
    RefreshCw,
    Sparkles,
    Send,
    Copy,
    Check,
    Loader2,
    X,
    ExternalLink,
    Search,
    Clock,
    Inbox
} from 'lucide-react';

export const MessagesManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // AI Reply Modal State
    const [activeMsg, setActiveMsg] = useState(null);
    const [replyTone, setReplyTone] = useState('warm and professional');
    const [draftedReply, setDraftedReply] = useState('');
    const [draftLoading, setDraftLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const fetchMessages = async (showNotification = false) => {
        try {
            setLoading(true);
            const data = await api.getMessages();
            setMessages(data || []);
            if (showNotification) {
                notify.success('Direct inquiries refreshed!', 'Inbox Synced');
            }
        } catch (err) {
            console.error(err);
            if (showNotification) {
                notify.error(err.message || 'Failed to refresh inquiries', 'Sync Error');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages(false);
    }, []);

    const handleDelete = async (id) => {
        const confirmed = await notify.confirm(
            'Are you sure you want to delete this inquiry message? This cannot be undone.',
            'Delete Message',
            { confirmText: 'Delete' }
        );
        if (confirmed) {
            try {
                await api.deleteMessage(id);
                fetchMessages(false);
                notify.success('Inquiry message removed successfully.', 'Message Deleted');
            } catch (err) {
                notify.error(err.message || 'Failed to delete message', 'Delete Failed');
            }
        }
    };

    const handleOpenAiReply = async (msg) => {
        setActiveMsg(msg);
        setDraftLoading(true);
        setDraftedReply('');
        setCopied(false);

        try {
            const draft = await aiService.draftInquiryReply(msg.name, msg.email, msg.message, replyTone);
            setDraftedReply(draft);
        } catch (err) {
            notify.error(err.message || 'Failed to generate AI draft reply', 'AI Drafting Failed');
            setDraftedReply('');
        } finally {
            setDraftLoading(false);
        }
    };

    // Auto-regenerate when switching tones
    const handleToneSelect = async (toneId) => {
        setReplyTone(toneId);
        if (!activeMsg) return;
        setDraftLoading(true);
        setCopied(false);
        try {
            const draft = await aiService.draftInquiryReply(activeMsg.name, activeMsg.email, activeMsg.message, toneId);
            setDraftedReply(draft);
        } catch (err) {
            notify.error(err.message || 'Failed to draft reply in selected tone', 'Tone Generation Failed');
        } finally {
            setDraftLoading(false);
        }
    };

    const handleRegenerateReply = async () => {
        if (!activeMsg) return;
        setDraftLoading(true);
        setCopied(false);
        try {
            const draft = await aiService.draftInquiryReply(activeMsg.name, activeMsg.email, activeMsg.message, replyTone);
            setDraftedReply(draft);
        } catch (err) {
            notify.error(err.message || 'Failed to regenerate reply', 'Regeneration Failed');
        } finally {
            setDraftLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(draftedReply);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Safe human-friendly date & time
    const formatMessageDate = (dateStr) => {
        if (!dateStr) return 'Recent';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return 'Recent';
            return date.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return 'Recent';
        }
    };

    // Safe URI-encoded mailto components
    const mailtoSubject = encodeURIComponent(
        activeMsg?.subject ? `Re: ${activeMsg.subject}` : `Re: Inquiry on DevJ Portfolio`
    );
    const mailtoBody = encodeURIComponent(draftedReply || '');
    const mailtoUrl = activeMsg ? `mailto:${activeMsg.email}?subject=${mailtoSubject}&body=${mailtoBody}` : '#';

    // Search filter
    const filteredMessages = messages.filter((msg) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            (msg.name && msg.name.toLowerCase().includes(q)) ||
            (msg.email && msg.email.toLowerCase().includes(q)) ||
            (msg.message && msg.message.toLowerCase().includes(q))
        );
    });

    return (
        <div className="space-y-6">
            {/* Header with Title, Count Badge, Search & Refresh */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-2xl font-black text-charcoal-900">Direct Inquiries</h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-devyellow-100 text-devorange-600 border border-devyellow-300 shadow-xs">
                            {messages.length}
                        </span>
                    </div>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                        Messages sent via the public portfolio contact form with instant AI response drafting.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Search Bar */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter by name, email..."
                            className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-gray-200 text-xs text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-devorange-500 bg-white"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={() => fetchMessages(true)}
                        disabled={loading}
                        className="p-2 border border-gray-200 rounded-xl text-charcoal-700 hover:bg-gray-50 active:scale-95 transition-all bg-white shadow-xs"
                        title="Refresh Inbox"
                        aria-label="Refresh Inbox"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-devorange-600' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Inquiries List */}
            {filteredMessages.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/90 text-charcoal-500 space-y-3 shadow-xs">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-charcoal-400">
                        <Inbox className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-charcoal-800">
                            {searchQuery ? 'No matching inquiries' : 'Inbox is clear'}
                        </h4>
                        <p className="text-xs text-charcoal-400 mt-1 max-w-sm mx-auto">
                            {searchQuery
                                ? `No direct messages match "${searchQuery}". Try a different keyword.`
                                : 'Any contact inquiries sent from your public portfolio will appear here.'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className="p-6 bg-white rounded-2xl border border-gray-200/90 shadow-sm space-y-3 hover:border-devyellow-300 transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-devyellow-200 to-devorange-200 text-devorange-600 font-bold text-xs flex items-center justify-center border border-devyellow-300/80 shrink-0">
                                        {msg.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-charcoal-900 text-sm leading-tight">{msg.name}</h4>
                                        <a
                                            href={`mailto:${msg.email}`}
                                            className="text-xs text-devorange-600 hover:text-devorange-700 underline font-medium"
                                        >
                                            {msg.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                    <span className="text-[11px] font-semibold text-charcoal-400 flex items-center gap-1.5 mr-2">
                                        <Clock className="w-3 h-3 text-charcoal-400" />
                                        {formatMessageDate(msg.createdAt)}
                                    </span>

                                    <button
                                        onClick={() => handleOpenAiReply(msg)}
                                        className="px-3 py-1.5 rounded-xl bg-devyellow-100 hover:bg-devyellow-200 text-devorange-600 border border-devyellow-300 text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-xs"
                                    >
                                        <Sparkles className="w-3.5 h-3.5 text-devyellow-600 fill-devyellow-400" />
                                        <span>AI Draft Reply</span>
                                    </button>

                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200"
                                        title="Delete Message"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-xs text-charcoal-800 bg-gray-50/80 border border-gray-100 p-4 rounded-xl leading-relaxed whitespace-pre-wrap font-sans">
                                {msg.message}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* AI Draft Reply Modal */}
            {activeMsg && (
                <div 
                    className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-gray-100 space-y-5 animate-popup-zoom">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-devyellow-400 to-devorange-500 flex items-center justify-center text-charcoal-900 shadow-sm">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-charcoal-900 text-base leading-tight">AI Email Reply Drafter</h3>
                                    <p className="text-[11px] text-charcoal-500">Replying to {activeMsg.name} ({activeMsg.email})</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveMsg(null)}
                                className="p-1.5 text-charcoal-400 hover:text-charcoal-700 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Tone Selector with instant regeneration */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <label className="text-xs font-bold text-charcoal-700 shrink-0">Select Reply Tone:</label>
                            <div className="flex flex-wrap items-center gap-1.5">
                                {[
                                    { id: 'warm and professional', label: 'Warm & Professional' },
                                    { id: 'enthusiastic and creative', label: 'Enthusiastic' },
                                    { id: 'technical and concise', label: 'Technical & Direct' },
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => handleToneSelect(t.id)}
                                        disabled={draftLoading}
                                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all active:scale-95 ${
                                            replyTone === t.id
                                                ? 'bg-charcoal-900 text-white shadow-xs'
                                                : 'bg-gray-100 text-charcoal-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                                <button
                                    onClick={handleRegenerateReply}
                                    disabled={draftLoading}
                                    className="p-1.5 text-devorange-600 hover:bg-devyellow-100 rounded-xl transition-colors shrink-0"
                                    title="Regenerate with current tone"
                                >
                                    <RefreshCw className={`w-4 h-4 ${draftLoading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Draft Content */}
                        <div className="relative">
                            {draftLoading ? (
                                <div className="h-48 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-2">
                                    <Loader2 className="w-6 h-6 animate-spin text-devorange-600" />
                                    <span className="text-xs font-bold text-charcoal-600">
                                        Drafting personalized reply ({replyTone})...
                                    </span>
                                </div>
                            ) : (
                                <textarea
                                    rows={8}
                                    value={draftedReply}
                                    onChange={(e) => setDraftedReply(e.target.value)}
                                    placeholder="Drafted reply will appear here..."
                                    className="w-full p-4 rounded-2xl border border-gray-200 text-xs text-charcoal-800 leading-relaxed focus:outline-none focus:border-devorange-500 font-sans resize-none"
                                />
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                            <button
                                onClick={handleCopy}
                                disabled={!draftedReply || draftLoading}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 text-xs font-bold text-charcoal-800 flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {copied ? <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                                <span>{copied ? 'Copied to Clipboard!' : 'Copy Reply'}</span>
                            </button>

                            <a
                                href={mailtoUrl}
                                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-devyellow-400 to-devorange-500 text-charcoal-900 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all"
                            >
                                <span>Open in Email Client</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagesManager;