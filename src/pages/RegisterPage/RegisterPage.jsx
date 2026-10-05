import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.css"; 

import apiClient from "../../api/client";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await apiClient.post("/auth/register", formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error?.message || "Register failed");
    }
  };

  return (
    <main className={styles.RegisterPage}>
      <h1>Create account</h1>

      <form onSubmit={handleSubmit}>
        <article>
          <label htmlFor="name">Name: </label>
          <input
          type="text"
          name="name"
          id="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        </article>
        
        <article>
          <label htmlFor="mail">Email: </label>
          <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
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
        />
        </article>

        <button type="submit">Register</button>
      </form>

      {error && <p>{error}</p>}

      <Link to="/">Already have an account? Login</Link>
    </main>
  );
};

export default RegisterPage;