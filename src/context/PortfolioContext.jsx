import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
    const [portfolio, setPortfolio] = useState({
        profile: {
            name: 'Julian Agustino',
            tagline: 'Artificial Intelligence Enthusiast, Vibe Developer and Creative Developer',
            description: 'I love turning ideas into interactive experiences and exploring the possibilities of artificial intelligence through creative development.',
            avatarUrl: '',
            email: 'contact@devj.com',
            githubUrl: 'https://github.com',
            facebookUrl: 'https://facebook.com',
            instagramUrl: 'https://instagram.com',
            telegramUrl: 'https://t.me/username',
            whatsappUrl: 'https://wa.me/1234567890'
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