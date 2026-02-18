'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const checkAuth = async () => {
        try {
            const response = await api.getMe();
            setUser(response.data?.user ?? null);
            if (process.env.NODE_ENV !== 'production' && response.data?.user) {
                console.info('[Auth] Session restored for user:', response.data.user.email || response.data.user._id);
            }
        } catch (error) {
            // 401 from /auth/me simply means "not logged in" – don't log as error
            if (process.env.NODE_ENV !== 'production' && error?.status !== 401) {
                console.warn('[Auth] getMe failed:', error?.status, error?.message);
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            setIsLoggingOut(true);
            await api.logout();
            setUser(null);
            // Clear cached CSRF so next login gets a fresh token
            api.clearCsrfToken?.();
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('[Auth] Logout error:', error?.message || error);
            }
            setUser(null);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isLoggingOut, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
