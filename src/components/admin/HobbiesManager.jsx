import React, { useState } from 'react';
import ImageUploader from '../common/ImageUploader';
import { api } from '../../services/api';
import { aiService } from '../../services/aiService';
import { Plus, Trash2, Edit2, Save, X, Sparkles, Loader2, Eye } from 'lucide-react';

export const HobbiesManager = ({ hobbies = [], onUpdated }) => {
    const [editingId, setEditingId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiVisionScanning, setAiVisionScanning] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        iconName: 'Heart',
        order: 0,
    });

    const handleEdit = (hobby) => {
        setEditingId(hobby.id);
        setIsCreating(false);
        setFormData(hobby);
    };

    const handleCreateNew = () => {
        setIsCreating(true);
        setEditingId(null);
        setFormData({
            name: '',
            description: '',
            imageUrl: '',
            iconName: 'Heart',
            order: hobbies.length + 1,
        });
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingId(null);
    };

    const handleEnhanceHobby = async () => {
        if (!formData.name.trim()) {
            alert('Please enter a hobby or creative interest name first');
            return;
        }
        setAiLoading(true);
        try {
            const res = await aiService.enhanceHobby(formData);
            setFormData(prev => ({
                ...prev,
                name: res.name || prev.name,
                description: res.description || prev.description,
                iconName: res.iconName || prev.iconName,
            }));
        } catch (e) {
            alert(e.message || 'AI hobby enhancement failed');
        } finally {
            setAiLoading(false);
        }
    };

    const handleScanHobbyVisual = async () => {
        if (!formData.imageUrl) {
            alert('Please upload or select an image for this hobby first');
            return;
        }
        setAiVisionScanning(true);
        try {
            const res = await aiService.analyzeHobbyVisual(formData.imageUrl, formData);
            setFormData(prev => ({
                ...prev,
                name: res.name || prev.name,
                description: res.description || prev.description,
                iconName: res.iconName || prev.iconName,
            }));
        } catch (e) {
            alert(e.message || 'AI vision analysis failed');
        } finally {
            setAiVisionScanning(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isCreating) {
                await api.createHobby(formData);
            } else {
                await api.updateHobby(editingId, formData);
            }
            handleCancel();
            onUpdated();
        } catch (err) {
            alert(err.message || 'Error saving hobby');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this hobby?')) {
            try {
                await api.deleteHobby(id);
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
                    <h2 className="text-2xl font-black text-charcoal-900">Hobbies Management</h2>
                    <p className="text-xs text-charcoal-500">Configure personal interest cards and creative photography showcases.</p>
                </div>
                {!isCreating && !editingId && (
                    <button
                        onClick={handleCreateNew}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-devyellow-400 text-charcoal-900 flex items-center gap-1.5 hover:bg-devorange-400 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Hobby
                    </button>
                )}
            </div>

            {(isCreating || editingId) && (
                <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl border border-devyellow-300 shadow-warm-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-sm text-charcoal-900">
                            {isCreating ? 'Create Hobby' : 'Edit Hobby'}
                        </h3>
                        <div className="flex items-center gap-2">
                            {formData.imageUrl && (
                                <button
                                    type="button"
                                    onClick={handleScanHobbyVisual}
                                    disabled={aiVisionScanning}
                                    className="px-3 py-1 rounded-xl bg-charcoal-900 hover:bg-black text-devyellow-400 border border-charcoal-700 text-xs font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-xs"
                                >
                                    {aiVisionScanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                                    <span>{aiVisionScanning ? 'Scanning Photo...' : '👁️ AI Read Photo'}</span>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleEnhanceHobby}
                                disabled={aiLoading}
                                className="px-3 py-1 rounded-xl bg-devyellow-100 hover:bg-devyellow-200 text-devorange-600 border border-devyellow-300 text-xs font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                            >
                                {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-devyellow-600 fill-devyellow-400" />}
                                <span>{aiLoading ? 'Enhancing Vibe...' : '✨ AI Polish Vibe'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Photography, Generative Music, Mechanical Keyboards"
                                className="w-full px-3 py-2 border rounded-xl text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Icon Style</label>
                            <select
                                value={formData.iconName}
                                onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                                className="w-full px-3 py-2 border rounded-xl text-xs"
                            >
                                <option value="Camera">Camera (Photography)</option>
                                <option value="Music">Music (Audio / Production)</option>
                                <option value="Sparkles">Sparkles (AI / Creative Tech)</option>
                                <option value="Gamepad2">Gaming & Esports</option>
                                <option value="BookOpen">Reading & Literature</option>
                                <option value="Coffee">Coffee & Lifestyle</option>
                                <option value="Heart">Heart & Wellbeing</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-charcoal-800 mb-1">Description</label>
                        <textarea
                            rows={2}
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="A concise, personal statement showing passion and balance..."
                            className="w-full px-3 py-2 border rounded-xl text-xs"
                        />
                    </div>

                    <div className="space-y-2">
                        <ImageUploader
                            label="Hobby Image Visual (Photography, Art, Setup)"
                            currentImage={formData.imageUrl}
                            onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
                        />
                        {formData.imageUrl && (
                            <div className="p-3 bg-devyellow-50/80 border border-devyellow-200 rounded-2xl flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-devorange-500" />
                                    <span className="text-[11px] text-charcoal-700 font-bold">
                                        Gemini Vision can inspect this photo to generate an authentic description.
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleScanHobbyVisual}
                                    disabled={aiVisionScanning}
                                    className="px-3 py-1.5 rounded-xl bg-charcoal-900 text-devyellow-400 font-extrabold text-xs flex items-center gap-1.5 hover:bg-black transition-all shrink-0"
                                >
                                    {aiVisionScanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                    <span>{aiVisionScanning ? 'Analyzing...' : 'Scan Photo with Vision'}</span>
                                </button>
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
                {hobbies.map((hobby) => (
                    <div key={hobby.id} className="p-4 bg-white rounded-xl border border-gray-200 flex gap-4 items-center justify-between">
                        <img
                            src={hobby.imageUrl}
                            alt=""
                            className="w-16 h-16 object-cover rounded-lg bg-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-charcoal-900 text-sm truncate">{hobby.name}</h4>
                            <p className="text-xs text-charcoal-500 line-clamp-1">{hobby.description}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => handleEdit(hobby)} className="p-2 text-charcoal-700 hover:bg-gray-100 rounded-lg">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(hobby.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HobbiesManager;