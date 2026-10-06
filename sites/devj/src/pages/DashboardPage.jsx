import React, { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AIAssistantStudio from '../components/admin/AIAssistantStudio';
import ProfileManager from '../components/admin/ProfileManager';
import SkillsManager from '../components/admin/SkillsManager';
import AchievementsManager from '../components/admin/AchievementsManager';
import ProjectsManager from '../components/admin/ProjectsManager';
import HobbiesManager from '../components/admin/HobbiesManager';
import MessagesManager from '../components/admin/MessagesManager';
import SecuritySettings from '../components/admin/SecuritySettings';
import { usePortfolio } from '../context/PortfolioContext';

export const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('ai');
    const { portfolio, refreshPortfolio } = usePortfolio();

    return (
        <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === 'ai' && (
                <AIAssistantStudio portfolio={portfolio} onUpdated={refreshPortfolio} />
            )}
            {activeTab === 'profile' && (
                <ProfileManager profile={portfolio.profile} onUpdated={refreshPortfolio} />
            )}
            {activeTab === 'skills' && (
                <SkillsManager skills={portfolio.skills} onUpdated={refreshPortfolio} />
            )}
            {activeTab === 'achievements' && (
                <AchievementsManager achievements={portfolio.achievements} onUpdated={refreshPortfolio} />
            )}
            {activeTab === 'projects' && (
                <ProjectsManager projects={portfolio.projects} onUpdated={refreshPortfolio} />
            )}
            {activeTab === 'hobbies' && (
                <HobbiesManager hobbies={portfolio.hobbies} onUpdated={refreshPortfolio} />
            )}
            {activeTab === 'messages' && <MessagesManager />}
            {activeTab === 'settings' && <SecuritySettings />}
        </AdminLayout>
    );
};

export default DashboardPage;