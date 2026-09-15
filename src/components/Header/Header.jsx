import styles from "./Header.module.css";
import { useNavigate, Link } from "react-router-dom"
import { useContext, useState } from "react"; 
import { AuthContext } from "../../context/authContext";

function Header() {
  const navigate = useNavigate(); 
  const { user, logout } = useContext(AuthContext); 
  const [ error, setError ] = useState(""); 

  const handleLogout = async() => {
    try {
      setError(""); 
        await logout(); 
        navigate("/"); 
    }  catch (err) {
        setError(err.response?.data?.error?.message || "Logout error"); 
    }
}; 

  return (
    <header className={styles.header}>
      <Link to="/dashboard" >
        <h2>WorkoutBudd</h2>
        <h2>||-||</h2>
      </Link>

      <div className={styles.userSection}>
        <span>{user ? user.name : "Profile"}</span>
        { error && <p className={styles.errorMessage}>{error}</p> }
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;