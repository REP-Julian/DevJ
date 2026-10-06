import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, getStoredPortfolio } from '../services/api';
import { initialPortfolioData } from '../data/portfolioData';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
    const [portfolio, setPortfolio] = useState(() => {
        try {
            const stored = typeof api.getStoredPortfolio === 'function' ? api.getStoredPortfolio() : getStoredPortfolio();
            if (stored?.profile) return stored;
        } catch (e) {
            console.warn('PortfolioProvider fallback:', e);
        }
        return initialPortfolioData;
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