import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Mail, Trash2, Calendar, User, RefreshCw } from 'lucide-react';

export const MessagesManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                    <h2 className="text-2xl font-black text-charcoal-900">Direct Inquiries</h2>
                    <p className="text-xs text-charcoal-500">Messages sent via the public portfolio contact form.</p>
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
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] text-charcoal-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        </div>
    );
};

export default MessagesManager;