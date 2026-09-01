import React, { useState } from 'react';
import ImageUploader from '../common/ImageUploader';
import { api } from '../../services/api';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

export const HobbiesManager = ({ hobbies = [], onUpdated }) => {
    const [editingId, setEditingId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
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
                    <h3 className="font-extrabold text-sm text-charcoal-900">
                        {isCreating ? 'Create Hobby' : 'Edit Hobby'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                <option value="Music">Music</option>
                                <option value="Sparkles">Sparkles (AI/Tech)</option>
                                <option value="Gamepad2">Gaming</option>
                                <option value="BookOpen">Reading</option>
                                <option value="Coffee">Coffee</option>
                                <option value="Heart">Heart</option>
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
                            className="w-full px-3 py-2 border rounded-xl text-xs"
                        />
                    </div>

                    <ImageUploader
                        label="Hobby Image Visual"
                        currentImage={formData.imageUrl}
                        onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
                    />

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