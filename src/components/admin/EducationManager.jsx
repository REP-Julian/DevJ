import React, { useState, useRef } from 'react';
import { api } from '../../services/api';
import { notify } from '../../services/notificationService';
import {
    GraduationCap,
    Briefcase,
    BookOpen,
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    Calendar,
    Building2,
    CheckCircle2,
    Clock,
    Tag
} from 'lucide-react';

export const EducationManager = ({
    education = [],
    roles = [],
    research = [],
    onUpdated
}) => {
    const [subTab, setSubTab] = useState('formal'); // 'formal' | 'roles' | 'research'

    // Form states
    const [editingId, setEditingId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const topRef = useRef(null);

    const scrollToTop = () => {
        setTimeout(() => {
            if (topRef.current) {
                topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
    };

    // Education form data
    const [eduForm, setEduForm] = useState({
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

    // Roles form data
    const [roleForm, setRoleForm] = useState({
        title: '',
        subtitle: '',
        period: '',
        description: '',
        tags: '',
        order: 0,
    });

    // Research form data
    const [researchForm, setResearchForm] = useState({
        title: '',
        subtitle: '',
        period: '',
        description: '',
        highlights: '',
        tags: '',
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

    const resetForms = () => {
        setIsCreating(false);
        setEditingId(null);
        setEduForm({
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
        setRoleForm({
            title: '',
            subtitle: '',
            period: '',
            description: '',
            tags: '',
            order: 0,
        });
        setResearchForm({
            title: '',
            subtitle: '',
            period: '',
            description: '',
            highlights: '',
            tags: '',
            order: 0,
        });
    };

    const handleSwitchSubTab = (tab) => {
        resetForms();
        setSubTab(tab);
    };

    // --- FORMAL EDUCATION HANDLERS ---
    const handleEditEdu = (item) => {
        setEditingId(item.id);
        setIsCreating(false);
        setEduForm({
            ...item,
            highlights: Array.isArray(item.highlights) ? item.highlights.join(', ') : (item.highlights || ''),
        });
        scrollToTop();
    };

    const handleCreateNewEdu = () => {
        setIsCreating(true);
        setEditingId(null);
        setEduForm({
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
        scrollToTop();
    };

    const handleSaveEdu = async (e) => {
        if (e) e.preventDefault();
        if (!eduForm.institution.trim()) {
            notify.error('School / Institution name is required', 'Missing Input');
            return;
        }

        const payload = {
            ...eduForm,
            institution: eduForm.institution.trim(),
            degree: eduForm.degree.trim() || eduForm.level,
            period: eduForm.period.trim() || 'Present',
            status: eduForm.status,
            isCurrent: eduForm.status === 'Ongoing',
            location: eduForm.location.trim() || 'Quezon City, Philippines',
            description: eduForm.description.trim(),
            highlights: typeof eduForm.highlights === 'string'
                ? eduForm.highlights.split(',').map(h => h.trim()).filter(Boolean)
                : eduForm.highlights,
            order: Number(eduForm.order) || 1,
        };

        try {
            if (isCreating) {
                await api.createEducation(payload);
                notify.success(`Added "${payload.institution}" to education history!`, 'Milestone Added');
            } else if (editingId) {
                await api.updateEducation(editingId, payload);
                notify.success(`Updated "${payload.institution}" successfully!`, 'Milestone Saved');
            }
            resetForms();
            if (onUpdated) onUpdated();
        } catch (err) {
            notify.error(err.message || 'Failed to save education milestone', 'Save Failed');
        }
    };

    const handleDeleteEdu = async (id, name) => {
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

    // --- ROLES & LEADERSHIP HANDLERS ---
    const handleEditRole = (item) => {
        setEditingId(item.id);
        setIsCreating(false);
        setRoleForm({
            ...item,
            tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
        });
        scrollToTop();
    };

    const handleCreateNewRole = () => {
        setIsCreating(true);
        setEditingId(null);
        setRoleForm({
            title: '',
            subtitle: '',
            period: '2024 - Present',
            description: '',
            tags: 'Team Collaboration, Problem Solving',
            order: roles.length + 1,
        });
        scrollToTop();
    };

    const handleSaveRole = async (e) => {
        if (e) e.preventDefault();
        if (!roleForm.title.trim()) {
            notify.error('Role / Leadership title is required', 'Missing Input');
            return;
        }

        const payload = {
            ...roleForm,
            title: roleForm.title.trim(),
            subtitle: roleForm.subtitle.trim() || 'Leadership & Collaborative Experience',
            period: roleForm.period.trim() || 'Present',
            description: roleForm.description.trim(),
            tags: typeof roleForm.tags === 'string'
                ? roleForm.tags.split(',').map(t => t.trim()).filter(Boolean)
                : roleForm.tags,
            order: Number(roleForm.order) || 1,
        };

        try {
            if (isCreating) {
                await api.createRole(payload);
                notify.success(`Added role "${payload.title}" successfully!`, 'Role Created');
            } else if (editingId) {
                await api.updateRole(editingId, payload);
                notify.success(`Updated role "${payload.title}" successfully!`, 'Role Saved');
            }
            resetForms();
            if (onUpdated) onUpdated();
        } catch (err) {
            notify.error(err.message || 'Failed to save role', 'Save Failed');
        }
    };

    const handleDeleteRole = async (id, name) => {
        if (!window.confirm(`Are you sure you want to remove role "${name}"?`)) {
            return;
        }
        try {
            await api.deleteRole(id);
            notify.success(`Removed role "${name}"`, 'Role Deleted');
            if (onUpdated) onUpdated();
        } catch (err) {
            notify.error(err.message || 'Failed to delete role', 'Delete Failed');
        }
    };

    // --- RESEARCH & INQUIRIES HANDLERS ---
    const handleEditResearch = (item) => {
        setEditingId(item.id);
        setIsCreating(false);
        setResearchForm({
            ...item,
            highlights: Array.isArray(item.highlights) ? item.highlights.join(', ') : (item.highlights || ''),
            tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
        });
        scrollToTop();
    };

    const handleCreateNewResearch = () => {
        setIsCreating(true);
        setEditingId(null);
        setResearchForm({
            title: '',
            subtitle: '',
            period: '2025',
            description: '',
            highlights: '',
            tags: 'Applied AI, Research, Web Performance',
            order: research.length + 1,
        });
        scrollToTop();
    };

    const handleSaveResearch = async (e) => {
        if (e) e.preventDefault();
        if (!researchForm.title.trim()) {
            notify.error('Research inquiry title is required', 'Missing Input');
            return;
        }

        const payload = {
            ...researchForm,
            title: researchForm.title.trim(),
            subtitle: researchForm.subtitle.trim() || 'Academic Projects & Independent Inquiries',
            period: researchForm.period.trim() || 'Present',
            description: researchForm.description.trim(),
            highlights: typeof researchForm.highlights === 'string'
                ? researchForm.highlights.split(',').map(h => h.trim()).filter(Boolean)
                : researchForm.highlights,
            tags: typeof researchForm.tags === 'string'
                ? researchForm.tags.split(',').map(t => t.trim()).filter(Boolean)
                : researchForm.tags,
            order: Number(researchForm.order) || 1,
        };

        try {
            if (isCreating) {
                await api.createResearch(payload);
                notify.success(`Added research inquiry "${payload.title}"!`, 'Research Added');
            } else if (editingId) {
                await api.updateResearch(editingId, payload);
                notify.success(`Updated research inquiry "${payload.title}"!`, 'Research Saved');
            }
            resetForms();
            if (onUpdated) onUpdated();
        } catch (err) {
            notify.error(err.message || 'Failed to save research', 'Save Failed');
        }
    };

    const handleDeleteResearch = async (id, name) => {
        if (!window.confirm(`Are you sure you want to remove research inquiry "${name}"?`)) {
            return;
        }
        try {
            await api.deleteResearch(id);
            notify.success(`Removed research inquiry "${name}"`, 'Research Deleted');
            if (onUpdated) onUpdated();
        } catch (err) {
            notify.error(err.message || 'Failed to delete research', 'Delete Failed');
        }
    };

    return (
        <div ref={topRef} className="space-y-8 max-w-5xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-devyellow-100 text-devorange-600 text-xs font-bold uppercase tracking-wider mb-2">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Academic &amp; Growth Studio</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-charcoal-900">
                        Education, Roles &amp; Research
                    </h2>
                    <p className="text-sm text-charcoal-500 mt-1">
                        Manage your schools, team leadership roles, and research projects displayed on your portfolio.
                    </p>
                </div>

                {!isCreating && !editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            if (subTab === 'formal') handleCreateNewEdu();
                            else if (subTab === 'roles') handleCreateNewRole();
                            else handleCreateNewResearch();
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-devorange-500 hover:bg-devorange-600 text-white font-bold text-sm shadow-warm-sm transition-all self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>
                            {subTab === 'formal' && 'Add School Milestone'}
                            {subTab === 'roles' && 'Add Leadership Role'}
                            {subTab === 'research' && 'Add Research Project'}
                        </span>
                    </button>
                )}
            </div>

            {/* Sub-Tab Navigation Switcher */}
            <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit border border-gray-200/80">
                <button
                    type="button"
                    onClick={() => handleSwitchSubTab('formal')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        subTab === 'formal'
                            ? 'bg-white text-devorange-600 shadow-sm'
                            : 'text-charcoal-600 hover:text-charcoal-900'
                    }`}
                >
                    <GraduationCap className="w-4 h-4" />
                    <span>Formal Education ({education.length})</span>
                </button>
                <button
                    type="button"
                    onClick={() => handleSwitchSubTab('roles')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        subTab === 'roles'
                            ? 'bg-white text-devorange-600 shadow-sm'
                            : 'text-charcoal-600 hover:text-charcoal-900'
                    }`}
                >
                    <Briefcase className="w-4 h-4" />
                    <span>Roles &amp; Leadership ({roles.length})</span>
                </button>
                <button
                    type="button"
                    onClick={() => handleSwitchSubTab('research')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        subTab === 'research'
                            ? 'bg-white text-devorange-600 shadow-sm'
                            : 'text-charcoal-600 hover:text-charcoal-900'
                    }`}
                >
                    <BookOpen className="w-4 h-4" />
                    <span>Research &amp; Inquiries ({research.length})</span>
                </button>
            </div>

            {/* ======================================================== */}
            {/* SUB-TAB 1: FORMAL EDUCATION                             */}
            {/* ======================================================== */}
            {subTab === 'formal' && (
                <div className="space-y-6">
                    {/* Education Create / Edit Form */}
                    {(isCreating || editingId) && (
                        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-devorange-200 shadow-warm-md space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-charcoal-900 flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-devorange-500" />
                                    <span>{isCreating ? 'Add New School Milestone' : 'Edit School Milestone'}</span>
                                </h3>
                                <button
                                    type="button"
                                    onClick={resetForms}
                                    className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-600 hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveEdu} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                            School / Institution Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={eduForm.institution}
                                            onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                                            placeholder="e.g. Quezon City University"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-semibold outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                            Education Level
                                        </label>
                                        <select
                                            value={eduForm.level}
                                            onChange={(e) => setEduForm({ ...eduForm, level: e.target.value })}
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
                                            value={eduForm.degree}
                                            onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                                            placeholder="e.g. Undergraduate Studies"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                            Period / Years
                                        </label>
                                        <input
                                            type="text"
                                            value={eduForm.period}
                                            onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                                            placeholder="e.g. 2025 - Present"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                            Status
                                        </label>
                                        <select
                                            value={eduForm.status}
                                            onChange={(e) => setEduForm({
                                                ...eduForm,
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
                                            value={eduForm.location}
                                            onChange={(e) => setEduForm({ ...eduForm, location: e.target.value })}
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
                                            value={eduForm.highlights}
                                            onChange={(e) => setEduForm({ ...eduForm, highlights: e.target.value })}
                                            placeholder="e.g. Software Engineering Focus, STEM"
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
                                        value={eduForm.description}
                                        onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
                                        placeholder="Summary of courses, key activities, or academic background..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3">
                                    <button
                                        type="button"
                                        onClick={resetForms}
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

                    {/* Education Items List */}
                    <div className="space-y-4">
                        {education.length === 0 ? (
                            <div className="p-12 text-center bg-charcoal-50 rounded-2xl border border-dashed border-gray-200">
                                <GraduationCap className="w-12 h-12 text-charcoal-400 mx-auto mb-3" />
                                <h4 className="text-base font-bold text-charcoal-800">No Education Milestones Yet</h4>
                                <p className="text-xs text-charcoal-500 mt-1">Click "Add School Milestone" above to record your schools.</p>
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
                                        <p className="text-xs sm:text-sm font-semibold text-devorange-600 flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5" />
                                            <span>{item.degree}</span>
                                            {item.location && (
                                                <span className="text-charcoal-400 font-normal">
                                                    &bull; {item.location}
                                                </span>
                                            )}
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
                                            onClick={() => handleEditEdu(item)}
                                            className="p-2 rounded-xl text-charcoal-600 hover:text-devorange-600 hover:bg-devyellow-50 border border-gray-200 transition-colors"
                                            title="Edit Milestone"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteEdu(item.id, item.institution)}
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
            )}

            {/* ======================================================== */}
            {/* SUB-TAB 2: ROLES & LEADERSHIP                           */}
            {/* ======================================================== */}
            {subTab === 'roles' && (
                <div className="space-y-6">
                    {/* Role Create / Edit Form */}
                    {(isCreating || editingId) && (
                        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-devorange-200 shadow-warm-md space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-charcoal-900 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-devorange-500" />
                                    <span>{isCreating ? 'Add Leadership & Team Role' : 'Edit Leadership Role'}</span>
                                </h3>
                                <button
                                    type="button"
                                    onClick={resetForms}
                                    className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-600 hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveRole} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                            Role / Position Title *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={roleForm.title}
                                            onChange={(e) => setRoleForm({ ...roleForm, title: e.target.value })}
                                            placeholder="e.g. Technical Projects & Team Roles"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-semibold outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                            Subtitle / Organization
                                        </label>
                                        <input
                                            type="text"
                                            value={roleForm.subtitle}
                                            onChange={(e) => setRoleForm({ ...roleForm, subtitle: e.target.value })}
                                            placeholder="e.g. Leadership & Collaborative Experience"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                            Period / Years
                                        </label>
                                        <input
                                            type="text"
                                            value={roleForm.period}
                                            onChange={(e) => setRoleForm({ ...roleForm, period: e.target.value })}
                                            placeholder="e.g. 2024 - Present"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                            Skills / Tags (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={roleForm.tags}
                                            onChange={(e) => setRoleForm({ ...roleForm, tags: e.target.value })}
                                            placeholder="e.g. Team Collaboration, Web Development, Problem Solving"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                        Role Description &amp; Responsibilities
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={roleForm.description}
                                        onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                                        placeholder="Describe what you led, built, or collaborated on..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3">
                                    <button
                                        type="button"
                                        onClick={resetForms}
                                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-charcoal-600 hover:bg-gray-50 text-sm font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-devorange-500 hover:bg-devorange-600 text-white text-sm font-bold shadow-warm-sm transition-all"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Save Role</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Roles Items List */}
                    <div className="space-y-4">
                        {roles.length === 0 ? (
                            <div className="p-12 text-center bg-charcoal-50 rounded-2xl border border-dashed border-gray-200">
                                <Briefcase className="w-12 h-12 text-charcoal-400 mx-auto mb-3" />
                                <h4 className="text-base font-bold text-charcoal-800">No Leadership Roles Added Yet</h4>
                                <p className="text-xs text-charcoal-500 mt-1">Click "Add Leadership Role" above to list projects or team positions.</p>
                            </div>
                        ) : (
                            roles.map((role, idx) => (
                                <div
                                    key={role.id || idx}
                                    className="p-6 rounded-2xl border border-gray-200 bg-white hover:border-devorange-300 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="space-y-2 max-w-2xl">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="px-2.5 py-0.5 rounded-md bg-devorange-50 text-devorange-700 text-xs font-black uppercase tracking-wider border border-devorange-200">
                                                Leadership &amp; Roles
                                            </span>
                                            <span className="text-xs font-bold text-charcoal-500 flex items-center gap-1 ml-1">
                                                <Calendar className="w-3.5 h-3.5 text-devorange-500" />
                                                {role.period}
                                            </span>
                                        </div>

                                        <h4 className="text-lg font-black text-charcoal-900">
                                            {role.title}
                                        </h4>
                                        {role.subtitle && (
                                            <p className="text-xs sm:text-sm font-semibold text-devorange-600">
                                                {role.subtitle}
                                            </p>
                                        )}

                                        {role.description && (
                                            <p className="text-xs text-charcoal-600 leading-relaxed pt-1">
                                                {role.description}
                                            </p>
                                        )}

                                        {Array.isArray(role.tags) && role.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {role.tags.map((tag, tIdx) => (
                                                    <span
                                                        key={tIdx}
                                                        className="px-2.5 py-0.5 rounded-lg bg-charcoal-50 border border-gray-200 text-charcoal-700 text-xs font-bold"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleEditRole(role)}
                                            className="p-2 rounded-xl text-charcoal-600 hover:text-devorange-600 hover:bg-devyellow-50 border border-gray-200 transition-colors"
                                            title="Edit Role"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteRole(role.id, role.title)}
                                            className="p-2 rounded-xl text-charcoal-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors"
                                            title="Delete Role"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* SUB-TAB 3: RESEARCH & INQUIRIES                         */}
            {/* ======================================================== */}
            {subTab === 'research' && (
                <div className="space-y-6">
                    {/* Research Create / Edit Form */}
                    {(isCreating || editingId) && (
                        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-devorange-200 shadow-warm-md space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-charcoal-900 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-devorange-500" />
                                    <span>{isCreating ? 'Add Research Inquiry' : 'Edit Research Inquiry'}</span>
                                </h3>
                                <button
                                    type="button"
                                    onClick={resetForms}
                                    className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-600 hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveResearch} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                            Research Title / Topic *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={researchForm.title}
                                            onChange={(e) => setResearchForm({ ...researchForm, title: e.target.value })}
                                            placeholder="e.g. AI & Systems Exploration"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-semibold outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                            Subtitle / Domain
                                        </label>
                                        <input
                                            type="text"
                                            value={researchForm.subtitle}
                                            onChange={(e) => setResearchForm({ ...researchForm, subtitle: e.target.value })}
                                            placeholder="e.g. Academic Projects & Independent Inquiries"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                            Period / Years
                                        </label>
                                        <input
                                            type="text"
                                            value={researchForm.period}
                                            onChange={(e) => setResearchForm({ ...researchForm, period: e.target.value })}
                                            placeholder="e.g. 2025"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                            Tags / Topics (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={researchForm.tags}
                                            onChange={(e) => setResearchForm({ ...researchForm, tags: e.target.value })}
                                            placeholder="e.g. Sustainable Materials, Urban Engineering, Cost Efficiency"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                        Key Metrics &amp; Empirical Findings (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={researchForm.highlights}
                                        onChange={(e) => setResearchForm({ ...researchForm, highlights: e.target.value })}
                                        placeholder="e.g. 20% Cost Efficiency, 4h 56m Water Resistance, r = -0.3785 Correlation"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none"
                                    />
                                    <p className="text-[11px] text-charcoal-400 mt-1">
                                        Displays as metric cards in the paper details modal and highlight pills on the card.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                                        Research Summary &amp; Findings (Full Abstract)
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={researchForm.description}
                                        onChange={(e) => setResearchForm({ ...researchForm, description: e.target.value })}
                                        placeholder="Describe research methodologies, explorations, or system architectures investigated..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-devorange-500 focus:ring-2 focus:ring-devorange-400/20 text-sm font-medium outline-none resize-y"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3">
                                    <button
                                        type="button"
                                        onClick={resetForms}
                                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-charcoal-600 hover:bg-gray-50 text-sm font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-devorange-500 hover:bg-devorange-600 text-white text-sm font-bold shadow-warm-sm transition-all"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Save Research</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Research Items List */}
                    <div className="space-y-4">
                        {research.length === 0 ? (
                            <div className="p-12 text-center bg-charcoal-50 rounded-2xl border border-dashed border-gray-200">
                                <BookOpen className="w-12 h-12 text-charcoal-400 mx-auto mb-3" />
                                <h4 className="text-base font-bold text-charcoal-800">No Research Inquiries Added Yet</h4>
                                <p className="text-xs text-charcoal-500 mt-1">Click "Add Research Project" above to document your academic or technical inquiries.</p>
                            </div>
                        ) : (
                            research.map((item, idx) => (
                                <div
                                    key={item.id || idx}
                                    className="p-6 rounded-2xl border border-gray-200 bg-white hover:border-devorange-300 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="space-y-2 max-w-2xl">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="px-2.5 py-0.5 rounded-md bg-devyellow-100 text-charcoal-900 text-xs font-black uppercase tracking-wider border border-devyellow-200">
                                                Academic Inquiries
                                            </span>
                                            <span className="text-xs font-bold text-charcoal-500 flex items-center gap-1 ml-1">
                                                <Calendar className="w-3.5 h-3.5 text-devorange-500" />
                                                {item.period}
                                            </span>
                                        </div>

                                        <h4 className="text-lg font-black text-charcoal-900">
                                            {item.title}
                                        </h4>
                                        {item.subtitle && (
                                            <p className="text-xs sm:text-sm font-semibold text-devorange-600">
                                                {item.subtitle}
                                            </p>
                                        )}

                                        {item.description && (
                                            <p className="text-xs text-charcoal-600 leading-relaxed pt-1 line-clamp-2">
                                                {item.description}
                                            </p>
                                        )}

                                        {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {item.highlights.map((h, hIdx) => (
                                                    <span
                                                        key={hIdx}
                                                        className="px-2 py-0.5 rounded-md bg-devyellow-50 text-devorange-700 border border-devyellow-200 text-[10px] font-bold"
                                                    >
                                                        {h}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {Array.isArray(item.tags) && item.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {item.tags.map((tag, tIdx) => (
                                                    <span
                                                        key={tIdx}
                                                        className="px-2.5 py-0.5 rounded-lg bg-charcoal-50 border border-gray-200 text-charcoal-700 text-xs font-bold"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleEditResearch(item)}
                                            className="p-2 rounded-xl text-charcoal-600 hover:text-devorange-600 hover:bg-devyellow-50 border border-gray-200 transition-colors"
                                            title="Edit Research"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteResearch(item.id, item.title)}
                                            className="p-2 rounded-xl text-charcoal-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors"
                                            title="Delete Research"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EducationManager;
