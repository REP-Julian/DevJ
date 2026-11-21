import React, { useState } from 'react';
import { api } from '../../services/api';
import { notify } from '../../services/notificationService';
import {
    GraduationCap,
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    Calendar,
    Building2,
    CheckCircle2,
    Clock,
    Sparkles,
    MoveUp,
    MoveDown
} from 'lucide-react';

export const EducationManager = ({ education = [], onUpdated }) => {
    const [editingId, setEditingId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        institution: '',
        level: 'College',
        degree: '',
        period: '',
        status: 'Ongoing',
        isCurrent: true,
        location: 'Quezon City, Philippines',
        description: '',
        highlights: '',
        order: 0,
    });

    const levelOptions = [
        'College',
        'Senior High School',
        'Junior High School',
        'Elementary School',
        'Vocational / Certification',
        'Postgraduate Studies',
    ];

    const handleEdit = (item) => {
        setEditingId(item.id);
        setIsCreating(false);
        setFormData({
            ...item,
            highlights: Array.isArray(item.highlights) ? item.highlights.join(', ') : (item.highlights || ''),
        });
    };

    const handleCreateNew = () => {
        setIsCreating(true);
        setEditingId(null);
        setFormData({
            institution: '',
            level: 'College',
            degree: '',
            period: '',
            status: 'Ongoing',
            isCurrent: true,
            location: 'Quezon City, Philippines',
            description: '',
            highlights: '',
            order: education.length + 1,
        });
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingId(null);
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        if (!formData.institution.trim()) {
            notify.error('School / Institution name is required', 'Missing Input');
            return;
        }

        const payload = {
            ...formData,
            institution: formData.institution.trim(),
            degree: formData.degree.trim() || formData.level,
            period: formData.period.trim() || 'Present',
            status: formData.status,
            isCurrent: formData.status === 'Ongoing',
            location: formData.location.trim() || 'Quezon City, Philippines',
            description: formData.description.trim(),
            highlights: typeof formData.highlights === 'string'
                ? formData.highlights.split(',').map(h => h.trim()).filter(Boolean)
                : formData.highlights,
            order: Number(formData.order) || 1,
        };

        try {
            if (isCreating) {
                await api.createEducation(payload);
                notify.success(`Added "${payload.institution}" to education history!`, 'Milestone Added');
            } else if (editingId) {
                await api.updateEducation(editingId, payload);
                notify.success(`Updated "${payload.institution}" successfully!`, 'Milestone Saved');
            }
            setIsCreating(false);
            setEditingId(null);
            if (onUpdated) onUpdated();
        } catch (err) {
            notify.error(err.message || 'Failed to save education milestone', 'Save Failed');
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to remove "${name}" from your education milestones?`)) {
            return;
        }
        try {
            await api.deleteEducation(id);
            notify.success(`Removed "${name}" from education history`, 'Milestone Deleted');
            if (onUpdated) onUpdated();
        } catch (err) {
            notify.error(err.message || 'Failed to delete milestone', 'Delete Failed');
        }
    };

    return (
        <div className="space-y-8 max-w-5xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-devyellow-100 text-devorange-600 text-xs font-bold uppercase tracking-wider mb-2">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Academic Timeline</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-charcoal-900">
                        Education &amp; Growth Manager
                    </h2>
                    <p className="text-sm text-charcoal-500 mt-1">
                        Manage and update your schools, degrees, and academic milestones anytime.
                    </p>
                </div>
                {!isCreating && !editingId && (
                    <button
                        type="button"
                        onClick={handleCreateNew}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-devorange-500 hover:bg-devorange-600 text-white font-bold text-sm shadow-warm-sm transition-all self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Education Milestone</span>
                    </button>
                )}
            </div>

            {/* Create or Edit Form */}
            {(isCreating || editingId) && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-devorange-200 shadow-warm-md space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-charcoal-900 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-devorange-500" />
                            <span>{isCreating ? 'Add New Education Milestone' : 'Edit Education Milestone'}</span>
                        </h3>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-600 hover:bg-gray-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                    School / Institution Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.institution}
                                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                    placeholder="e.g. Quezon City University"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-semibold outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                    Education Level
                                </label>
                                <select
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-semibold outline-none bg-white"
                                >
                                    {levelOptions.map((lvl) => (
                                        <option key={lvl} value={lvl}>{lvl}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                    Degree / Strand / Program
                                </label>
                                <input
                                    type="text"
                                    value={formData.degree}
                                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                    placeholder="e.g. BS in Information Technology"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                    Period / Years
                                </label>
                                <input
                                    type="text"
                                    value={formData.period}
                                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                    placeholder="e.g. 2025 - Present"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        status: e.target.value,
                                        isCurrent: e.target.value === 'Ongoing',
                                    })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-semibold outline-none bg-white"
                                >
                                    <option value="Ongoing">Ongoing / Current</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g. Quezon City, Philippines"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                    Highlights / Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.highlights}
                                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                                    placeholder="e.g. Software Engineering Focus, Dean's Lister"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                Description &amp; Learnings
                            </label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Summary of courses, key activities, or academic background..."
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none resize-none"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 text-charcoal-600 hover:bg-gray-50 text-sm font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-devorange-500 hover:bg-devorange-600 text-white text-sm font-bold shadow-warm-sm transition-all"
                            >
                                <Save className="w-4 h-4" />
                                <span>Save Milestone</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Existing Milestones List */}
            <div className="space-y-4">
                {education.length === 0 ? (
                    <div className="p-12 text-center bg-charcoal-50 rounded-2xl border border-dashed border-gray-200">
                        <GraduationCap className="w-12 h-12 text-charcoal-400 mx-auto mb-3" />
                        <h4 className="text-base font-bold text-charcoal-800">No Education Milestones Yet</h4>
                        <p className="text-xs text-charcoal-500 mt-1">Click "Add Education Milestone" above to record your schools.</p>
                    </div>
                ) : (
                    education.map((item, idx) => (
                        <div
                            key={item.id || idx}
                            className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                item.isCurrent
                                    ? 'bg-gradient-to-r from-orange-50/40 via-devyellow-50/20 to-white border-devorange-300 shadow-sm'
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="space-y-2 max-w-2xl">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-md bg-devyellow-100 text-devorange-700 text-xs font-black uppercase tracking-wider">
                                        {item.level}
                                    </span>
                                    <span
                                        className={`px-2.5 py-0.5 rounded-md text-xs font-bold inline-flex items-center gap-1 ${
                                            item.isCurrent
                                                ? 'bg-devorange-500 text-white'
                                                : 'bg-gray-100 text-charcoal-600'
                                        }`}
                                    >
                                        {item.isCurrent ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                        <span>{item.status || (item.isCurrent ? 'Ongoing' : 'Completed')}</span>
                                    </span>
                                    <span className="text-xs font-bold text-charcoal-500 flex items-center gap-1 ml-1">
                                        <Calendar className="w-3.5 h-3.5 text-devorange-500" />
                                        {item.period}
                                    </span>
                                </div>

                                <h4 className="text-lg font-black text-charcoal-900">
                                    {item.institution}
                                </h4>
                                <p className="text-xs sm:text-sm font-semibold text-devorange-600 flex items-center gap-1">
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>{item.degree}</span>
                                    {item.location && <span className="text-charcoal-400 font-normal">â€¢ {item.location}</span>}
                                </p>

                                {item.description && (
                                    <p className="text-xs text-charcoal-600 leading-relaxed pt-1">
                                        {item.description}
                                    </p>
                                )}

                                {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {item.highlights.map((h, hIdx) => (
                                            <span
                                                key={hIdx}
                                                className="px-2 py-0.5 rounded bg-gray-100 text-charcoal-600 text-[11px] font-medium"
                                            >
                                                {h}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(item)}
                                    className="p-2 rounded-xl text-charcoal-600 hover:text-devorange-600 hover:bg-devyellow-50 border border-gray-200 transition-colors"
                                    title="Edit Milestone"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(item.id, item.institution)}
                                    className="p-2 rounded-xl text-charcoal-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors"
                                    title="Delete Milestone"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EducationManager;
