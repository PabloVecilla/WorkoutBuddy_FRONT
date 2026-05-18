import { useEffect, useState } from "react"; 
import { AuthContext } from "./authContext";
import apiClient from "../api/client";

export function AuthProvider({ children }) {
    const [ user, setUser ] = useState(null); 
    const [ error, setError ] = useState(""); 
    const [ loading, setLoading ] = useState(true); 

    const fetchUser = async () => {

        try {
            const response = await apiClient.get("/auth/me"); 
            
            setUser(response.data.user); 
            setError(""); 

        } catch (err) {
            setUser(null); 
        } finally {
            setLoading(false); 
        }
    }; 
    useEffect(() => {
        fetchUser(); 
    }, []); 

   

    const login = async (credentials) => {
        setError(""); 

        try {
            const response = await apiClient.post("/auth/login", credentials); 

            setUser(response.data.user); 

            return response; 

        } catch (err) {
            const message = err.response?.data?.message || "Login failed"; 
            setError( message ); 
            throw new Error(message); 
        }
    }; 

    const logout = async () => {
        try {
            await apiClient.post("/auth/logout"); 

            setUser(null); 

        } catch (err) {
            const message = err.response?.data?.message || "Logout failed"; 
            setError( message ); 
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
            fetchUser
          }}
        >
          {children}
        </AuthContext.Provider>
      ); 
}