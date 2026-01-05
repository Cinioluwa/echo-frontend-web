import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { userService } from "../api/services";
import type { User } from "../api/types";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    refreshUser: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        try {
            setLoading(true);
            setError(null);
            const userData = await userService.getMe();
            setUser(userData);
        } catch (err: any) {
            console.error("Error fetching user:", err);
            setError(err.response?.data?.error || "Failed to load user data");
            // If unauthorized, clear token
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const refreshUser = async () => {
        await fetchUser();
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    useEffect(() => {
        // Only fetch user if token exists
        const token = localStorage.getItem("token");
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error, refreshUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
