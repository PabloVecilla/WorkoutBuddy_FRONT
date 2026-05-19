import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.css"; 

import apiClient from "../../api/client";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mail: "",
    pass: "",
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
      setError(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <main className={styles.RegisterPage}>
      <h1>Create account</h1>

      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="name">Name: </label>
          <input
          type="text"
          name="name"
          id="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        </p>
        
        <p>
          <label htmlFor="mail">Email: </label>
          <input
          type="email"
          name="mail"
          id="mail"
          placeholder="Email"
          value={formData.mail}
          onChange={handleChange}
        />
        </p>
        
        <p>
          <label htmlFor="pass">Password: </label>
          <input
          type="password"
          name="pass"
          id="pass"
          placeholder="Password"
          value={formData.pass}
          onChange={handleChange}
        />
        </p>

        <button type="submit">Register</button>
      </form>

      {error && <p>{error}</p>}

      <Link to="/">Already have an account? Login</Link>
    </main>
  );
};

export default RegisterPage;