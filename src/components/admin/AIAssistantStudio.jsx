import React, { useState, useEffect, useRef } from 'react';
import { aiService } from '../../services/aiService';
import { api } from '../../services/api';
import FormattedMessage from './FormattedMessage';
import ImageUploader from '../common/ImageUploader';
import {
    Sparkles,
    Send,
    Bot,
    User,
    Key,
    CheckCircle2,
    AlertCircle,
    Loader2,
    RefreshCw,
    Wand2,
    Lightbulb,
    Award,
    FileText,
    Copy,
    Check,
    BarChart3,
    ArrowRight,
    ShieldAlert,
    ExternalLink,
    Eye,
    Image as ImageIcon,
    Wrench,
    Heart,
    Mail,
    MessageSquare,
    Plus
} from 'lucide-react';

export const AIAssistantStudio = ({ portfolio, onUpdated }) => {
    // Active View Mode inside AI Studio: 'chat' | 'bio' | 'skills' | 'project' | 'achievement' | 'hobbies' | 'inquiries' | 'audit'
    const [activeTool, setActiveTool] = useState('chat');

    // API Key State & Modal
    const [hasKey, setHasKey] = useState(aiService.hasApiKey());
    const [apiKeyInput, setApiKeyInput] = useState(aiService.getApiKey());
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [keyTesting, setKeyTesting] = useState(false);
    const [keyStatus, setKeyStatus] = useState({ success: false, error: '' });

    // Chat State
    const [messages, setMessages] = useState([
        {
            role: 'model',
            content: `👋 Welcome to DevJ AI Studio!\n\nI am your Gemini AI Copilot. I have live access to your entire portfolio (Profile, Skills, Projects, Achievements, Hobbies, and Inquiries).\n\nHow can I assist you today? You can ask me to inspect achievement visuals & certificates, rewrite your bio, analyze your skills gap, brainstorm new projects, or run a full portfolio audit!`,
        },
    ]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Bio Generator State
    const [bioTone, setBioTone] = useState('innovative and visionary');
    const [generatedBio, setGeneratedBio] = useState(null);
    const [bioLoading, setBioLoading] = useState(false);
    const [bioApplying, setBioApplying] = useState(false);

    // Skills Studio State
    const [skillsGapList, setSkillsGapList] = useState([]);
    const [skillsLoading, setSkillsLoading] = useState(false);

    // Project Generator State
    const [projectIdea, setProjectIdea] = useState('');
    const [projectCategory, setProjectCategory] = useState('Generative AI Platform');
    const [generatedProject, setGeneratedProject] = useState(null);
    const [projectLoading, setProjectLoading] = useState(false);
    const [projectApplying, setProjectApplying] = useState(false);

    // Achievement Magnifier & Visual Scanner State
    const [achievementTitle, setAchievementTitle] = useState('');
    const [achievementNotes, setAchievementNotes] = useState('');
    const [achievementVisual, setAchievementVisual] = useState('');
    const [generatedAchievement, setGeneratedAchievement] = useState(null);
    const [achievementLoading, setAchievementLoading] = useState(false);
    const [achievementApplying, setAchievementApplying] = useState(false);

    // Hobbies Studio State
    const [hobbyName, setHobbyName] = useState('');
    const [hobbyDescription, setHobbyDescription] = useState('');
    const [hobbyVisual, setHobbyVisual] = useState('');
    const [generatedHobby, setGeneratedHobby] = useState(null);
    const [hobbyLoading, setHobbyLoading] = useState(false);
    const [hobbyApplying, setHobbyApplying] = useState(false);

    // Inquiries Studio State
    const [inquiries, setInquiries] = useState([]);
    const [inquiriesLoading, setInquiriesLoading] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [inquiryDraft, setInquiryDraft] = useState('');
    const [draftLoading, setDraftLoading] = useState(false);
    const [draftTone, setDraftTone] = useState('warm and professional');

    // Audit State
    const [auditResult, setAuditResult] = useState(null);
    const [auditLoading, setAuditLoading] = useState(false);

    // Copy Notification helper
    const [copiedIndex, setCopiedIndex] = useState(null);

    // Load inquiries on mount
    useEffect(() => {
        const loadMessages = async () => {
            setInquiriesLoading(true);
            try {
                const msgs = await api.getMessages();
                setInquiries(msgs || []);
                if (msgs && msgs.length > 0) {
                    setSelectedInquiry(msgs[0]);
                }
            } catch (err) {
                console.warn('Could not load messages for AI Studio:', err);
            } finally {
                setInquiriesLoading(false);
            }
        };
        loadMessages();
    }, []);

    // Proactive Live Sync & Real-Time Added Info Acknowledgment
    const prevPortfolioRef = useRef({
        skillsCount: portfolio?.skills?.length || 0,
        projectsCount: portfolio?.projects?.length || 0,
        achievementsCount: portfolio?.achievements?.length || 0,
        hobbiesCount: portfolio?.hobbies?.length || 0,
        name: portfolio?.profile?.name || '',
        tagline: portfolio?.profile?.tagline || '',
    });
    const isMountedRef = useRef(false);

    useEffect(() => {
        if (!isMountedRef.current) {
            isMountedRef.current = true;
            prevPortfolioRef.current = {
                skillsCount: portfolio?.skills?.length || 0,
                projectsCount: portfolio?.projects?.length || 0,
                achievementsCount: portfolio?.achievements?.length || 0,
                hobbiesCount: portfolio?.hobbies?.length || 0,
                name: portfolio?.profile?.name || '',
                tagline: portfolio?.profile?.tagline || '',
            };
            return;
        }

        const prev = prevPortfolioRef.current;
        const currentSkillsCount = portfolio?.skills?.length || 0;
        const currentProjectsCount = portfolio?.projects?.length || 0;
        const currentAchievementsCount = portfolio?.achievements?.length || 0;
        const currentHobbiesCount = portfolio?.hobbies?.length || 0;

        let addedMessage = null;

        if (currentSkillsCount > prev.skillsCount) {
            const newSkill = portfolio.skills[portfolio.skills.length - 1];
            addedMessage = `⚡ **Live Sync Acknowledged:** I detected that you just added **${newSkill?.name || 'a new skill'}** (${newSkill?.category || 'Specialized AI'}) to your Skills & Tech Stack! I've automatically updated my internal index and will factor it into your project ideas, copilot responses, and portfolio audits.`;
        } else if (currentProjectsCount > prev.projectsCount) {
            const newProj = portfolio.projects[portfolio.projects.length - 1];
            addedMessage = `🚀 **Live Sync Acknowledged:** I detected a new project addition: **${newProj?.title || 'New Project'}** [${newProj?.category || 'Project'}] with tech stack \`${newProj?.technologies || 'Modern Tech'}\`. My project knowledge graph and client pitch recommendations have been updated!`;
        } else if (currentAchievementsCount > prev.achievementsCount) {
            const newAch = portfolio.achievements[portfolio.achievements.length - 1];
            addedMessage = `🏆 **Live Sync Acknowledged:** New achievement **${newAch?.title || 'Milestone'}** (${newAch?.category || 'Award'}, ${newAch?.date || '2025'}) is now synced! I've indexed this accomplishment into your portfolio highlights.`;
        } else if (currentHobbiesCount > prev.hobbiesCount) {
            const newHobby = portfolio.hobbies[portfolio.hobbies.length - 1];
            addedMessage = `🎨 **Live Sync Acknowledged:** New creative interest **${newHobby?.name || 'Hobby'}** detected! Your creative persona narrative has been enriched.`;
        } else if (portfolio?.profile?.tagline !== prev.tagline && prev.tagline !== '') {
            addedMessage = `👤 **Live Sync Acknowledged:** I see you updated your profile tagline to: "${portfolio.profile.tagline}". I've aligned my copy generation tone with your new branding!`;
        }

        if (addedMessage) {
            setMessages((prevMsgs) => [
                ...prevMsgs,
                { role: 'model', content: addedMessage }
            ]);
        }

        prevPortfolioRef.current = {
            skillsCount: currentSkillsCount,
            projectsCount: currentProjectsCount,
            achievementsCount: currentAchievementsCount,
            hobbiesCount: currentHobbiesCount,
            name: portfolio?.profile?.name || '',
            tagline: portfolio?.profile?.tagline || '',
        };
    }, [portfolio]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, chatLoading]);

    // Handle API Key Save
    const handleSaveKey = async (e) => {
        e.preventDefault();
        setKeyTesting(true);
        setKeyStatus({ success: false, error: '' });

        try {
            if (apiKeyInput.trim()) {
                await aiService.testConnection(apiKeyInput.trim());
                aiService.setApiKey(apiKeyInput.trim());
                setHasKey(true);
                setKeyStatus({ success: true, error: '' });
                setTimeout(() => setShowKeyModal(false), 1200);
            } else {
                aiService.removeApiKey();
                setHasKey(false);
                setKeyStatus({ success: true, error: '' });
                setTimeout(() => setShowKeyModal(false), 800);
            }
        } catch (err) {
            setKeyStatus({ success: false, error: err.message || 'Connection failed. Check your API key.' });
        } finally {
            setKeyTesting(false);
        }
    };

    // Handle Chat Submit with smooth streaming token reveal
    const handleSendChat = async (e) => {
        e?.preventDefault();
        if (!chatInput.trim() || chatLoading) return;

        const userMsg = chatInput.trim();
        setChatInput('');
        const updatedMessages = [...messages, { role: 'user', content: userMsg }];
        setMessages(updatedMessages);
        setChatLoading(true);

        try {
            // Include complete live portfolio context including inquiries
            const fullContext = {
                ...(portfolio || {}),
                messages: inquiries || []
            };
            const aiResponse = await aiService.chatWithCopilot(userMsg, updatedMessages, fullContext);
            
            // Smooth typing reveal
            const fullText = aiResponse;
            const chunkSize = Math.max(1, Math.floor(fullText.length / 35));
            for (let i = 0; i < fullText.length; i += chunkSize) {
                const currentText = fullText.slice(0, i + chunkSize);
                setMessages([...updatedMessages, { role: 'model', content: currentText }]);
                await new Promise((r) => setTimeout(r, 14));
            }
            setMessages([...updatedMessages, { role: 'model', content: fullText }]);
        } catch (err) {
            setMessages([
                ...updatedMessages,
                {
                    role: 'model',
                    content: `Notice: ${err.message || 'Failed to generate response. Please check your Gemini API Key.'}`,
                },
            ]);
        } finally {
            setChatLoading(false);
        }
    };

    // Generate Bio
    const handleGenerateBio = async () => {
        setBioLoading(true);
        try {
            const res = await aiService.generateProfileBio(portfolio?.profile, bioTone);
            setGeneratedBio(res);
        } catch (err) {
            alert(err.message || 'Failed to generate bio');
        } finally {
            setBioLoading(false);
        }
    };

    // Apply Bio to Profile
    const handleApplyBio = async () => {
        if (!generatedBio) return;
        setBioApplying(true);
        try {
            await api.updateProfile({
                ...(portfolio?.profile || {}),
                tagline: generatedBio.tagline,
                description: generatedBio.description,
            });
            onUpdated();
            alert('🎉 Profile tagline and bio updated successfully!');
        } catch (err) {
            alert(err.message || 'Failed to apply bio');
        } finally {
            setBioApplying(false);
        }
    };

    // Generate Project
    const handleGenerateProject = async () => {
        if (!projectIdea.trim()) {
            alert('Please enter a project title or concept keywords');
            return;
        }
        setProjectLoading(true);
        try {
            const res = await aiService.enhanceProject({
                title: projectIdea,
                category: projectCategory,
            });
            setGeneratedProject(res);
        } catch (err) {
            alert(err.message || 'Failed to generate project');
        } finally {
            setProjectLoading(false);
        }
    };

    // Apply Project
    const handleApplyProject = async () => {
        if (!generatedProject) return;
        setProjectApplying(true);
        try {
            await api.createProject({
                title: generatedProject.title,
                category: generatedProject.category,
                description: generatedProject.description,
                technologies: generatedProject.technologies,
                imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                githubUrl: 'https://github.com',
                order: (portfolio?.projects?.length || 0) + 1,
            });
            onUpdated();
            alert('🎉 Project created and added to Featured Projects!');
            setGeneratedProject(null);
            setProjectIdea('');
        } catch (err) {
            alert(err.message || 'Failed to save project');
        } finally {
            setProjectApplying(false);
        }
    };

    // Generate Achievement
    const handleGenerateAchievement = async () => {
        if (!achievementTitle.trim() && !achievementNotes.trim() && !achievementVisual) {
            alert('Please enter an achievement title, notes, or upload a visual certificate');
            return;
        }

        if (achievementVisual) {
            return handleScanAchievementVisual();
        }

        setAchievementLoading(true);
        try {
            const res = await aiService.enhanceAchievement({
                title: achievementTitle || 'Milestone Achievement',
                description: achievementNotes,
                date: '2025',
            });
            setGeneratedAchievement(res);
        } catch (err) {
            alert(err.message || 'Failed to magnify achievement');
        } finally {
            setAchievementLoading(false);
        }
    };

    // Scan & Analyze Achievement Visual with Gemini Vision
    const handleScanAchievementVisual = async () => {
        if (!achievementVisual) {
            alert('Please upload or select an achievement visual first');
            return;
        }
        setAchievementLoading(true);
        try {
            const res = await aiService.analyzeAchievementVisual(achievementVisual, {
                title: achievementTitle,
                description: achievementNotes,
            });
            setGeneratedAchievement(res);
            if (res.title && !achievementTitle) setAchievementTitle(res.title);
        } catch (err) {
            alert(err.message || 'Failed to analyze achievement visual');
        } finally {
            setAchievementLoading(false);
        }
    };

    // Apply Achievement
    const handleApplyAchievement = async () => {
        if (!generatedAchievement) return;
        setAchievementApplying(true);
        try {
            await api.createAchievement({
                title: generatedAchievement.title,
                category: generatedAchievement.category,
                description: generatedAchievement.description,
                date: generatedAchievement.date || '2025',
                imageUrl: achievementVisual || 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80',
                order: (portfolio?.achievements?.length || 0) + 1,
            });
            onUpdated();
            alert('🎉 Milestone created and added to Honors & Achievements!');
            setGeneratedAchievement(null);
            setAchievementTitle('');
            setAchievementNotes('');
            setAchievementVisual('');
        } catch (err) {
            alert(err.message || 'Failed to save achievement');
        } finally {
            setAchievementApplying(false);
        }
    };

    // Skills Studio Handlers
    const handleAnalyzeSkillsGapInStudio = async () => {
        setSkillsLoading(true);
        try {
            const res = await aiService.analyzeSkillsGap(portfolio?.skills || []);
            setSkillsGapList(res || []);
        } catch (err) {
            alert(err.message || 'Skills analysis failed');
        } finally {
            setSkillsLoading(false);
        }
    };

    const handleAddSkillFromStudio = async (skillItem) => {
        try {
            await api.createSkill({
                name: skillItem.name,
                category: skillItem.category || 'Specialized Frontier AI',
                proficiency: skillItem.proficiency || 95,
                iconName: skillItem.iconName || 'Gemini',
                description: skillItem.description || '',
                order: (portfolio?.skills?.length || 0) + 1,
            });
            onUpdated();
            setSkillsGapList(prev => prev.filter(s => s.name !== skillItem.name));
            alert(`🎉 Added ${skillItem.name} to Skills & Tech Stack!`);
        } catch (e) {
            alert(e.message || 'Failed to add skill');
        }
    };

    // Hobbies Studio Handlers
    const handleGenerateHobbyInStudio = async () => {
        if (!hobbyName.trim() && !hobbyDescription.trim() && !hobbyVisual) {
            alert('Please enter a hobby name or upload a photo');
            return;
        }
        if (hobbyVisual) {
            return handleScanHobbyVisualInStudio();
        }
        setHobbyLoading(true);
        try {
            const res = await aiService.enhanceHobby({ name: hobbyName, description: hobbyDescription });
            setGeneratedHobby(res);
        } catch (e) {
            alert(e.message || 'Hobby generation failed');
        } finally {
            setHobbyLoading(false);
        }
    };

    const handleScanHobbyVisualInStudio = async () => {
        if (!hobbyVisual) {
            alert('Please upload a hobby image first');
            return;
        }
        setHobbyLoading(true);
        try {
            const res = await aiService.analyzeHobbyVisual(hobbyVisual, { name: hobbyName, description: hobbyDescription });
            setGeneratedHobby(res);
            if (res.name && !hobbyName) setHobbyName(res.name);
        } catch (e) {
            alert(e.message || 'Visual analysis failed');
        } finally {
            setHobbyLoading(false);
        }
    };

    const handleApplyHobbyInStudio = async () => {
        if (!generatedHobby) return;
        setHobbyApplying(true);
        try {
            await api.createHobby({
                name: generatedHobby.name,
                description: generatedHobby.description,
                iconName: generatedHobby.iconName || 'Heart',
                imageUrl: hobbyVisual || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
                order: (portfolio?.hobbies?.length || 0) + 1,
            });
            onUpdated();
            alert('🎉 Added to Hobbies & Interests!');
            setGeneratedHobby(null);
            setHobbyName('');
            setHobbyDescription('');
            setHobbyVisual('');
        } catch (e) {
            alert(e.message || 'Failed to save hobby');
        } finally {
            setHobbyApplying(false);
        }
    };

    // Inquiries Studio Handlers
    const handleDraftInquiryReplyInStudio = async () => {
        if (!selectedInquiry) {
            alert('Please select an inquiry to reply to');
            return;
        }
        setDraftLoading(true);
        try {
            const res = await aiService.draftInquiryReply(
                selectedInquiry.name,
                selectedInquiry.email,
                selectedInquiry.message,
                draftTone
            );
            setInquiryDraft(res);
        } catch (e) {
            alert(e.message || 'Failed to draft reply');
        } finally {
            setDraftLoading(false);
        }
    };

    // Run Full Audit
    const handleRunAudit = async () => {
        setAuditLoading(true);
        try {
            const res = await aiService.auditPortfolio(portfolio);
            setAuditResult(res);
        } catch (err) {
            alert(err.message || 'Audit failed');
        } finally {
            setAuditLoading(false);
        }
    };

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header with Engine Status & Key Modal Trigger */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-devyellow-400 to-devorange-500 flex items-center justify-center shadow-warm-sm">
                            <Sparkles className="w-4 h-4 text-charcoal-900" />
                        </div>
                        <h2 className="text-2xl font-black text-charcoal-900">AI Studio & Copilot</h2>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-devyellow-100 text-devorange-600 border border-devyellow-300">
                            Gemini 3.6 Flash
                        </span>
                    </div>
                    <p className="text-xs text-charcoal-500 mt-1">
                        Generative intelligence to craft high-impact portfolio copy, brainstorm projects, and audit presentation.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>Live Sync: Active</span>
                    </div>

                    <button
                        onClick={() => setShowKeyModal(true)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                            hasKey
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-devyellow-50 text-devorange-700 border-devyellow-300 hover:bg-devyellow-100 animate-pulse'
                        }`}
                    >
                        <Key className="w-3.5 h-3.5" />
                        <span>{hasKey ? 'Gemini API: Connected' : 'Configure Gemini API'}</span>
                    </button>
                </div>
            </div>

            {/* Navigation Tabs for AI Studio Tools (All 6 Portfolio Modules) */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-sm">
                <button
                    onClick={() => setActiveTool('chat')}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                        activeTool === 'chat'
                            ? 'bg-charcoal-900 text-white shadow-sm'
                            : 'text-charcoal-600 hover:bg-gray-100'
                    }`}
                >
                    <Bot className="w-3.5 h-3.5 text-devyellow-400" />
                    <span>Copilot Chat</span>
                </button>
                <button
                    onClick={() => setActiveTool('bio')}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                        activeTool === 'bio'
                            ? 'bg-charcoal-900 text-white shadow-sm'
                            : 'text-charcoal-600 hover:bg-gray-100'
                    }`}
                >
                    <User className="w-3.5 h-3.5 text-devyellow-400" />
                    <span>Profile & Bio</span>
                </button>
                <button
                    onClick={() => {
                        setActiveTool('skills');
                        if (skillsGapList.length === 0) handleAnalyzeSkillsGapInStudio();
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                        activeTool === 'skills'
                            ? 'bg-charcoal-900 text-white shadow-sm'
                            : 'text-charcoal-600 hover:bg-gray-100'
                    }`}
                >
                    <Wrench className="w-3.5 h-3.5 text-devyellow-400" />
                    <span>Skills & Tech</span>
                </button>
                <button
                    onClick={() => setActiveTool('project')}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                        activeTool === 'project'
                            ? 'bg-charcoal-900 text-white shadow-sm'
                            : 'text-charcoal-600 hover:bg-gray-100'
                    }`}
                >
                    <Lightbulb className="w-3.5 h-3.5 text-devyellow-400" />
                    <span>Projects</span>
                </button>
                <button
                    onClick={() => setActiveTool('achievement')}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                        activeTool === 'achievement'
                            ? 'bg-charcoal-900 text-white shadow-sm'
                            : 'text-charcoal-600 hover:bg-gray-100'
                    }`}
                >
                    <Award className="w-3.5 h-3.5 text-devyellow-400" />
                    <span>Milestones & Vision</span>
                </button>
                <button
                    onClick={() => setActiveTool('hobbies')}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                        activeTool === 'hobbies'
                            ? 'bg-charcoal-900 text-white shadow-sm'
                            : 'text-charcoal-600 hover:bg-gray-100'
                    }`}
                >
                    <Heart className="w-3.5 h-3.5 text-devyellow-400" />
                    <span>Hobbies & Vibe</span>
                </button>
                <button
                    onClick={() => setActiveTool('inquiries')}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                        activeTool === 'inquiries'
                            ? 'bg-charcoal-900 text-white shadow-sm'
                            : 'text-charcoal-600 hover:bg-gray-100'
                    }`}
                >
                    <Mail className="w-3.5 h-3.5 text-devyellow-400" />
                    <span>Inquiries AI</span>
                </button>
                <button
                    onClick={() => {
                        setActiveTool('audit');
                        if (!auditResult) handleRunAudit();
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                        activeTool === 'audit'
                            ? 'bg-charcoal-900 text-white shadow-sm'
                            : 'text-charcoal-600 hover:bg-gray-100'
                    }`}
                >
                    <BarChart3 className="w-3.5 h-3.5 text-devyellow-400" />
                    <span>360° Audit</span>
                </button>
            </div>

            {/* TAB 1: Conversational Copilot Chat */}
            {activeTool === 'chat' && (
                <div className="bg-white rounded-3xl border border-gray-200/80 shadow-warm-md flex flex-col h-[600px] overflow-hidden">
                    {/* Chat Messages */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-3 max-w-2xl ${
                                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                                }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-extrabold ${
                                        msg.role === 'user'
                                            ? 'bg-devorange-600 text-white'
                                            : 'bg-charcoal-900 text-devyellow-400'
                                    }`}
                                >
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                </div>
                                <div
                                    className={`p-4 rounded-2xl text-xs leading-relaxed transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                                        msg.role === 'user'
                                            ? 'bg-devorange-600 text-white rounded-tr-none shadow-sm'
                                            : 'bg-gray-50 border border-gray-200/80 text-charcoal-800 rounded-tl-none shadow-xs'
                                    }`}
                                >
                                    {msg.role === 'model' ? (
                                        <FormattedMessage content={msg.content} />
                                    ) : (
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                    )}
                                    {msg.role === 'model' && (
                                        <div className="mt-2 pt-2 border-t border-gray-200/60 flex justify-end">
                                            <button
                                                onClick={() => copyToClipboard(msg.content, idx)}
                                                className="text-[10px] text-charcoal-400 hover:text-charcoal-700 flex items-center gap-1"
                                            >
                                                {copiedIndex === idx ? (
                                                    <>
                                                        <Check className="w-3 h-3 text-emerald-600" /> Copied
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3" /> Copy
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="flex gap-3 max-w-xl">
                                <div className="w-8 h-8 rounded-xl bg-charcoal-900 text-devyellow-400 flex items-center justify-center">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                </div>
                                <div className="p-4 bg-gray-50 border border-gray-200/80 rounded-2xl rounded-tl-none text-xs text-charcoal-500 flex items-center gap-2">
                                    <span>Gemini is thinking and drafting response...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestion Pills */}
                    <div className="px-6 py-2 bg-gray-50/70 border-t border-gray-100 flex items-center gap-2 overflow-x-auto text-[11px]">
                        <span className="text-charcoal-400 font-bold shrink-0">Quick prompts:</span>
                        {[
                            '👤 Rewrite my bio to sound like a visionary AI engineer',
                            '🛠️ Audit my skills and suggest missing 2026 tech',
                            '🏆 Read and analyze my achievement certificate visual',
                            '💡 Give me a viral AI project concept with tech architecture',
                            '🎨 Polish my creative hobbies to showcase unique personality',
                            '✉️ Help me draft a high-converting client inquiry reply',
                        ].map((promptText, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setChatInput(promptText);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-charcoal-700 hover:border-devorange-400 hover:text-devorange-600 shrink-0 transition-colors"
                            >
                                {promptText}
                            </button>
                        ))}
                    </div>

                    {/* Chat Input Bar */}
                    <form onSubmit={handleSendChat} className="p-4 bg-white border-t border-gray-200 flex items-center gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask DevJ AI Copilot anything about your portfolio, projects, or client replies..."
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-devorange-500 text-xs text-charcoal-900"
                        />
                        <button
                            type="submit"
                            disabled={!chatInput.trim() || chatLoading}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-devyellow-400 to-devorange-500 text-charcoal-900 font-bold text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
                        >
                            <span>Send</span>
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </form>
                </div>
            )}

            {/* TAB 2: Bio & Tagline Crafter */}
            {activeTool === 'bio' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-charcoal-900 font-extrabold text-sm">
                            <Wand2 className="w-4 h-4 text-devorange-500" />
                            <span>Bio Polish Parameters</span>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-charcoal-700 mb-1">Tone & Persona</label>
                            <select
                                value={bioTone}
                                onChange={(e) => setBioTone(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-devorange-500"
                            >
                                <option value="innovative and visionary">Innovative & Visionary AI Engineer</option>
                                <option value="concise and punchy">Concise, Punchy & Minimalist</option>
                                <option value="technical and deep systems architect">Technical & Deep Systems Architect</option>
                                <option value="founder, builder and creative designer">Founder & Creative Product Builder</option>
                            </select>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl space-y-2 border border-gray-100 text-xs">
                            <div className="font-bold text-charcoal-700">Current Profile Data:</div>
                            <p className="text-charcoal-500 italic">"{portfolio?.profile?.tagline || 'No tagline set'}"</p>
                        </div>

                        <button
                            onClick={handleGenerateBio}
                            disabled={bioLoading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-devyellow-400 via-devorange-400 to-devorange-500 text-charcoal-900 font-extrabold text-xs shadow-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {bioLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            <span>Generate AI Bio & Tagline</span>
                        </button>
                    </div>

                    <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
                        <h3 className="font-extrabold text-sm text-charcoal-900 mb-4 flex items-center justify-between">
                            <span>Generated Result</span>
                            {generatedBio && (
                                <button
                                    onClick={handleApplyBio}
                                    disabled={bioApplying}
                                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                                >
                                    {bioApplying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                    <span>1-Click Apply to Profile</span>
                                </button>
                            )}
                        </h3>

                        {generatedBio ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-devyellow-50/60 border border-devyellow-200 rounded-2xl">
                                    <span className="text-[10px] uppercase font-black tracking-wider text-devorange-600">
                                        Generated Tagline
                                    </span>
                                    <p className="text-sm font-bold text-charcoal-900 mt-1">{generatedBio.tagline}</p>
                                </div>

                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                                    <span className="text-[10px] uppercase font-black tracking-wider text-charcoal-500">
                                        Generated Description / Bio
                                    </span>
                                    <p className="text-xs text-charcoal-800 mt-1 leading-relaxed">{generatedBio.description}</p>
                                </div>

                                {generatedBio.highlights && (
                                    <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                                        <span className="text-[10px] uppercase font-black tracking-wider text-charcoal-400">
                                            Key Strengths
                                        </span>
                                        <ul className="mt-2 space-y-1.5 text-xs text-charcoal-700">
                                            {generatedBio.highlights.map((h, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-devorange-500" />
                                                    <span>{h}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-charcoal-400 border border-dashed border-gray-200 rounded-2xl">
                                <Wand2 className="w-8 h-8 text-devyellow-500 mb-2 opacity-50" />
                                <p className="text-xs font-semibold">Select a tone and click "Generate AI Bio" to preview suggestions.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 3: Project Ideator & Spec Generator */}
            {activeTool === 'project' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-charcoal-900 font-extrabold text-sm">
                            <Lightbulb className="w-4 h-4 text-devyellow-500" />
                            <span>Project Concept & Idea</span>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-charcoal-700 mb-1">Project Concept / Keyword</label>
                            <input
                                type="text"
                                value={projectIdea}
                                onChange={(e) => setProjectIdea(e.target.value)}
                                placeholder="e.g. Autonomous Multimodal Voice Coding Agent"
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-devorange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-charcoal-700 mb-1">Category</label>
                            <select
                                value={projectCategory}
                                onChange={(e) => setProjectCategory(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-devorange-500"
                            >
                                <option value="Generative AI Platform">Generative AI Platform</option>
                                <option value="Creative Full-Stack">Creative Full-Stack</option>
                                <option value="Interactive UI & 3D">Interactive UI & 3D</option>
                                <option value="Autonomous Agent Suite">Autonomous Agent Suite</option>
                                <option value="Cloud Edge Architecture">Cloud Edge Architecture</option>
                            </select>
                        </div>

                        <button
                            onClick={handleGenerateProject}
                            disabled={projectLoading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-devyellow-400 via-devorange-400 to-devorange-500 text-charcoal-900 font-extrabold text-xs shadow-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {projectLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            <span>Generate Project Architecture & Copy</span>
                        </button>
                    </div>

                    <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
                        <h3 className="font-extrabold text-sm text-charcoal-900 mb-4 flex items-center justify-between">
                            <span>Project Specification</span>
                            {generatedProject && (
                                <button
                                    onClick={handleApplyProject}
                                    disabled={projectApplying}
                                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                                >
                                    {projectApplying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                    <span>1-Click Add to Projects</span>
                                </button>
                            )}
                        </h3>

                        {generatedProject ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-md bg-devyellow-100 text-devorange-600 text-[10px] font-black uppercase">
                                            {generatedProject.category}
                                        </span>
                                    </div>
                                    <h4 className="text-base font-black text-charcoal-900">{generatedProject.title}</h4>
                                </div>

                                <div className="p-4 bg-white border border-gray-200 rounded-2xl">
                                    <span className="text-[10px] uppercase font-black tracking-wider text-charcoal-400">
                                        Description & Narrative
                                    </span>
                                    <p className="text-xs text-charcoal-800 mt-1 leading-relaxed">{generatedProject.description}</p>
                                </div>

                                <div className="p-4 bg-devyellow-50/50 border border-devyellow-200 rounded-2xl">
                                    <span className="text-[10px] uppercase font-black tracking-wider text-devorange-600">
                                        Recommended Tech Stack
                                    </span>
                                    <p className="text-xs font-bold text-charcoal-900 mt-1">{generatedProject.technologies}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-charcoal-400 border border-dashed border-gray-200 rounded-2xl">
                                <Lightbulb className="w-8 h-8 text-devorange-400 mb-2 opacity-50" />
                                <p className="text-xs font-semibold">Enter a project concept and let Gemini draft the complete overview & tech stack.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 4: Milestone Magnifier & Visual Scanner */}
            {activeTool === 'achievement' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-charcoal-900 font-extrabold text-sm">
                                <Award className="w-4 h-4 text-devorange-600" />
                                <span>Milestone & Certificate Visual</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-devyellow-100 text-devorange-700 text-[10px] font-black uppercase">
                                Gemini Vision
                            </span>
                        </div>

                        {/* Visual Image Uploader */}
                        <ImageUploader
                            label="Certificate / Trophy / Award Visual"
                            currentImage={achievementVisual}
                            onImageUploaded={(url) => setAchievementVisual(url)}
                        />

                        {/* Existing Portfolio Visual Selector */}
                        {portfolio?.achievements?.length > 0 && !achievementVisual && (
                            <div className="pt-1">
                                <label className="block text-[11px] font-bold text-charcoal-500 mb-1.5">
                                    Or pick an existing portfolio achievement to inspect:
                                </label>
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {portfolio.achievements.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => {
                                                setAchievementVisual(item.imageUrl || '');
                                                setAchievementTitle(item.title || '');
                                                setAchievementNotes(item.description || '');
                                            }}
                                            className="px-2.5 py-1.5 rounded-xl border border-gray-200 hover:border-devorange-400 bg-gray-50 text-[11px] font-bold text-charcoal-800 shrink-0 flex items-center gap-1.5 transition-all"
                                        >
                                            <ImageIcon className="w-3 h-3 text-devorange-500" />
                                            <span className="max-w-[120px] truncate">{item.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-charcoal-700 mb-1">
                                Title (Optional if visual is uploaded)
                            </label>
                            <input
                                type="text"
                                value={achievementTitle}
                                onChange={(e) => setAchievementTitle(e.target.value)}
                                placeholder="e.g. Winner at Hackathon 2025"
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-devorange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-charcoal-700 mb-1">
                                Additional Notes or Context (Optional)
                            </label>
                            <textarea
                                rows={2}
                                value={achievementNotes}
                                onChange={(e) => setAchievementNotes(e.target.value)}
                                placeholder="e.g. Built an AI app with computer vision, judged best technical architecture out of 50 teams"
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-devorange-500 resize-none"
                            />
                        </div>

                        {achievementVisual ? (
                            <button
                                onClick={handleScanAchievementVisual}
                                disabled={achievementLoading}
                                className="w-full py-3 rounded-xl bg-charcoal-900 text-devyellow-400 font-extrabold text-xs shadow-sm hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {achievementLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                                <span>{achievementLoading ? 'Gemini Reading Visual...' : '👁️ Read & Analyze Visual with Gemini Vision'}</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleGenerateAchievement}
                                disabled={achievementLoading}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-devyellow-400 via-devorange-400 to-devorange-500 text-charcoal-900 font-extrabold text-xs shadow-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {achievementLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                <span>Magnify Milestone Impact</span>
                            </button>
                        )}
                    </div>

                    <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
                        <h3 className="font-extrabold text-sm text-charcoal-900 mb-4 flex items-center justify-between">
                            <span>High-Impact Milestone Copy & Vision Verification</span>
                            {generatedAchievement && (
                                <button
                                    onClick={handleApplyAchievement}
                                    disabled={achievementApplying}
                                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                                >
                                    {achievementApplying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                    <span>1-Click Add to Achievements</span>
                                </button>
                            )}
                        </h3>

                        {generatedAchievement ? (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                {achievementVisual && (
                                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 h-36 bg-charcoal-900">
                                        <img
                                            src={achievementVisual}
                                            alt="Certificate Visual"
                                            className="w-full h-full object-cover opacity-80"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/40 to-transparent p-3 flex flex-col justify-end">
                                            <span className="text-[10px] text-devyellow-400 font-bold flex items-center gap-1">
                                                <Eye className="w-3.5 h-3.5" /> Visual Certificate Verified
                                            </span>
                                            {generatedAchievement.issuer && (
                                                <p className="text-xs text-white font-extrabold truncate">
                                                    Issued by: {generatedAchievement.issuer}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 bg-devorange-50/50 border border-devorange-200 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2.5 py-0.5 rounded-md bg-devorange-600 text-white text-[10px] font-black uppercase">
                                            {generatedAchievement.category}
                                        </span>
                                        <span className="text-xs font-bold text-charcoal-500">{generatedAchievement.date}</span>
                                    </div>
                                    <h4 className="text-base font-black text-charcoal-900">{generatedAchievement.title}</h4>
                                </div>

                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                                    <span className="text-[10px] uppercase font-black tracking-wider text-charcoal-400">
                                        Prestigious Portfolio Narrative
                                    </span>
                                    <p className="text-xs text-charcoal-800 mt-1 leading-relaxed">{generatedAchievement.description}</p>
                                </div>

                                {generatedAchievement.extractedText && (
                                    <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-2xl">
                                        <span className="text-[10px] uppercase font-black tracking-wider text-amber-800 flex items-center gap-1">
                                            <FileText className="w-3 h-3 text-amber-600" /> Extracted Visual Text (OCR)
                                        </span>
                                        <p className="text-[11px] text-charcoal-700 mt-1 font-mono italic">
                                            "{generatedAchievement.extractedText}"
                                        </p>
                                    </div>
                                )}

                                {generatedAchievement.visualHighlights?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {generatedAchievement.visualHighlights.map((hl, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-[10px] font-bold flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {hl}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-charcoal-400 border border-dashed border-gray-200 rounded-2xl">
                                <Award className="w-8 h-8 text-devyellow-500 mb-2 opacity-50" />
                                <p className="text-xs font-semibold">Upload an achievement certificate/visual or enter notes to analyze and magnify.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB: Skills & 2026 Tech Stack Gap Analyzer */}
            {activeTool === 'skills' && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-black text-charcoal-900">Skills & 2026 Tech Stack Analyzer</h3>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-devyellow-100 text-devorange-700">
                                    {portfolio?.skills?.length || 0} Current Skills
                                </span>
                            </div>
                            <p className="text-xs text-charcoal-500 mt-0.5">
                                Detect market gaps and discover cutting-edge tools in AI, Cloud, and Web Engineering to elevate your hireability.
                            </p>
                        </div>
                        <button
                            onClick={handleAnalyzeSkillsGapInStudio}
                            disabled={skillsLoading}
                            className="px-4 py-2.5 rounded-xl bg-charcoal-900 hover:bg-black text-devyellow-400 font-bold text-xs flex items-center gap-2 transition-all shrink-0 shadow-warm-sm"
                        >
                            {skillsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-devyellow-400" />}
                            <span>{skillsLoading ? 'Analyzing 2026 Stack...' : '✨ Run Tech Gap Scan'}</span>
                        </button>
                    </div>

                    {skillsLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center space-y-3">
                            <Loader2 className="w-8 h-8 animate-spin text-devorange-600" />
                            <p className="text-xs font-bold text-charcoal-600">Cross-referencing your stack with 2026 market demand...</p>
                        </div>
                    ) : skillsGapList.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-charcoal-900 flex items-center gap-1.5">
                                    <Lightbulb className="w-4 h-4 text-devyellow-500 fill-devyellow-400" />
                                    Recommended Tech to Add to Your Portfolio:
                                </span>
                                <span className="text-[11px] text-charcoal-400 font-medium">Click to add directly</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {skillsGapList.map((s, idx) => (
                                    <div
                                        key={idx}
                                        className="p-5 bg-gradient-to-br from-white to-devyellow-50/40 rounded-2xl border border-devyellow-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-warm-sm transition-all"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <span className="px-2 py-0.5 rounded-md bg-devyellow-200 text-charcoal-900 text-[10px] font-black uppercase">
                                                    {s.category}
                                                </span>
                                                <span className="text-xs font-extrabold text-devorange-600">{s.proficiency}%</span>
                                            </div>
                                            <h4 className="text-sm font-black text-charcoal-900 mt-2">{s.name}</h4>
                                            <p className="text-xs text-charcoal-600 mt-1 line-clamp-3 leading-relaxed">
                                                {s.reason || s.description}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleAddSkillFromStudio(s)}
                                            className="w-full py-2 rounded-xl bg-charcoal-900 text-devyellow-400 text-xs font-extrabold flex items-center justify-center gap-1.5 hover:bg-black transition-all shadow-xs"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> 1-Click Add to Stack
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 bg-devyellow-50/50 rounded-2xl border border-devyellow-200/70 text-center space-y-3">
                            <Wrench className="w-8 h-8 text-devorange-500 mx-auto" />
                            <h4 className="font-bold text-charcoal-900 text-sm">Ready to analyze your tech stack</h4>
                            <p className="text-xs text-charcoal-500 max-w-md mx-auto">
                                Click <strong>Run Tech Gap Scan</strong> to have Gemini inspect your current tools and recommend high-demand 2026 competencies.
                            </p>
                            <button
                                onClick={handleAnalyzeSkillsGapInStudio}
                                className="px-4 py-2 rounded-xl bg-devyellow-400 hover:bg-devyellow-500 text-charcoal-900 text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm"
                            >
                                <Sparkles className="w-3.5 h-3.5" /> Scan Now
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* TAB: Hobbies & Creative Vibe Builder */}
            {activeTool === 'hobbies' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Hobby Generator Form */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-5">
                        <div className="border-b border-gray-100 pb-3">
                            <h3 className="text-lg font-black text-charcoal-900">Hobbies & Creative Vibe Builder</h3>
                            <p className="text-xs text-charcoal-500">
                                Showcase personal pursuits, photography, and creative interests to add warmth and authentic character.
                            </p>
                        </div>

                        <ImageUploader
                            label="Hobby Image Visual (Photography, Art, Setup)"
                            currentImage={hobbyVisual}
                            onImageUploaded={(url) => setHobbyVisual(url)}
                        />

                        <div>
                            <label className="block text-xs font-bold text-charcoal-800 mb-1.5">Hobby Name / Interest</label>
                            <input
                                type="text"
                                value={hobbyName}
                                onChange={(e) => setHobbyName(e.target.value)}
                                placeholder="e.g. Street Photography, Generative Music, Mechanical Keyboards"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-devorange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-charcoal-800 mb-1.5">Rough Notes / Details (Optional)</label>
                            <textarea
                                rows={3}
                                value={hobbyDescription}
                                onChange={(e) => setHobbyDescription(e.target.value)}
                                placeholder="What you love about it, gear used, or what it teaches you about creativity..."
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-devorange-500"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                            {hobbyVisual && (
                                <button
                                    type="button"
                                    onClick={handleScanHobbyVisualInStudio}
                                    disabled={hobbyLoading}
                                    className="flex-1 py-2.5 rounded-xl bg-charcoal-900 hover:bg-black text-devyellow-400 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-warm-sm"
                                >
                                    {hobbyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                                    <span>Scan Photo with Vision</span>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleGenerateHobbyInStudio}
                                disabled={hobbyLoading}
                                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-devyellow-400 to-devorange-400 text-charcoal-900 font-extrabold text-xs flex items-center justify-center gap-1.5 hover:from-devyellow-500 hover:to-devorange-500 transition-all shadow-warm-sm"
                            >
                                {hobbyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                <span>{hobbyLoading ? 'Crafting Vibe...' : '✨ Polish & Generate Vibe'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Right: Generated Hobby Preview Card */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <h4 className="text-sm font-black text-charcoal-900 flex items-center gap-1.5">
                                    <Heart className="w-4 h-4 text-devorange-500" />
                                    <span>Creative Showcase Card</span>
                                </h4>
                                {generatedHobby && (
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                                        Ready
                                    </span>
                                )}
                            </div>

                            {generatedHobby ? (
                                <div className="space-y-4">
                                    {hobbyVisual && (
                                        <div className="relative rounded-2xl overflow-hidden aspect-video border border-gray-200 shadow-xs">
                                            <img
                                                src={hobbyVisual}
                                                alt="Hobby Visual"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="p-4 bg-devyellow-50/60 border border-devyellow-200 rounded-2xl">
                                        <span className="text-[10px] uppercase font-black tracking-wider text-devorange-600">
                                            Hobby Title
                                        </span>
                                        <h4 className="text-base font-black text-charcoal-900 mt-0.5">{generatedHobby.name}</h4>
                                    </div>

                                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                                        <span className="text-[10px] uppercase font-black tracking-wider text-charcoal-400">
                                            Engaging Persona Copy
                                        </span>
                                        <p className="text-xs text-charcoal-800 mt-1 leading-relaxed">
                                            {generatedHobby.description}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-20 text-center space-y-2">
                                    <Heart className="w-10 h-10 text-gray-300 mx-auto" />
                                    <p className="text-xs font-bold text-charcoal-400">Enter a hobby or upload an image to preview</p>
                                </div>
                            )}
                        </div>

                        {generatedHobby && (
                            <button
                                onClick={handleApplyHobbyInStudio}
                                disabled={hobbyApplying}
                                className="w-full mt-6 py-3 rounded-2xl bg-charcoal-900 hover:bg-black text-devyellow-400 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-warm-md"
                            >
                                {hobbyApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                <span>1-Click Add to Hobbies & Interests</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* TAB: Client Inquiries & AI Auto-Responder */}
            {activeTool === 'inquiries' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Inquiries List */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div>
                                <h3 className="text-lg font-black text-charcoal-900">Client Inquiries & Messages</h3>
                                <p className="text-xs text-charcoal-500">Select an inquiry to generate a high-converting response.</p>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-devyellow-100 text-devorange-700">
                                {inquiries.length} Messages
                            </span>
                        </div>

                        {inquiriesLoading ? (
                            <div className="py-12 flex justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-devorange-500" />
                            </div>
                        ) : inquiries.length > 0 ? (
                            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                                {inquiries.map((inq) => {
                                    const isSelected = selectedInquiry?.id === inq.id;
                                    return (
                                        <button
                                            key={inq.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedInquiry(inq);
                                                setInquiryDraft('');
                                            }}
                                            className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                                isSelected
                                                    ? 'border-devorange-500 bg-devyellow-50/60 shadow-xs'
                                                    : 'border-gray-200 hover:border-devorange-300 bg-gray-50/50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black text-charcoal-900">{inq.name}</span>
                                                <span className="text-[10px] text-charcoal-400 font-mono">
                                                    {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'Recent'}
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-devorange-700 font-semibold block mt-0.5">{inq.email}</span>
                                            <p className="text-xs text-charcoal-600 line-clamp-2 mt-1.5">{inq.message}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-16 text-center space-y-2">
                                <Mail className="w-8 h-8 text-gray-300 mx-auto" />
                                <p className="text-xs font-bold text-charcoal-400">No contact messages received yet</p>
                            </div>
                        )}
                    </div>

                    {/* Right: AI Reply Lab */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <h4 className="text-sm font-black text-charcoal-900 flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-devyellow-500 fill-devyellow-400" />
                                    <span>AI Reply Generator</span>
                                </h4>
                                {selectedInquiry && (
                                    <span className="text-xs font-extrabold text-charcoal-600 truncate max-w-[150px]">
                                        To: {selectedInquiry.name}
                                    </span>
                                )}
                            </div>

                            {selectedInquiry ? (
                                <div className="space-y-3">
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl">
                                        <span className="text-[10px] uppercase font-black text-charcoal-400">Selected Client Message</span>
                                        <p className="text-xs text-charcoal-800 mt-1 italic font-serif">"{selectedInquiry.message}"</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="text-xs font-bold text-charcoal-700 shrink-0">Tone:</label>
                                        <div className="grid grid-cols-3 gap-1.5 w-full">
                                            {['warm and professional', 'technical and direct', 'enthusiastic and creative'].map((t) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setDraftTone(t)}
                                                    className={`px-2 py-1.5 rounded-xl text-[10px] font-extrabold capitalize border transition-all ${
                                                        draftTone === t
                                                            ? 'bg-charcoal-900 text-devyellow-400 border-charcoal-900 shadow-xs'
                                                            : 'bg-white text-charcoal-600 border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {t.split(' ')[0]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleDraftInquiryReplyInStudio}
                                        disabled={draftLoading}
                                        className="w-full py-2.5 rounded-xl bg-devyellow-400 hover:bg-devyellow-500 text-charcoal-900 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                                    >
                                        {draftLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                        <span>{draftLoading ? 'Drafting with Gemini...' : '✨ Draft High-Converting Reply'}</span>
                                    </button>

                                    {inquiryDraft && (
                                        <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                                            <label className="text-[10px] uppercase font-black text-charcoal-400">Generated Email Reply</label>
                                            <textarea
                                                rows={7}
                                                value={inquiryDraft}
                                                onChange={(e) => setInquiryDraft(e.target.value)}
                                                className="w-full p-3 rounded-2xl border border-devyellow-300 bg-white text-xs text-charcoal-900 font-mono leading-relaxed focus:outline-none focus:border-devorange-500 shadow-xs"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="py-20 text-center space-y-2">
                                    <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
                                    <p className="text-xs font-bold text-charcoal-400">Select an inquiry from the left to draft a reply</p>
                                </div>
                            )}
                        </div>

                        {inquiryDraft && selectedInquiry && (
                            <div className="flex gap-2 pt-3 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(inquiryDraft);
                                        alert('Copied reply to clipboard!');
                                    }}
                                    className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-charcoal-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                                >
                                    <Copy className="w-3.5 h-3.5" /> Copy Reply
                                </button>
                                <a
                                    href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
                                        `Re: Portfolio Inquiry from ${selectedInquiry.name}`
                                    )}&body=${encodeURIComponent(inquiryDraft)}`}
                                    className="flex-1 py-2.5 rounded-xl bg-charcoal-900 hover:bg-black text-devyellow-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                                >
                                    <Mail className="w-3.5 h-3.5" /> Open in Email Client
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB: Portfolio AI Audit */}
            {activeTool === 'audit' && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-black text-charcoal-900">Portfolio AI Quality & SEO Score</h3>
                            <p className="text-xs text-charcoal-500">Autonomous scan of your profile, projects, skills, and overall presentation.</p>
                        </div>
                        <button
                            onClick={handleRunAudit}
                            disabled={auditLoading}
                            className="px-4 py-2 rounded-xl bg-devyellow-100 hover:bg-devyellow-200 text-charcoal-900 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${auditLoading ? 'animate-spin' : ''}`} />
                            <span>Re-run Audit</span>
                        </button>
                    </div>

                    {auditLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center space-y-3">
                            <Loader2 className="w-8 h-8 animate-spin text-devorange-600" />
                            <p className="text-xs font-bold text-charcoal-600">Analyzing portfolio completeness and recruiter impact...</p>
                        </div>
                    ) : auditResult ? (
                        <div className="space-y-6">
                            {/* Score & Verdict Card */}
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 text-white flex flex-col sm:flex-row items-center gap-6 shadow-warm-md">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-devyellow-400 to-devorange-500 text-charcoal-900 font-black text-3xl flex flex-col items-center justify-center shrink-0 shadow-lg">
                                    <span>{auditResult.score}</span>
                                    <span className="text-[10px] font-extrabold uppercase -mt-1 tracking-wider">/ 100</span>
                                </div>
                                <div className="space-y-1.5 text-center sm:text-left">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-devyellow-400/20 text-devyellow-400 text-xs font-bold uppercase tracking-wider">
                                        <Sparkles className="w-3.5 h-3.5" /> AI Quality Verdict
                                    </div>
                                    <h4 className="text-base sm:text-lg font-bold">{auditResult.verdict}</h4>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Strengths */}
                                <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                                    <h4 className="font-extrabold text-sm text-emerald-900 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Strengths
                                    </h4>
                                    <ul className="space-y-2 text-xs text-emerald-950 font-medium">
                                        {auditResult.strengths?.map((str, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                                                <span>{str}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Actionable Improvements */}
                                <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                                    <h4 className="font-extrabold text-sm text-amber-900 flex items-center gap-2">
                                        <Lightbulb className="w-4 h-4 text-amber-600" /> Recommended Improvements
                                    </h4>
                                    <ul className="space-y-2 text-xs text-amber-950 font-medium">
                                        {auditResult.improvements?.map((imp, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <ArrowRight className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                                                <span>{imp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Recommended Technologies */}
                            {auditResult.recommendedTechs && (
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div>
                                        <span className="text-xs font-bold text-charcoal-900">Trending Technologies to Highlight:</span>
                                        <p className="text-[11px] text-charcoal-500">Adding these to your skills will increase keyword match for AI roles.</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {auditResult.recommendedTechs.map((tech, i) => (
                                            <span key={i} className="px-3 py-1 bg-white border border-gray-200 text-charcoal-800 text-xs font-bold rounded-lg shadow-sm">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            )}

            {/* API Key Modal */}
            {showKeyModal && (
                <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-devyellow-100 text-devorange-600 flex items-center justify-center">
                                    <Key className="w-4 h-4" />
                                </div>
                                <h3 className="font-extrabold text-charcoal-900 text-base">Gemini API Key</h3>
                            </div>
                            <button
                                onClick={() => setShowKeyModal(false)}
                                className="text-charcoal-400 hover:text-charcoal-700 text-xs font-bold p-1"
                            >
                                Close
                            </button>
                        </div>

                        <p className="text-xs text-charcoal-600 leading-relaxed">
                            To unlock real-time generative responses powered by <strong>Google Gemini 2.5 Flash</strong>, provide your Gemini API key.
                        </p>

                        <form onSubmit={handleSaveKey} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-charcoal-800 mb-1">API Key</label>
                                <input
                                    type="password"
                                    value={apiKeyInput}
                                    onChange={(e) => setApiKeyInput(e.target.value)}
                                    placeholder="AIzaSy..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-devorange-500 font-mono"
                                />
                            </div>

                            {keyStatus.success && (
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> API key validated and saved!
                                </div>
                            )}

                            {keyStatus.error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-600" /> {keyStatus.error}
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-2">
                                <a
                                    href="https://aistudio.google.com/app/apikey"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-devorange-600 hover:underline flex items-center gap-1 font-bold"
                                >
                                    <span>Get Free Key at Google AI Studio</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>

                                <button
                                    type="submit"
                                    disabled={keyTesting}
                                    className="px-5 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-devyellow-400 font-bold text-xs flex items-center gap-1.5 transition-all"
                                >
                                    {keyTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                    <span>Save & Test Key</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAssistantStudio;
