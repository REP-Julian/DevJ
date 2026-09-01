import React, { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import ProfileManager from '../components/admin/ProfileManager';
import SkillsManager from '../components/admin/SkillsManager';
import AchievementsManager from '../components/admin/AchievementsManager';
import ProjectsManager from '../components/admin/ProjectsManager';
import HobbiesManager from '../components/admin/HobbiesManager';
import MessagesManager from '../components/admin/MessagesManager';
import { usePortfolio } from '../context/PortfolioContext';

export const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { portfolio, refreshPortfolio } = usePortfolio();

    return (
        <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
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
        </AdminLayout>
    );
};

export default DashboardPage;