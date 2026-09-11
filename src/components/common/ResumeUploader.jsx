import React, { useState, useRef } from 'react';
import { FileText, Upload, CheckCircle2, AlertCircle, Loader2, ExternalLink, Trash2, Link as LinkIcon } from 'lucide-react';
import { api } from '../../services/api';

export const ResumeUploader = ({ resumeUrl, onResumeChanged }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [manualMode, setManualMode] = useState(false);
    const [manualUrl, setManualUrl] = useState(resumeUrl || '');
    const fileInputRef = useRef(null);

    const handleFile = async (file) => {
        if (!file) return;

        // Check file extension / mime type
        const validExtensions = ['.pdf', '.doc', '.docx'];
        const fileName = file.name.toLowerCase();
        const isValid = validExtensions.some(ext => fileName.endsWith(ext)) || 
                        file.type === 'application/pdf' || 
                        file.type.includes('word');

        if (!isValid) {
            setError('Please upload a PDF document (.pdf) or Word document (.doc, .docx).');
            return;
        }

        // Limit size to 15MB
        if (file.size > 15 * 1024 * 1024) {
            setError('File size exceeds 15MB. Please choose a smaller document.');
            return;
        }

        setError('');
        setUploading(true);
        setSuccessMsg('');

        try {
            const uploadedUrl = await api.uploadFile(file);
            onResumeChanged(uploadedUrl);
            setManualUrl(uploadedUrl);
            setSuccessMsg(`Successfully uploaded "${file.name}" to Appwrite Storage!`);
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (err) {
            console.error('Resume upload error:', err);
            setError(err.message || 'Failed to upload document to storage.');
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (!manualUrl.trim()) {
            onResumeChanged('');
            setSuccessMsg('Resume link removed.');
        } else {
            onResumeChanged(manualUrl.trim());
            setSuccessMsg('Resume link saved!');
        }
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const handleRemove = () => {
        onResumeChanged('');
        setManualUrl('');
        setSuccessMsg('Resume link cleared. Hero button will fall back to email request.');
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const hasResume = Boolean(resumeUrl && resumeUrl.trim());

    return (
        <div className="space-y-4">
            {/* Status alerts */}
            {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                </div>
            )}

            {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Current Resume Active Card */}
            {hasResume && !uploading && (
                <div className="p-4 bg-devyellow-100/40 border border-devyellow-300 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-devorange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase tracking-wider text-charcoal-900">
                                    Active Resume / CV
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                                    LIVE ON SITE
                                </span>
                            </div>
                            <p className="text-xs text-charcoal-600 truncate max-w-md mt-0.5">
                                {resumeUrl.startsWith('data:') ? 'Embedded Document (Base64)' : resumeUrl}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-charcoal-900 text-white hover:bg-charcoal-800 transition-all flex items-center gap-1.5 shadow-sm hover:-translate-y-0.5"
                        >
                            <ExternalLink className="w-3.5 h-3.5 text-devyellow-400" />
                            <span>Preview / View</span>
                        </a>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-all flex items-center gap-1"
                            title="Remove resume"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Drag & Drop Upload Zone */}
            <div
                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[150px] bg-white group ${
                    dragActive
                        ? 'border-devorange-500 bg-devorange-100/30 ring-4 ring-devorange-100'
                        : 'border-gray-200 hover:border-devorange-400 hover:bg-devyellow-100/20'
                }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                    disabled={uploading}
                />

                {uploading ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-3 text-center">
                        <Loader2 className="w-8 h-8 text-devorange-500 animate-spin" />
                        <span className="text-xs font-extrabold text-charcoal-900">
                            Uploading to Appwrite Storage...
                        </span>
                        <span className="text-[11px] text-charcoal-500">
                            This document will be publicly accessible via your portfolio
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-center py-2">
                        <div className="w-12 h-12 rounded-2xl bg-devyellow-100/70 text-devorange-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                            <Upload className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-charcoal-900 group-hover:text-devorange-600 transition-colors">
                                {hasResume ? 'Click or drop a new file to replace your resume' : 'Click to upload or drag & drop your Resume / CV'}
                            </span>
                            <p className="text-[11px] text-charcoal-400 mt-0.5">
                                Supports PDF, DOC, DOCX (Up to 15MB) • Uploads to Appwrite Storage
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Alternative: Link via external URL toggle */}
            <div className="pt-2">
                <button
                    type="button"
                    onClick={() => setManualMode(!manualMode)}
                    className="text-xs font-bold text-charcoal-600 hover:text-devorange-600 inline-flex items-center gap-1.5 transition-colors"
                >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>{manualMode ? 'Hide external URL input' : 'Or paste a Google Drive / cloud link instead'}</span>
                </button>

                {manualMode && (
                    <div className="mt-2.5 p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2 animate-in fade-in">
                        <label className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider">
                            External Resume / CV Link (Google Drive, Dropbox, etc.)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                placeholder="https://drive.google.com/file/d/... or https://..."
                                value={manualUrl}
                                onChange={(e) => setManualUrl(e.target.value)}
                                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-devorange-500 text-xs font-mono"
                            />
                            <button
                                type="button"
                                onClick={handleManualSubmit}
                                className="px-4 py-2 rounded-xl bg-charcoal-900 text-devyellow-400 text-xs font-bold hover:bg-charcoal-800 transition-all shrink-0"
                            >
                                Save Link
                            </button>
                        </div>
                        <p className="text-[11px] text-charcoal-500">
                            Make sure link sharing permissions on Google Drive are set to "Anyone with the link can view".
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeUploader;
