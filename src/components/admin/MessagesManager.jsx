import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { aiService } from '../../services/aiService';
import { notify } from '../../services/notificationService';
import {
    EMAIL_CLIENTS,
    EMAIL_CLIENT_PREF_KEY,
    dispatchEmail,
    cleanEmailBody,
    isValidEmail,
    sendDirectEmail,
    sendDirectOutlookEmail,
    getStoredGmailUser,
    setStoredGmailUser,
    getStoredGmailAppPassword,
    setStoredGmailAppPassword,
    hasStoredGmailCredentials,
    getActiveSenderEmail
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
    SlidersHorizontal,
    KeyRound,
    Lock,
    Eye,
    EyeOff,
    HelpCircle,
    Zap,
    ChevronDown,
    ChevronUp
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

    // Sender Email & Name State (Dynamic from profile, with in-place edit)
    const [senderEmail, setSenderEmail] = useState(() => getActiveSenderEmail());
    const [senderName, setSenderName] = useState('');

    // Direct Sending (Gmail SMTP) State
    const [directSending, setDirectSending] = useState(false);
    const [showSmtpSettings, setShowSmtpSettings] = useState(false);
    const [serverSmtpConfigured, setServerSmtpConfigured] = useState(false);
    const [gmailUserInput, setGmailUserInput] = useState(() => getStoredGmailUser());
    const [appPasswordInput, setAppPasswordInput] = useState('');
    const [showPasswordText, setShowPasswordText] = useState(false);

    const playChimeAlert = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            const now = ctx.currentTime;

            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(587.33, now); // D5
            gain1.gain.setValueAtTime(0.12, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.3);

            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(880.0, now + 0.12); // A5
            gain2.gain.setValueAtTime(0.15, now + 0.12);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.12);
            osc2.stop(now + 0.5);
        } catch {}
    };

    const fetchMessages = async (showNotification = false) => {
        try {
            setLoading(true);
            const data = await api.getMessages();
            setMessages(data || []);

            const profile = api.getStoredPortfolio()?.profile || {};
            if (profile.email && !senderEmail) setSenderEmail(profile.email);
            if (profile.name && !senderName) setSenderName(profile.name);

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
        const profile = api.getStoredPortfolio()?.profile || {};
        if (profile.email) setSenderEmail(profile.email);
        if (profile.name) setSenderName(profile.name);

        // Security: Actively purge any legacy stored passwords and caches from localStorage
        try {
            localStorage.removeItem('devj_gmail_app_password_v1');
            localStorage.removeItem('devj_outlook_app_password_v1');
            localStorage.removeItem('devj_contact_messages_v1');
            localStorage.removeItem('devj_messages_status_map');
        } catch {}

        api.getSmtpStatus().then((status) => {
            if (status?.configured) {
                setServerSmtpConfigured(true);
                if (status.userEmail) {
                    setGmailUserInput((prev) => prev || status.userEmail);
                }
            }
        }).catch(() => {});

        // 1. Real-time Multi-Channel Listener (SSE Stream, BroadcastChannel, Appwrite Realtime, Window Event)
        const unsubscribe = api.subscribeToMessages((event) => {
            if (!event) return;
            if (event.type === 'new_message' && event.data) {
                const newMsg = event.data;
                setMessages((prev) => {
                    const exists = prev.some((m) => String(m.id) === String(newMsg.id));
                    if (exists) return prev;
                    return [newMsg, ...prev];
                });
                playChimeAlert();
                notify.info(
                    `New direct inquiry from ${newMsg.name || 'Visitor'} (${newMsg.email || ''}) received live!`,
                    'Live Direct Contact'
                );
            } else if (event.type === 'update_message' && event.data) {
                const updated = event.data;
                setMessages((prev) =>
                    prev.map((m) => (String(m.id) === String(updated.id) ? { ...m, ...updated } : m))
                );
            } else if (event.type === 'delete_message' && event.data) {
                const delId = String(event.data.id);
                setMessages((prev) => prev.filter((m) => String(m.id) !== delId));
            }
        });

        // 2. Continuous Background Sync (every 10s + on tab focus)
        const pollInterval = setInterval(() => {
            api.getMessages().then((data) => {
                if (Array.isArray(data)) {
                    setMessages(data);
                }
            }).catch(() => {});
        }, 10000);

        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                api.getMessages().then((data) => {
                    if (Array.isArray(data)) {
                        setMessages(data);
                    }
                }).catch(() => {});
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
            clearInterval(pollInterval);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
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

        const profile = api.getStoredPortfolio()?.profile || {};
        const activeEmail = senderEmail || profile.email || getActiveSenderEmail();
        const activeName = senderName || profile.name || '';
        if (activeEmail) setSenderEmail(activeEmail);
        if (activeName) setSenderName(activeName);

        // Auto open password settings only if neither local storage nor server .env has credentials
        if (!hasStoredGmailCredentials() && !serverSmtpConfigured) {
            setShowSmtpSettings(true);
        }

        try {
            const draft = await aiService.draftInquiryReply(msg.name, msg.email, msg.message, replyTone, activeName, activeEmail);
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
            const draft = await aiService.draftInquiryReply(activeMsg.name, replyRecipient, activeMsg.message, toneId, senderName, senderEmail);
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
            const draft = await aiService.draftInquiryReply(activeMsg.name, replyRecipient, activeMsg.message, replyTone, senderName, senderEmail);
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

    // 1. Direct In-App Send (WITHOUT opening external email client)
    const handleSendDirectly = async () => {
        if (!activeMsg) return;

        if (!isValidEmail(replyRecipient)) {
            notify.error('Please enter a valid collaborator email address before sending.', 'Invalid Recipient');
            return;
        }

        const password = appPasswordInput.trim();
        const gUser = (gmailUserInput.trim() || getStoredGmailUser()).trim();

        if (!password && !serverSmtpConfigured) {
            setShowSmtpSettings(true);
            notify.error('Please configure your Gmail account in the Direct Send settings.', 'Credentials Required');
            return;
        }

        try {
            setDirectSending(true);

            await sendDirectEmail({
                to: replyRecipient,
                subject: replySubject,
                body: draftedReply,
                gmailUser: gUser,
                appPassword: password, // If empty, server uses verified server-side .env GMAIL_APP_PASSWORD
                fromEmail: senderEmail,
                fromName: senderName
            });

            // Mark message as replied in state and database
            await api.markMessageReplied(activeMsg.id, true);
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === activeMsg.id
                        ? { ...m, replied: true, repliedAt: new Date().toISOString() }
                        : m
                )
            );

            notify.success(
                `Letter successfully sent directly to ${replyRecipient}!\n\nAll collaborator replies will route directly to your account (${senderEmail || gUser}). Status recorded as Replied.`,
                'Email Delivered Directly'
            );

            setActiveMsg(null);
        } catch (err) {
            console.error(err);
            notify.error(
                err.message || 'Failed to send email directly via Gmail SMTP.',
                'Direct Send Error'
            );
        } finally {
            setDirectSending(false);
        }
    };

    // 2. Client dispatch (Opening Outlook Web or Desktop as alternative)
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

            await api.markMessageReplied(activeMsg.id, true);
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === activeMsg.id
                        ? { ...m, replied: true, repliedAt: new Date().toISOString() }
                        : m
                )
            );

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
                    <div className="flex items-center flex-wrap gap-2.5">
                        <h2 className="text-2xl font-black text-charcoal-900">Direct Inquiries</h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-devyellow-100 text-devorange-600 border border-devyellow-300 shadow-xs">
                            {messages.length}
                        </span>
                        {pendingCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                {pendingCount} Pending
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs" title="Real-time live synchronization active across tabs and devices">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Live Sync Active
                        </span>
                    </div>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                        Collaborator inquiries from your portfolio with direct in-app sending from your Outlook account.
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

            {/* AI Draft Reply & Direct Outlook Dispatcher Modal */}
            {activeMsg && (
                <div 
                    className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-gray-100 space-y-4 animate-popup-zoom my-6 max-h-[92vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-devyellow-400 to-devorange-500 flex items-center justify-center text-charcoal-900 shadow-sm">
                                    <Sparkles className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-charcoal-900 text-base leading-tight">AI Email Reply Drafter</h3>
                                    <p className="text-[11px] text-charcoal-500">
                                        Send directly from your Outlook account without opening external apps
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
                                    Reply-To (Your Inbox):
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <input
                                        type="email"
                                        value={senderEmail}
                                        onChange={(e) => setSenderEmail(e.target.value)}
                                        placeholder="your-email@outlook.ph"
                                        className="font-mono font-bold text-charcoal-900 bg-white px-2.5 py-0.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-devorange-500 max-w-[220px]"
                                        title="Your primary email where collaborator replies will be delivered"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSmtpSettings(!showSmtpSettings)}
                                        className="p-1 text-charcoal-500 hover:text-charcoal-900 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                                        title="Configure Gmail Direct Send Settings"
                                    >
                                        <KeyRound className="w-3.5 h-3.5 text-devorange-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Collaborator Destination Email (Editable) */}
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

                        {/* Collapsible Gmail App Password Configuration Drawer */}
                        {showSmtpSettings && (
                            <div className="bg-devyellow-50/60 border border-devyellow-300/80 rounded-2xl p-4 space-y-3 animate-in fade-in duration-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-900">
                                        <KeyRound className="w-4 h-4 text-devorange-600" />
                                        <span>Direct Send Settings (Gmail SMTP + App Password)</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowSmtpSettings(false)}
                                        className="text-charcoal-400 hover:text-charcoal-600"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <p className="text-[11px] text-charcoal-600 leading-relaxed">
                                    Direct background sending is powered by <strong>Gmail SMTP</strong>. Emails are sent to <strong>any recipient worldwide</strong> without domain verification. Collaborator replies route directly to <strong>{senderEmail || 'your email account'}</strong>.
                                </p>

                                {serverSmtpConfigured && (
                                    <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50/90 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] font-semibold">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Gmail SMTP is verified &amp; active on server. Ready for 1-click in-app sending!</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    <div>
                                        <label className="block text-[10px] font-bold text-charcoal-600 uppercase tracking-wider mb-1">
                                            Gmail Address
                                        </label>
                                        <input
                                            type="email"
                                            value={gmailUserInput}
                                            onChange={(e) => setGmailUserInput(e.target.value)}
                                            placeholder="your-name@gmail.com"
                                            className="w-full px-3 py-2 rounded-xl border border-devyellow-300 text-xs font-sans bg-white focus:outline-none focus:border-devorange-500 text-charcoal-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-charcoal-600 uppercase tracking-wider mb-1">
                                            Google App Password (16 chars)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPasswordText ? 'text' : 'password'}
                                                value={appPasswordInput}
                                                onChange={(e) => setAppPasswordInput(e.target.value)}
                                                placeholder="16-character App Password..."
                                                className="w-full pl-3 pr-10 py-2 rounded-xl border border-devyellow-300 text-xs font-mono bg-white focus:outline-none focus:border-devorange-500 text-charcoal-900"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswordText(!showPasswordText)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
                                            >
                                                {showPasswordText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] pt-1 border-t border-devyellow-200/60">
                                    <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                                        <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Protected: Passwords are managed securely on backend server (.env) and never stored in browser localStorage.</span>
                                    </div>
                                    <a
                                        href="https://myaccount.google.com/apppasswords"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-devorange-600 hover:underline font-bold flex items-center gap-1 shrink-0"
                                    >
                                        <span>Google App Passwords Guide</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        )}

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
                                        disabled={draftLoading || directSending}
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
                                    disabled={draftLoading || directSending}
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
                                <span>{draftedReply.length} characters • Ready to send</span>
                            </div>
                            <div className="relative">
                                {draftLoading ? (
                                    <div className="h-44 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-2">
                                        <Loader2 className="w-6 h-6 animate-spin text-devorange-600" />
                                        <span className="text-xs font-bold text-charcoal-600">
                                            Drafting personalized reply ({replyTone})...
                                        </span>
                                    </div>
                                ) : (
                                    <textarea
                                        rows={6}
                                        value={draftedReply}
                                        onChange={(e) => setDraftedReply(e.target.value)}
                                        placeholder="Drafted reply will appear here..."
                                        className="w-full p-4 rounded-2xl border border-gray-200 text-xs text-charcoal-800 leading-relaxed focus:outline-none focus:border-devorange-500 font-sans resize-none bg-white"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Action Buttons Section */}
                        <div className="space-y-2.5 pt-1">
                            {/* Primary Action Row: Direct Send (No Outlook App Needed) */}
                            <div className="flex flex-col sm:flex-row items-center gap-2.5">
                                <button
                                    onClick={handleSendDirectly}
                                    disabled={!draftedReply || draftLoading || directSending || !isValidEmail(replyRecipient)}
                                    className="w-full sm:flex-1 py-3 px-6 rounded-2xl bg-charcoal-900 hover:bg-black text-devyellow-400 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {directSending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-devyellow-400" />
                                            <span>Sending directly via Gmail...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4 fill-devyellow-400 text-devyellow-400" />
                                            <span>Send Directly (No Mail App Needed)</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Secondary Row: Utilities & Alternative Client Launch */}
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleCopy}
                                        disabled={!draftedReply || draftLoading}
                                        className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-[11px] font-bold text-charcoal-700 flex items-center gap-1.5 transition-all active:scale-95 bg-white"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copied ? 'Copied!' : 'Copy Reply'}</span>
                                    </button>

                                    <button
                                        onClick={() => handleToggleReplied(activeMsg.id, activeMsg.replied)}
                                        className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                                            activeMsg.replied
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                                : 'bg-white text-charcoal-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>{activeMsg.replied ? 'Replied' : 'Mark Done'}</span>
                                    </button>
                                </div>

                                {/* Alternative 1-click fallback buttons */}
                                <div className="flex items-center gap-3 ml-auto">
                                    <button
                                        onClick={() => handleDispatchEmail('gmail-web')}
                                        disabled={!draftedReply || draftLoading || directSending || !isValidEmail(replyRecipient)}
                                        className="text-[11px] font-bold text-charcoal-600 hover:text-charcoal-900 hover:underline flex items-center gap-1"
                                        title="Open draft in Gmail Web"
                                    >
                                        <span>Open in Gmail</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => handleDispatchEmail('outlook-web')}
                                        disabled={!draftedReply || draftLoading || directSending || !isValidEmail(replyRecipient)}
                                        className="text-[11px] font-bold text-devorange-600 hover:text-devorange-700 hover:underline flex items-center gap-1"
                                        title="Open draft in Outlook Web"
                                    >
                                        <span>Open in Outlook</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagesManager;