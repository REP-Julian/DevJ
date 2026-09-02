import React, { useState } from 'react';
import ImageUploader from '../common/ImageUploader';
import { api } from '../../services/api';
import { aiService } from '../../services/aiService';
import { Plus, Trash2, Edit2, Save, X, Sparkles, Loader2, Eye, CheckCircle2, Award, FileSearch } from 'lucide-react';

export const AchievementsManager = ({ achievements = [], onUpdated }) => {
    const [editingId, setEditingId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiVisionScanning, setAiVisionScanning] = useState(false);
    const [visualReport, setVisualReport] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        date: '2025',
        description: '',
        imageUrl: '',
        order: 0,
    });

    const handleEdit = (item) => {
        setEditingId(item.id);
        setIsCreating(false);
        setVisualReport(null);
        setFormData(item);
    };

    const handleCreateNew = () => {
        setIsCreating(true);
        setEditingId(null);
        setVisualReport(null);
        setFormData({
            title: '',
            category: 'Hackathon Award',
            date: new Date().getFullYear().toString(),
            description: '',
            imageUrl: '',
            order: achievements.length + 1,
        });
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingId(null);
        setVisualReport(null);
    };

    const handleScanVisual = async () => {
        if (!formData.imageUrl) {
            alert('Please upload or select an achievement visual first');
            return;
        }
        setAiVisionScanning(true);
        try {
            const res = await aiService.analyzeAchievementVisual(formData.imageUrl, formData);
            setFormData(prev => ({
                ...prev,
                title: res.title || prev.title,
                category: res.category || prev.category,
                date: res.date || prev.date,
                description: res.description || prev.description,
            }));
            setVisualReport(res);
        } catch (err) {
            alert(err.message || 'Visual analysis failed');
        } finally {
            setAiVisionScanning(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isCreating) {
                await api.createAchievement(formData);
            } else {
                await api.updateAchievement(editingId, formData);
            }
            handleCancel();
            onUpdated();
        } catch (err) {
            alert(err.message || 'Error saving achievement');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this achievement?')) {
            try {
                await api.deleteAchievement(id);
                onUpdated();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                    <h2 className="text-2xl font-black text-charcoal-900">Achievements Management</h2>
                    <p className="text-xs text-charcoal-500">Add awards, milestones, and dynamically replace award images.</p>
                </div>
                {!isCreating && !editingId && (
                    <button
                        onClick={handleCreateNew}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-devyellow-400 text-charcoal-900 flex items-center gap-1.5 hover:bg-devorange-400 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Achievement
                    </button>
                )}
            </div>

            {(isCreating || editingId) && (
                <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl border border-devyellow-300 shadow-warm-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-sm text-charcoal-900">
                            {isCreating ? 'Create Achievement' : 'Edit Achievement'}
                        </h3>
                        <div className="flex items-center gap-2">
                            {formData.imageUrl && (
                                <button
                                    type="button"
                                    onClick={handleScanVisual}
                                    disabled={aiVisionScanning}
                                    className="px-3 py-1 rounded-xl bg-charcoal-900 hover:bg-black text-devyellow-400 border border-charcoal-700 text-xs font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-xs"
                                >
                                    {aiVisionScanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                                    <span>{aiVisionScanning ? 'Reading Visual...' : '👁️ AI Read Visual'}</span>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!formData.title.trim()) {
                                        alert('Please enter an achievement title first');
                                        return;
                                    }
                                    setAiLoading(true);
                                    try {
                                        const res = await aiService.enhanceAchievement(formData);
                                        setFormData(prev => ({
                                            ...prev,
                                            title: res.title || prev.title,
                                            category: res.category || prev.category,
                                            description: res.description || prev.description,
                                            date: res.date || prev.date,
                                        }));
                                    } catch (e) {
                                        alert(e.message || 'AI generation failed');
                                    } finally {
                                        setAiLoading(false);
                                    }
                                }}
                                disabled={aiLoading}
                                className="px-3 py-1 rounded-xl bg-devyellow-100 hover:bg-devyellow-200 text-devorange-600 border border-devyellow-300 text-xs font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                            >
                                {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-devyellow-600 fill-devyellow-400" />}
                                <span>{aiLoading ? 'Magnifying...' : '✨ AI Polish Copy'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border rounded-xl text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Category</label>
                            <input
                                type="text"
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border rounded-xl text-xs"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Date / Year</label>
                            <input
                                type="text"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-3 py-2 border rounded-xl text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Sort Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                className="w-full px-3 py-2 border rounded-xl text-xs"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-charcoal-800 mb-1">Description</label>
                        <textarea
                            rows={3}
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-xs"
                        />
                    </div>

                    <div className="space-y-3">
                        <ImageUploader
                            label="Achievement Visual (Certificate / Award / Trophy / Plaque)"
                            currentImage={formData.imageUrl}
                            onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
                        />

                        {formData.imageUrl && (
                            <div className="p-4 bg-gradient-to-r from-devyellow-50 to-amber-50 border border-devyellow-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                                <div className="flex items-start gap-2.5">
                                    <div className="w-7 h-7 rounded-xl bg-devyellow-400 text-charcoal-900 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                        <Eye className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-charcoal-900">Gemini Multimodal Vision Analysis</p>
                                        <p className="text-[11px] text-charcoal-600">
                                            Extract certificate title, issuing organization, dates, and achievement narrative directly from this image.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleScanVisual}
                                    disabled={aiVisionScanning}
                                    className="px-4 py-2 rounded-xl bg-charcoal-900 hover:bg-black text-devyellow-400 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-sm shrink-0"
                                >
                                    {aiVisionScanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                    <span>{aiVisionScanning ? 'Scanning Visual...' : '🔍 Read & Auto-Fill from Visual'}</span>
                                </button>
                            </div>
                        )}

                        {visualReport && (
                            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 text-xs text-charcoal-800 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between text-emerald-800 font-bold">
                                    <span className="flex items-center gap-1.5 font-extrabold">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Visual Verification Successful
                                    </span>
                                    {visualReport.issuer && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold">
                                            Issuer: {visualReport.issuer}
                                        </span>
                                    )}
                                </div>
                                {visualReport.extractedText && (
                                    <p className="text-[11px] text-charcoal-600 bg-white/70 p-2 rounded-xl border border-emerald-100 font-mono line-clamp-2">
                                        "{visualReport.extractedText}"
                                    </p>
                                )}
                                {visualReport.visualHighlights?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {visualReport.visualHighlights.map((hl, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-emerald-100/60 text-emerald-900 rounded-lg text-[10px] font-bold">
                                                ✓ {hl}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-charcoal-900 text-devyellow-400 font-bold text-xs rounded-xl flex items-center gap-1"
                        >
                            <Save className="w-3.5 h-3.5" /> Save
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 border font-bold text-xs rounded-xl flex items-center gap-1"
                        >
                            <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((item) => (
                    <div key={item.id} className="p-4 bg-white rounded-xl border border-gray-200 flex gap-4 items-center justify-between">
                        <img
                            src={item.imageUrl}
                            alt=""
                            className="w-16 h-16 object-cover rounded-lg bg-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold text-devorange-600 uppercase">{item.category} ({item.date})</div>
                            <h4 className="font-bold text-charcoal-900 text-sm truncate">{item.title}</h4>
                            <p className="text-xs text-charcoal-500 line-clamp-1">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => handleEdit(item)} className="p-2 text-charcoal-700 hover:bg-gray-100 rounded-lg">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AchievementsManager;