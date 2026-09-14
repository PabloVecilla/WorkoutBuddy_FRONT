import { useEffect, useState, useCallback, useRef } from "react"; 
import { AuthContext } from "./authContext";
import apiClient from "../api/client";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); 
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(true); 
    
    // UseRef cancels req at dismount
    const isMounted = useRef(true);

    // 1. store fetchUser with useCallback to avoid changes on each render
    const fetchUser = useCallback(async () => {
        try {
            const response = await apiClient.get("/auth/me"); 
            
            if (isMounted.current) {
                setUser(response.data); 
                setError(""); 
            }
        } catch (err) {
            if (isMounted.current) {
                setError(err.response?.data?.error?.message || "Error getting User"); 
                setUser(null); 
            }
        } finally {
            if (isMounted.current) {
                setLoading(false); 
            }
        }
    }, []); // Keeps function stable

    // 2. fetchUser at component mount
    useEffect(() => {
        isMounted.current = true;
        fetchUser(); 

        // cleaning
        return () => {
            isMounted.current = false;
        };
    }, [fetchUser]);

    const login = async (credentials) => {
        setError(""); 
        try {
            const response = await apiClient.post("/auth/login", credentials); 
            setUser(response.data.data); 
            return response; 
        } catch (err) {
            const message = err.response?.data?.message || "Login failed"; 
            setError(message); 
            throw new Error(message); 
        }
    }; 

    const logout = async () => {
        try {
            await apiClient.post("/auth/logout"); 
            setUser(null); 
        } catch (err) {
            const message = err.response?.data?.error?.message || "Logout failed"; 
            setError(message); 
            throw new Error(message); 
        }
    }; 

    return (
        <AuthContext.Provider
          value={{
            user,
            error,
            loading,
            setError,
            login,
            logout,
            fetchUser // Al estar memorizada con useCallback, no romperá los componentes consumidores
          }}
        >
          {children}
        </AuthContext.Provider>
    ); 
}
