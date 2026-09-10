import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
    const [portfolio, setPortfolio] = useState({
        profile: {
            name: 'Julian Agustino',
            tagline: 'Full-Stack Developer & AI Systems Integrator',
            description: 'Building resilient full-stack web applications with React, Node.js, and Appwrite—engineering clean API architectures, responsive interfaces, and production-grade LLM integrations.',
            avatarUrl: '',
            email: 'agustino.julian@outlook.ph',
            githubUrl: 'https://github.com/REP-Julian',
            githubQrUrl: '',
            facebookUrl: 'https://facebook.com',
            facebookQrUrl: '',
            instagramUrl: 'https://instagram.com',
            instagramQrUrl: '',
            telegramUrl: 'https://t.me/username',
            telegramQrUrl: '',
            whatsappUrl: 'https://wa.me/1234567890',
            whatsappQrUrl: '',
            resumeUrl: ''
        },
        skills: [],
        achievements: [],
        projects: [],
        hobbies: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPortfolio = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.getPortfolio();
            setPortfolio(data);
            setError(null);
        } catch (err) {
            console.error('Context fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPortfolio();
    }, [fetchPortfolio]);

    return (
        <PortfolioContext.Provider value={{ portfolio, loading, error, refreshPortfolio: fetchPortfolio }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = () => useContext(PortfolioContext);