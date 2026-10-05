import { useContext } from "react"; 
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/authContext";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); 

    return (
        <main className={ styles.NotFoundPage } >
            <h1>404 - Not found.</h1>
            <button onClick={ user ? () => navigate("/dashboard") : () => navigate("/")} >
               {user ?  "Back to Dashboard" : "Login" }
            </button>
        </main>
    );
};
export default NotFoundPage;
