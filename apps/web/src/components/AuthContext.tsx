import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthChange, getIdToken } from '../lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    setIsAdmin: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAdmin: false,
    setIsAdmin: () => { }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthChange(async (user) => {
            setUser(user);

            // Check admin status by making a test request
            if (user) {
                try {
                    const token = await getIdToken();
                    if (token) {
                        const response = await fetch('/api/admin/tests', {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        setIsAdmin(response.ok);
                    }
                } catch {
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, setIsAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
