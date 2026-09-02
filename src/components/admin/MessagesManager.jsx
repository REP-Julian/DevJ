import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { aiService } from '../../services/aiService';
import { Mail, Trash2, Calendar, User, RefreshCw, Sparkles, Send, Copy, Check, Loader2, X, ExternalLink } from 'lucide-react';

export const MessagesManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // AI Reply Modal State
    const [activeMsg, setActiveMsg] = useState(null);
    const [replyTone, setReplyTone] = useState('warm and professional');
    const [draftedReply, setDraftedReply] = useState('');
    const [draftLoading, setDraftLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const data = await api.getMessages();
            setMessages(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        if (confirm('Delete this message?')) {
            try {
                await api.deleteMessage(id);
                fetchMessages();
            } catch (err) {
                alert(err.message);
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
            setDraftedReply(`Error generating draft: ${err.message}`);
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
            setDraftedReply(`Error: ${err.message}`);
        } finally {
            setDraftLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(draftedReply);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                    <h2 className="text-2xl font-black text-charcoal-900">Direct Inquiries</h2>
                    <p className="text-xs text-charcoal-500">Messages sent via the public portfolio contact form with AI response drafting.</p>
                </div>
                <button
                    onClick={fetchMessages}
                    className="p-2 border rounded-xl text-charcoal-700 hover:bg-gray-50"
                    title="Refresh"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {messages.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 text-charcoal-500 text-sm">
                    No inquiries in your inbox yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-devyellow-100 text-devorange-600 font-bold text-xs flex items-center justify-center">
                                        {msg.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-charcoal-900 text-sm">{msg.name}</h4>
                                        <a href={`mailto:${msg.email}`} className="text-xs text-devorange-600 underline">
                                            {msg.email}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-charcoal-500 flex items-center gap-1 mr-2">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={() => handleOpenAiReply(msg)}
                                        className="px-3 py-1.5 rounded-xl bg-devyellow-100 hover:bg-devyellow-200 text-devorange-600 border border-devyellow-300 text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <Sparkles className="w-3.5 h-3.5 text-devyellow-600 fill-devyellow-400" />
                                        <span>AI Draft Reply</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Message"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-charcoal-800 bg-gray-50 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                                {msg.message}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* AI Draft Reply Modal */}
            {activeMsg && (
                <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
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
                                className="p-1.5 text-charcoal-400 hover:text-charcoal-700 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Tone Selector */}
                        <div className="flex items-center justify-between gap-3">
                            <label className="text-xs font-bold text-charcoal-700 shrink-0">Tone:</label>
                            <div className="flex flex-wrap gap-1.5">
                                {[
                                    { id: 'warm and professional', label: 'Warm & Professional' },
                                    { id: 'enthusiastic and creative', label: 'Enthusiastic' },
                                    { id: 'technical and concise', label: 'Technical & Direct' },
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            setReplyTone(t.id);
                                        }}
                                        className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-colors ${
                                            replyTone === t.id
                                                ? 'bg-charcoal-900 text-white'
                                                : 'bg-gray-100 text-charcoal-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleRegenerateReply}
                                disabled={draftLoading}
                                className="p-1.5 text-devorange-600 hover:bg-devyellow-100 rounded-lg transition-colors shrink-0"
                                title="Regenerate"
                            >
                                <RefreshCw className={`w-4 h-4 ${draftLoading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Draft Content */}
                        <div className="relative">
                            {draftLoading ? (
                                <div className="h-48 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-2">
                                    <Loader2 className="w-6 h-6 animate-spin text-devorange-600" />
                                    <span className="text-xs font-bold text-charcoal-600">Drafting personalized reply with Gemini...</span>
                                </div>
                            ) : (
                                <textarea
                                    rows={8}
                                    value={draftedReply}
                                    onChange={(e) => setDraftedReply(e.target.value)}
                                    className="w-full p-4 rounded-2xl border border-gray-200 text-xs text-charcoal-800 leading-relaxed focus:outline-none focus:border-devorange-500 font-sans resize-none"
                                />
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                            <button
                                onClick={handleCopy}
                                disabled={!draftedReply || draftLoading}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 text-xs font-bold text-charcoal-800 flex items-center justify-center gap-1.5 transition-all"
                            >
                                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                <span>{copied ? 'Copied to Clipboard!' : 'Copy Reply'}</span>
                            </button>

                            <a
                                href={`mailto:${activeMsg.email}?subject=Re: Your Inquiry on DevJ Portfolio&body=${encodeURIComponent(draftedReply)}`}
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