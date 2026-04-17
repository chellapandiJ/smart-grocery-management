import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && token !== 'undefined' && token !== 'null') {
            checkAuth();
        } else {
            setLoading(false);
            if (token) localStorage.removeItem('token');
        }
    }, []);

    const checkAuth = async () => {
        try {
            const res = await api.auth.getProfile();
            setUser(res.data);
        } catch (err) {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData, token) => {
        if (token && userData) {
            localStorage.setItem('token', token);
            setUser(userData);
        }
    };

    const registerUser = async (userData) => {
        try {
            await api.auth.register(userData);
            return true;
        } catch (err) {
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register: registerUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
