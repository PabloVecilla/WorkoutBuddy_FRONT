import { useState, useContext } from "react"; 
import { useNavigate, Link } from "react-router-dom"; 

import { AuthContext } from "../../context/authContext";
import styles from "./LoginPage.module.css"; 

const LoginPage = () => {
    const navigate = useNavigate(); 
    const { login } = useContext(AuthContext); 

    const [ formData, setFormData ] = useState({ mail: "", pass: "" }); 

    const [ error, setError ] = useState(""); 

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [ event.target.name ]: event.target.value
        }); 
    }; 

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        
        setError(""); 

        try {
            await login(formData); 

            navigate("/dashboard"); 

        } catch (err) {
            setError( err.message || "Login failed"); 
        }
    }; 

   return (
    <main className={styles.LoginPage}>
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
            <p>
                <label htmlFor="mail">Email: </label>
                <input type="email"
                    name="mail"
                    id="mail"
                    placeholder="Email"
                    value={formData.mail}
                    onChange={handleChange} 
            />

            </p>

            <p>
                <label htmlFor="pass">Password: </label>
                <input type="password"
                    name="pass"
                    id="pass"
                    placeholder="Password"
                    value={formData.pass} 
                    onChange={handleChange}
                />
            </p>

            <button type="submit">Login</button>

        </form>
        {error && <p>{ error }</p>}
        <Link to="/register">Create an account</Link>
    </main>
   );
}; 

export default LoginPage; 