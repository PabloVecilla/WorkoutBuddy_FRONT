import styles from "./Header.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react"; 
import { AuthContext } from "../../context/authContext";

function Header() {
  const navigate = useNavigate(); 
  const { logout } = useContext(AuthContext); 
  const [ error, setError ] = useState(""); 
  const [ menuOpen, setMenuOpen ] = useState(false); // State for mobile menu toggle

  const handleLogout = async () => {
    try {
      setError(""); 
      await logout(); 
      navigate("/"); 
    } catch (err) {
      setError(err.response?.data?.error?.message || "Logout error"); 
    }
  }; 

  const handleNavigate = (path) => {
    setMenuOpen(false); // Close menu on navigation
    navigate(path);
  };

  useEffect(() => { // close menu on "esc" keyDown
    if (!menuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <Link to="/dashboard" className={styles.logoLink} onClick={() => setMenuOpen(false)}>
        <h2>WorkoutBuddy</h2>
        <h2>||-||</h2>
      </Link>

      {/* Burger Button - visible on small screens */}
      <button 
        className={styles.burgerBtn} 
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
      >
        <span className={styles.burgerBar}></span>
        <span className={styles.burgerBar}></span>
        <span className={styles.burgerBar}></span>
      </button>

      {/* Navigation Container - dynamically applies open class on mobile */}
      <div id="mobile-navigation" className={`${styles.navContent} ${menuOpen ? styles.navOpen : ""}`}>
        <button onClick={() => handleNavigate("/generate")}>+ Program</button> 

        <div className={styles.userSection}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </header>
  );
}

export default Header;