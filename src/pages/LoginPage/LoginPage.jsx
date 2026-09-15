import { useState, useContext } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, login, loading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmiting] = useState(false); 

  if (loading) return <p>Checking session...</p>

  if (user) return <Navigate to="/dashboard" replace /> 

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    setIsSubmiting(true); 

    try {
      await login(formData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmiting(false); 
    }
  };

  return (
    <main className={styles.LoginPage}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <article>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </article>
        <article>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </article>
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Logging in..." : "Login"}</button>
      </form>
      
      {error && <p className={styles.errorMessage} role='alert'>{error}</p>}
      
      <Link to="/register">Create an account</Link>
    </main>
  );
};

export default LoginPage;
