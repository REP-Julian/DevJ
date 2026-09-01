import React, { useState } from 'react';
import { api } from '../../services/api';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import BrandIcon from '../common/BrandIcon';

export const SkillsManager = ({ skills = [], onUpdated }) => {
    const [editingId, setEditingId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
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
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                    <h2 className="text-2xl font-black text-charcoal-900">Skills & Tech Stack</h2>
                    <p className="text-xs text-charcoal-500">Manage specialized AI tools, programming languages, and proficiency levels.</p>
                </div>
                {!isCreating && !editingId && (
                    <button
                        onClick={handleCreateNew}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-devyellow-400 text-charcoal-900 flex items-center gap-1.5 shadow-sm hover:bg-devorange-400 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Skill / Tool
                    </button>
                )}
            </div>

            {(isCreating || editingId) && (
                <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl border border-devyellow-300 shadow-warm-sm space-y-4">
                    <h3 className="font-extrabold text-sm text-charcoal-900">
                        {isCreating ? 'Create New Skill or Tool' : 'Edit Skill / Tool'}
                    </h3>

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