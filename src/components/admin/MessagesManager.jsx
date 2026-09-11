import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { aiService } from '../../services/aiService';
import { notify } from '../../services/notificationService';
import {
    OUTLOOK_ACCOUNT_EMAIL,
    EMAIL_CLIENTS,
    EMAIL_CLIENT_PREF_KEY,
    dispatchEmail,
    cleanEmailBody,
    isValidEmail
} from '../../utils/emailClient';
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
    Inbox,
    CheckCircle2,
    ShieldCheck,
    AlertCircle,
    SlidersHorizontal
} from 'lucide-react';

export const MessagesManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'replied'

    // AI Reply Modal State
    const [activeMsg, setActiveMsg] = useState(null);
    const [replyRecipient, setReplyRecipient] = useState('');
    const [replySubject, setReplySubject] = useState('');
    const [replyTone, setReplyTone] = useState('warm and professional');
    const [draftedReply, setDraftedReply] = useState('');
    const [draftLoading, setDraftLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [selectedClient, setSelectedClient] = useState(
        () => localStorage.getItem(EMAIL_CLIENT_PREF_KEY) || 'outlook-web'
    );

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

    const handleToggleReplied = async (id, currentStatus) => {
        const newStatus = !currentStatus;
        try {
            await api.markMessageReplied(id, newStatus);
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === id
                        ? { ...m, replied: newStatus, repliedAt: newStatus ? new Date().toISOString() : null }
                        : m
                )
            );
            if (newStatus) {
                notify.success('Marked inquiry as Replied.', 'Status Updated');
            } else {
                notify.success('Marked inquiry as Pending.', 'Status Updated');
            }
        } catch (err) {
            notify.error('Failed to update message status', 'Update Error');
        }
    };

    const handleOpenAiReply = async (msg) => {
        setActiveMsg(msg);
        setReplyRecipient(msg.email || '');
        setReplySubject(
            msg.subject
                ? `Re: ${msg.subject}`
                : `Re: Portfolio Collaboration Inquiry from ${msg.name || 'Collaborator'}`
        );
        setDraftLoading(true);
        setDraftedReply('');
        setCopied(false);

        try {
            const draft = await aiService.draftInquiryReply(msg.name, msg.email, msg.message, replyTone);
            setDraftedReply(cleanEmailBody(draft));
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
            const draft = await aiService.draftInquiryReply(activeMsg.name, replyRecipient, activeMsg.message, toneId);
            setDraftedReply(cleanEmailBody(draft));
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
            const draft = await aiService.draftInquiryReply(activeMsg.name, replyRecipient, activeMsg.message, replyTone);
            setDraftedReply(cleanEmailBody(draft));
        } catch (err) {
            notify.error(err.message || 'Failed to regenerate reply', 'Regeneration Failed');
        } finally {
            setDraftLoading(false);
        }
    };

    const handleCopy = () => {
        const textToCopy = cleanEmailBody(draftedReply);
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    // Dispatch email to chosen client with clipboard safeguard
    const handleDispatchEmail = async (clientId = selectedClient) => {
        if (!activeMsg) return;

        if (!isValidEmail(replyRecipient)) {
            notify.error('Please enter a valid collaborator email address before sending.', 'Invalid Recipient');
            return;
        }

        try {
            const result = await dispatchEmail({
                clientId,
                to: replyRecipient,
                subject: replySubject,
                body: draftedReply
            });

            // Automatically record as replied
            await api.markMessageReplied(activeMsg.id, true);
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === activeMsg.id
                        ? { ...m, replied: true, repliedAt: new Date().toISOString() }
                        : m
                )
            );

            const isDesktop = clientId === 'outlook-desktop';
            notify.success(
                `${result.client.shortName} launched for ${replyRecipient}!\n\nYour entire letter was also copied to your clipboard as a safeguard. If your email client trimmed any text, simply press Ctrl+V to paste!`,
                'Email Client Dispatched'
            );
        } catch (err) {
            notify.error(err.message || 'Failed to launch email client', 'Email Dispatch Failed');
        }
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

    // Filter messages by search and status
    const pendingCount = messages.filter((m) => !m.replied).length;
    const repliedCount = messages.filter((m) => m.replied).length;

    const filteredMessages = messages.filter((msg) => {
        if (statusFilter === 'pending' && msg.replied) return false;
        if (statusFilter === 'replied' && !msg.replied) return false;

        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            (msg.name && msg.name.toLowerCase().includes(q)) ||
            (msg.email && msg.email.toLowerCase().includes(q)) ||
            (msg.message && msg.message.toLowerCase().includes(q))
        );
    });

    const activeClientObj = EMAIL_CLIENTS.find((c) => c.id === selectedClient) || EMAIL_CLIENTS[0];

    return (
        <div className="space-y-6">
            {/* Header with Title, Count Badges, Filter & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-2xl font-black text-charcoal-900">Direct Inquiries</h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-devyellow-100 text-devorange-600 border border-devyellow-300 shadow-xs">
                            {messages.length}
                        </span>
                        {pendingCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                {pendingCount} Pending
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                        Collaborator messages from portfolio contact form with direct Outlook integration & AI drafting.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Status Filter Tabs */}
                    <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-bold">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-2.5 py-1 rounded-lg transition-all ${
                                statusFilter === 'all'
                                    ? 'bg-white text-charcoal-900 shadow-xs'
                                    : 'text-charcoal-500 hover:text-charcoal-800'
                            }`}
                        >
                            All ({messages.length})
                        </button>
                        <button
                            onClick={() => setStatusFilter('pending')}
                            className={`px-2.5 py-1 rounded-lg transition-all ${
                                statusFilter === 'pending'
                                    ? 'bg-white text-rose-600 shadow-xs'
                                    : 'text-charcoal-500 hover:text-charcoal-800'
                            }`}
                        >
                            Pending ({pendingCount})
                        </button>
                        <button
                            onClick={() => setStatusFilter('replied')}
                            className={`px-2.5 py-1 rounded-lg transition-all ${
                                statusFilter === 'replied'
                                    ? 'bg-white text-emerald-600 shadow-xs'
                                    : 'text-charcoal-500 hover:text-charcoal-800'
                            }`}
                        >
                            Replied ({repliedCount})
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative flex-1 sm:w-56">
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
                            {searchQuery ? 'No matching inquiries' : 'No inquiries in this folder'}
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
                            className={`p-6 bg-white rounded-2xl border transition-all space-y-3 shadow-sm ${
                                msg.replied
                                    ? 'border-gray-200/70 bg-gray-50/40'
                                    : 'border-devyellow-300/80 hover:border-devorange-400 ring-1 ring-devyellow-200/40'
                            }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-devyellow-200 to-devorange-200 text-devorange-600 font-bold text-xs flex items-center justify-center border border-devyellow-300/80 shrink-0">
                                        {msg.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-charcoal-900 text-sm leading-tight">{msg.name}</h4>
                                            {msg.replied ? (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                                                    <Check className="w-2.5 h-2.5 stroke-[3]" /> Replied
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
                                                    Needs Reply
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-devorange-600 font-medium">{msg.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                                    <span className="text-[11px] font-semibold text-charcoal-400 flex items-center gap-1.5 mr-2">
                                        <Clock className="w-3 h-3 text-charcoal-400" />
                                        {formatMessageDate(msg.createdAt)}
                                    </span>

                                    {/* Toggle Replied Button */}
                                    <button
                                        onClick={() => handleToggleReplied(msg.id, msg.replied)}
                                        className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all active:scale-95 ${
                                            msg.replied
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                : 'bg-gray-50 text-charcoal-600 border-gray-200 hover:bg-gray-100'
                                        }`}
                                        title={msg.replied ? 'Mark as Pending' : 'Mark as Replied'}
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>{msg.replied ? 'Replied' : 'Mark Done'}</span>
                                    </button>

                                    {/* AI Draft Reply Button */}
                                    <button
                                        onClick={() => handleOpenAiReply(msg)}
                                        className="px-3.5 py-1.5 rounded-xl bg-devyellow-100 hover:bg-devyellow-200 text-devorange-600 border border-devyellow-300 text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-xs"
                                    >
                                        <Sparkles className="w-3.5 h-3.5 text-devyellow-600 fill-devyellow-400" />
                                        <span>AI Draft Reply</span>
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200"
                                        title="Delete Message"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-xs text-charcoal-800 bg-gray-50/90 border border-gray-100 p-4 rounded-xl leading-relaxed whitespace-pre-wrap font-sans">
                                {msg.message}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* AI Draft Reply & Outlook Email Client Modal */}
            {activeMsg && (
                <div 
                    className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-gray-100 space-y-5 animate-popup-zoom my-6 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-devyellow-400 to-devorange-500 flex items-center justify-center text-charcoal-900 shadow-sm">
                                    <Sparkles className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-charcoal-900 text-base leading-tight">AI Email Reply Drafter</h3>
                                    <p className="text-[11px] text-charcoal-500">
                                        Personalized reply from your Outlook account to collaborator
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveMsg(null)}
                                className="p-1.5 text-charcoal-400 hover:text-charcoal-700 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Email Routing Verification Card */}
                        <div className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-3.5 space-y-2.5 text-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-gray-200/60">
                                <span className="text-charcoal-500 font-semibold flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-devorange-600" />
                                    From (Your Account):
                                </span>
                                <span className="font-mono font-bold text-charcoal-900 bg-white px-2.5 py-0.5 rounded-lg border border-gray-200">
                                    {OUTLOOK_ACCOUNT_EMAIL}
                                </span>
                            </div>

                            {/* Collaborator Destination Email (Editable for verification) */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <label className="text-charcoal-600 font-semibold shrink-0">
                                    To Collaborator:
                                </label>
                                <div className="flex-1 sm:max-w-[70%]">
                                    <input
                                        type="email"
                                        value={replyRecipient}
                                        onChange={(e) => setReplyRecipient(e.target.value)}
                                        placeholder="collaborator@example.com"
                                        className={`w-full px-3 py-1.5 rounded-xl border text-xs font-mono font-medium focus:outline-none bg-white transition-colors ${
                                            isValidEmail(replyRecipient)
                                                ? 'border-gray-200 focus:border-devorange-500 text-charcoal-900'
                                                : 'border-rose-400 focus:border-rose-500 text-rose-700 bg-rose-50/30'
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Subject Line (Editable) */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <label className="text-charcoal-600 font-semibold shrink-0">
                                    Subject:
                                </label>
                                <div className="flex-1 sm:max-w-[70%]">
                                    <input
                                        type="text"
                                        value={replySubject}
                                        onChange={(e) => setReplySubject(e.target.value)}
                                        placeholder="Subject line..."
                                        className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-devorange-500 bg-white text-charcoal-900"
                                    />
                                </div>
                            </div>
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

                        {/* Draft Content Textarea */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] text-charcoal-500 font-medium">
                                <span>Letter Body:</span>
                                <span>{draftedReply.length} characters • Plain-text optimized for Outlook</span>
                            </div>
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
                                        rows={7}
                                        value={draftedReply}
                                        onChange={(e) => setDraftedReply(e.target.value)}
                                        placeholder="Drafted reply will appear here..."
                                        className="w-full p-4 rounded-2xl border border-gray-200 text-xs text-charcoal-800 leading-relaxed focus:outline-none focus:border-devorange-500 font-sans resize-none bg-white"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Email Client Chooser */}
                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-charcoal-800 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-devorange-600" />
                                    Choose Email Client:
                                </span>
                                <span className="text-[11px] text-charcoal-500">
                                    Will launch with pre-filled message
                                </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {EMAIL_CLIENTS.map((client) => (
                                    <button
                                        key={client.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedClient(client.id);
                                            try {
                                                localStorage.setItem(EMAIL_CLIENT_PREF_KEY, client.id);
                                            } catch (e) {}
                                        }}
                                        className={`p-2 rounded-xl border text-left transition-all ${
                                            selectedClient === client.id
                                                ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-xs'
                                                : 'bg-white text-charcoal-700 border-gray-200 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="font-bold text-[11px] truncate">{client.shortName}</div>
                                        <div className={`text-[10px] ${selectedClient === client.id ? 'text-devyellow-400' : 'text-charcoal-400'}`}>
                                            {client.badge}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                    onClick={handleCopy}
                                    disabled={!draftedReply || draftLoading}
                                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 text-xs font-bold text-charcoal-800 flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 bg-white"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Reply'}</span>
                                </button>

                                <button
                                    onClick={() => handleToggleReplied(activeMsg.id, activeMsg.replied)}
                                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                                        activeMsg.replied
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                            : 'bg-white text-charcoal-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                                    title="Toggle inquiry status"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>{activeMsg.replied ? 'Replied' : 'Mark Done'}</span>
                                </button>
                            </div>

                            {/* Primary Launch Button */}
                            <button
                                onClick={() => handleDispatchEmail(selectedClient)}
                                disabled={!draftedReply || draftLoading || !isValidEmail(replyRecipient)}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-devyellow-400 via-devyellow-500 to-devorange-500 hover:from-devyellow-500 hover:to-devorange-600 text-charcoal-900 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <span>Send via {activeClientObj.shortName}</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagesManager;