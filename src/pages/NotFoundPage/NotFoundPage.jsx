import { useNavigate } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <main className={ styles.NotFoundPage } >
            <h1>404 - Not found.</h1>
            <button onClick={() => navigate("/dashboard")} >
                Back to Dashboard
            </button>
        </main>
    );
};
export default NotFoundPage;
