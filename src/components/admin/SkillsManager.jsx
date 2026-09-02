import React, { useState } from 'react';
import { api } from '../../services/api';
import { aiService } from '../../services/aiService';
import { Plus, Trash2, Edit2, Save, X, Sparkles, Loader2, Lightbulb, CheckCircle2 } from 'lucide-react';
import BrandIcon from '../common/BrandIcon';

export const SkillsManager = ({ skills = [], onUpdated }) => {
    const [editingId, setEditingId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [gapLoading, setGapLoading] = useState(false);
    const [suggestedSkills, setSuggestedSkills] = useState([]);
    const [formData, setFormData] = useState({
        category: 'Specialized Frontier AI',
        name: '',
        description: '',
        proficiency: 95,
        iconName: 'Gemini',
        order: 0,
    });

    const handleEdit = (skill) => {
        setEditingId(skill.id);
        setIsCreating(false);
        setFormData(skill);
    };

    const handleCreateNew = () => {
        setIsCreating(true);
        setEditingId(null);
        setFormData({
            category: 'Specialized Frontier AI',
            name: '',
            description: '',
            proficiency: 95,
            iconName: 'Gemini',
            order: skills.length + 1,
        });
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingId(null);
    };

    const handleEnhanceSkill = async () => {
        if (!formData.name.trim()) {
            alert('Please enter a tool or skill name first');
            return;
        }
        setAiLoading(true);
        try {
            const res = await aiService.enhanceSkill(formData);
            setFormData(prev => ({
                ...prev,
                name: res.name || prev.name,
                category: res.category || prev.category,
                proficiency: res.proficiency || prev.proficiency,
                iconName: res.iconName || prev.iconName,
                description: res.description || prev.description,
            }));
        } catch (e) {
            alert(e.message || 'AI skill analysis failed');
        } finally {
            setAiLoading(false);
        }
    };

    const handleAnalyzeGap = async () => {
        setGapLoading(true);
        try {
            const res = await aiService.analyzeSkillsGap(skills);
            setSuggestedSkills(res || []);
        } catch (e) {
            alert(e.message || 'Failed to analyze skills gap');
        } finally {
            setGapLoading(false);
        }
    };

    const handleAddSuggestedSkill = async (suggested) => {
        try {
            await api.createSkill({
                name: suggested.name,
                category: suggested.category || 'Specialized Frontier AI',
                proficiency: suggested.proficiency || 95,
                iconName: suggested.iconName || 'Gemini',
                description: suggested.description || '',
                order: skills.length + 1,
            });
            onUpdated();
            setSuggestedSkills(prev => prev.filter(s => s.name !== suggested.name));
        } catch (e) {
            alert(e.message || 'Failed to add skill');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isCreating) {
                await api.createSkill(formData);
            } else {
                await api.updateSkill(editingId, formData);
            }
            handleCancel();
            onUpdated();
        } catch (err) {
            alert(err.message || 'Error saving skill');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this skill?')) {
            try {
                await api.deleteSkill(id);
                onUpdated();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
                <div>
                    <h2 className="text-2xl font-black text-charcoal-900">Skills & Tech Stack</h2>
                    <p className="text-xs text-charcoal-500">Manage specialized AI tools, programming languages, and proficiency levels.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleAnalyzeGap}
                        disabled={gapLoading}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-devyellow-50 text-devorange-700 border border-devyellow-300 hover:bg-devyellow-100 flex items-center gap-1.5 transition-all shadow-xs"
                    >
                        {gapLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5 text-devyellow-600 fill-devyellow-400" />}
                        <span>{gapLoading ? 'Analyzing 2026 Tech...' : '✨ AI Tech Gap Analyzer'}</span>
                    </button>
                    {!isCreating && !editingId && (
                        <button
                            onClick={handleCreateNew}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-devyellow-400 text-charcoal-900 flex items-center gap-1.5 shadow-sm hover:bg-devorange-400 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add Skill / Tool
                        </button>
                    )}
                </div>
            </div>

            {/* AI Gap Suggestions Banner */}
            {suggestedSkills.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-devyellow-50 via-amber-50 to-orange-50 border border-devyellow-200 rounded-3xl space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-charcoal-900 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-devorange-500 fill-devyellow-400" />
                            Gemini 2026 Trending Tech Suggestions for Your Stack:
                        </span>
                        <button
                            onClick={() => setSuggestedSkills([])}
                            className="text-xs font-bold text-charcoal-400 hover:text-charcoal-700"
                        >
                            Dismiss
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {suggestedSkills.map((s, i) => (
                            <div key={i} className="p-3 bg-white rounded-2xl border border-devyellow-200/80 shadow-xs flex flex-col justify-between space-y-2">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-charcoal-900">{s.name}</span>
                                        <span className="text-[10px] font-bold text-devorange-600">{s.proficiency}%</span>
                                    </div>
                                    <p className="text-[10px] text-charcoal-500 mt-1 line-clamp-2">{s.reason || s.description}</p>
                                </div>
                                <button
                                    onClick={() => handleAddSuggestedSkill(s)}
                                    className="w-full py-1.5 rounded-xl bg-charcoal-900 text-devyellow-400 text-[10px] font-extrabold flex items-center justify-center gap-1 hover:bg-black transition-all"
                                >
                                    <Plus className="w-3 h-3" /> 1-Click Add
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {(isCreating || editingId) && (
                <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl border border-devyellow-300 shadow-warm-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-sm text-charcoal-900">
                            {isCreating ? 'Create New Skill or Tool' : 'Edit Skill / Tool'}
                        </h3>
                        <button
                            type="button"
                            onClick={handleEnhanceSkill}
                            disabled={aiLoading}
                            className="px-3 py-1 rounded-xl bg-devyellow-100 hover:bg-devyellow-200 text-devorange-600 border border-devyellow-300 text-xs font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                        >
                            {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-devyellow-600 fill-devyellow-400" />}
                            <span>{aiLoading ? 'Enhancing with Gemini...' : '✨ AI Auto-Categorize & Enhance'}</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Category</label>
                            <input
                                type="text"
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                placeholder="Specialized Frontier AI or Programming Languages"
                                className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-devorange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Tool / Language Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Google Gemini, Python, JavaScript"
                                className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-devorange-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Proficiency %</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                required
                                value={formData.proficiency}
                                onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                                className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-devorange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Brand Logo Icon</label>
                            <select
                                value={formData.iconName}
                                onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                                className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-devorange-500"
                            >
                                <optgroup label="Frontier AI Models">
                                    <option value="Gemini">Google Gemini</option>
                                    <option value="ChatGPT">ChatGPT (OpenAI)</option>
                                    <option value="Claude">Claude AI (Anthropic)</option>
                                    <option value="Deepseek">DeepSeek AI</option>
                                </optgroup>
                                <optgroup label="Programming Languages">
                                    <option value="JavaScript">JavaScript</option>
                                    <option value="Python">Python</option>
                                    <option value="Java">Java</option>
                                    <option value="HTML">HTML5</option>
                                    <option value="CSS">CSS3</option>
                                    <option value="TypeScript">TypeScript</option>
                                    <option value="React">React</option>
                                    <option value="Node">Node.js</option>
                                </optgroup>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Sort Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-devorange-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-charcoal-900 text-devyellow-400 font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-charcoal-800 transition-colors"
                        >
                            <Save className="w-3.5 h-3.5" /> Save
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 border font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-gray-50 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                    <div
                        key={skill.id}
                        className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-3"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2">
                                <BrandIcon name={skill.iconName || skill.name} className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm text-charcoal-900">{skill.name}</h4>
                                <span className="text-[11px] text-charcoal-500">{skill.category} • {skill.proficiency}%</span>
                            </div>
                        </div>

                        <div className="flex gap-1.5">
                            <button
                                onClick={() => handleEdit(skill)}
                                className="p-1.5 rounded-lg border text-charcoal-700 hover:bg-gray-100 transition-colors"
                                title="Edit"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleDelete(skill.id)}
                                className="p-1.5 rounded-lg border text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillsManager;