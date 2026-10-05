import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from "../../context/authContext"; 

const ProtectedRouteOutlet = () => {
    const { user, loading } = useContext(AuthContext); 

    if (loading) return <p>Loading...</p>; 

    if (!user) return <Navigate to="/" replace />;
    
    return  <Outlet />; 
};

export default ProtectedRouteOutlet; 