import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/public/HeroSection';
import SkillsSection from '../components/public/SkillsSection';
import AchievementsSection from '../components/public/AchievementsSection';
import ProjectsSection from '../components/public/ProjectsSection';
import HobbiesSection from '../components/public/HobbiesSection';
import ContactSection from '../components/public/ContactSection';
import { usePortfolio } from '../context/PortfolioContext';
import { Loader2 } from 'lucide-react';

export const HomePage = () => {
    const { portfolio, loading, error } = usePortfolio();

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-charcoal-900 text-devyellow-400 font-black text-xl flex items-center justify-center shadow-warm-md animate-bounce">
                    DV
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-devorange-600 uppercase tracking-widest">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading DevJ Portfolio...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-3">
                    <h2 className="text-xl font-bold text-red-600">Connection Error</h2>
                    <p className="text-xs text-charcoal-500">{error}</p>
                </div>
            </div>
        );
    }

    const { profile, skills, achievements, projects, hobbies } = portfolio;

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <HeroSection profile={profile} />
                <SkillsSection skills={skills} />
                <AchievementsSection achievements={achievements} />
                <ProjectsSection projects={projects} />
                <HobbiesSection hobbies={hobbies} />
                <ContactSection profile={profile} />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;