import React, { useState } from 'react';
import ImageUploader from '../common/ImageUploader';
import { api } from '../../services/api';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

export const ProjectsManager = ({ projects = [], onUpdated }) => {
    const [editingId, setEditingId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        technologies: '',
        imageUrl: '',
        githubUrl: '',
        liveUrl: '',
        order: 0,
    });

    const handleEdit = (project) => {
        setEditingId(project.id);
        setIsCreating(false);
        setFormData(project);
    };

    const handleCreateNew = () => {
        setIsCreating(true);
        setEditingId(null);
        setFormData({
            title: '',
            category: 'AI Platform',
            description: '',
            technologies: 'React, Node.js, TailwindCSS',
            imageUrl: '',
            githubUrl: 'https://github.com',
            liveUrl: 'https://example.com',
            order: projects.length + 1,
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
                await api.createProject(formData);
            } else {
                await api.updateProject(editingId, formData);
            }
            handleCancel();
            onUpdated();
        } catch (err) {
            alert(err.message || 'Error saving project');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this project?')) {
            try {
                await api.deleteProject(id);
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
                    <h2 className="text-2xl font-black text-charcoal-900">Projects Management</h2>
                    <p className="text-xs text-charcoal-500">Edit featured work, tech tags, repository links, and media assets.</p>
                </div>
                {!isCreating && !editingId && (
                    <button
                        onClick={handleCreateNew}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-devyellow-400 text-charcoal-900 flex items-center gap-1.5 hover:bg-devorange-400 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Project
                    </button>
                )}
            </div>

            {(isCreating || editingId) && (
                <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl border border-devyellow-300 shadow-warm-sm space-y-4">
                    <h3 className="font-extrabold text-sm text-charcoal-900">
                        {isCreating ? 'Create Project' : 'Edit Project'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Project Title</label>
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

                    <div>
                        <label className="block text-xs font-semibold text-charcoal-800 mb-1">Technologies (comma-separated)</label>
                        <input
                            type="text"
                            required
                            value={formData.technologies}
                            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                            placeholder="React, TypeScript, OpenAI API, Express"
                            className="w-full px-3 py-2 border rounded-xl text-xs"
                        />
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-800 mb-1">GitHub URL</label>
                            <input
                                type="text"
                                value={formData.githubUrl}
                                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                className="w-full px-3 py-2 border rounded-xl text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Live Demo URL</label>
                            <input
                                type="text"
                                value={formData.liveUrl}
                                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
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

                    <ImageUploader
                        label="Project Cover Image"
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
                {projects.map((project) => (
                    <div key={project.id} className="p-4 bg-white rounded-xl border border-gray-200 flex gap-4 items-center justify-between">
                        <img
                            src={project.imageUrl}
                            alt=""
                            className="w-16 h-16 object-cover rounded-lg bg-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold text-devorange-600 uppercase">{project.category}</div>
                            <h4 className="font-bold text-charcoal-900 text-sm truncate">{project.title}</h4>
                            <p className="text-xs text-charcoal-500 truncate">{project.technologies}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => handleEdit(project)} className="p-2 text-charcoal-700 hover:bg-gray-100 rounded-lg">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(project.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsManager;