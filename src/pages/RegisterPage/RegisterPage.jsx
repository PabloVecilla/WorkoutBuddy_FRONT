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
    <main>
      <h1>Create account</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="mail"
          placeholder="Email"
          value={formData.mail}
          onChange={handleChange}
        />

        <input
          type="password"
          name="pass"
          placeholder="Password"
          value={formData.pass}
          onChange={handleChange}
        />

        <button type="submit">Register</button>
      </form>

      {error && <p>{error}</p>}

      <Link to="/">Already have an account? Login</Link>
    </main>
  );
};

export default RegisterPage;