import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
    const [portfolio, setPortfolio] = useState(() => {
        const stored = api.getStoredPortfolio();
        if (stored?.profile) return stored;
        return {
            profile: {
                name: '',
                tagline: '',
                description: '',
                avatarUrl: '',
                email: '',
                githubUrl: '',
                githubQrUrl: '',
                facebookUrl: '',
                facebookQrUrl: '',
                instagramUrl: '',
                instagramQrUrl: '',
                telegramUrl: '',
                telegramQrUrl: '',
                whatsappUrl: '',
                whatsappQrUrl: '',
                resumeUrl: ''
            },
            skills: [],
            achievements: [],
            projects: [],
            hobbies: []
        };
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