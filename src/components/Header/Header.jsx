import styles from "./Header.module.css";
import { useNavigate, Link } from "react-router-dom"
import { useContext, useEffect, useState } from "react"; 
import { AuthContext } from "../../context/authContext";

function Header() {
  const navigate = useNavigate(); 
  const { user, loading, logout } = useContext(AuthContext); 

  const handleLogout = async() => {
    try {
        await logout(); 
        navigate("/"); 
    }  catch (err) {
        console.error(err); 
    }
}; 

  return (
    <header className={styles.header}>
      <Link to="/dashboard" >
        <h2>WorkoutBudd</h2>
        <h2>||-||</h2>
      </Link>

      <div className={styles.userSection}>
        <span>{user ? user.data.name : "Profile"}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;