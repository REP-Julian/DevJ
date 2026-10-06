import React, { useState, useEffect, useRef } from 'react';
import { Check, X, AlertTriangle, ArrowRight, Trash2 } from 'lucide-react';
import { notificationManager } from '../../services/notificationService';

export const NotificationModal = () => {
    const [dialog, setDialog] = useState(null);
    const actionButtonRef = useRef(null);

    useEffect(() => {
        const unsubscribe = notificationManager.subscribe((incomingDialog) => {
            setDialog(incomingDialog);
        });
        return unsubscribe;
    }, []);

    // Focus action button when modal appears and support Enter / Escape keys
    useEffect(() => {
        if (dialog) {
            const timer = setTimeout(() => {
                if (actionButtonRef.current) {
                    actionButtonRef.current.focus();
                }
            }, 50);

            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    if (dialog.type === 'confirm') {
                        handleCancel();
                    } else {
                        handleDone();
                    }
                } else if (e.key === 'Enter') {
                    // Only auto-trigger if not already focusing a specific button
                    if (e.target.tagName !== 'BUTTON') {
                        e.preventDefault();
                        if (dialog.type === 'confirm') {
                            handleConfirm();
                        } else {
                            handleDone();
                        }
                    }
                }
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => {
                clearTimeout(timer);
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [dialog]);

    if (!dialog) return null;

    const handleDone = () => {
        if (dialog.onDone) dialog.onDone();
        setDialog(null);
    };

    const handleConfirm = () => {
        if (dialog.onConfirm) dialog.onConfirm();
        setDialog(null);
    };

    const handleCancel = () => {
        if (dialog.onCancel) dialog.onCancel();
        setDialog(null);
    };

    return (
        <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-modal-title"
        >
            {/* Modal Card */}
            <div 
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl border border-gray-100 text-center relative overflow-hidden animate-popup-zoom"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Visual Glow Layer */}
                {dialog.type === 'success' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                )}
                {dialog.type === 'error' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
                )}
                {dialog.type === 'confirm' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                )}

                {/* Animated Icon Section */}
                <div className="relative mb-5 flex items-center justify-center">
                    {dialog.type === 'success' && (
                        <div className="relative flex items-center justify-center">
                            {/* Expanding Ripple Ring */}
                            <div className="absolute w-24 h-24 rounded-full bg-emerald-400/20 animate-ripple-pulse" />
                            {/* Animated Correct Badge */}
                            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-correct-bounce relative z-10">
                                <Check className="w-10 h-10 stroke-[3.5]" />
                            </div>
                        </div>
                    )}

                    {dialog.type === 'error' && (
                        <div className="relative flex items-center justify-center">
                            {/* Animated Wrong Badge with Shake */}
                            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 animate-wrong-shake relative z-10">
                                <X className="w-10 h-10 stroke-[3.5]" />
                            </div>
                        </div>
                    )}

                    {dialog.type === 'confirm' && (
                        <div className="relative flex items-center justify-center">
                            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 animate-popup-zoom relative z-10">
                                {dialog.isDestructive ? (
                                    <Trash2 className="w-9 h-9 stroke-[2.5]" />
                                ) : (
                                    <AlertTriangle className="w-9 h-9 stroke-[2.5]" />
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 
                    id="notification-modal-title"
                    className="text-xl sm:text-2xl font-black text-charcoal-900 tracking-tight"
                >
                    {dialog.title}
                </h3>

                {/* Message Body */}
                <p className="text-sm sm:text-base font-medium text-charcoal-600 mt-2.5 leading-relaxed px-2 break-words">
                    {dialog.message}
                </p>

                {/* Action Buttons */}
                {dialog.type === 'confirm' ? (
                    <div className="mt-7 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 py-3 px-4 rounded-2xl font-bold text-sm text-charcoal-700 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
                        >
                            {dialog.cancelText || 'Cancel'}
                        </button>
                        <button
                            ref={actionButtonRef}
                            type="button"
                            onClick={handleConfirm}
                            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm text-white transition-all shadow-md active:scale-95 ${
                                dialog.isDestructive 
                                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25' 
                                    : 'bg-charcoal-900 hover:bg-charcoal-800 shadow-charcoal-900/25'
                            }`}
                        >
                            {dialog.confirmText || 'Confirm'}
                        </button>
                    </div>
                ) : (
                    <div className="mt-7">
                        <button
                            ref={actionButtonRef}
                            type="button"
                            onClick={handleDone}
                            className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base text-white bg-charcoal-900 hover:bg-charcoal-800 active:scale-[0.98] transition-all shadow-lg shadow-charcoal-900/20 flex items-center justify-center gap-2 group"
                        >
                            <span>{dialog.doneText || 'Done'}</span>
                            <ArrowRight className="w-4 h-4 text-devyellow-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationModal;
