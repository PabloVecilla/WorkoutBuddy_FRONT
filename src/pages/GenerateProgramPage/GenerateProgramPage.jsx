import { useContext, useEffect, useState, useRef } from "react"; 
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/authContext";
import styles from "./GenerateProgramPage.module.css"

import apiClient from "../../api/client";

const GenerateProgramPage = () => {
    const navigate = useNavigate(); 
    const { user, loading, logout } = useContext(AuthContext); 

    const [ formData, setFormData ] = useState({ name: "", goal: "", level: "", frequency: "" }); 

    const [ error, setError ] = useState(""); 

    const frequencyOptions = {
        beginner: [2, 3, 4], 
        intermediate: [3, 4, 5, 6]
    }; 

    const inputRef = useRef(null); 

    useEffect(() => {
        inputRef?.current?.focus(); 

    }, [loading]); 

    const handleLogout = async() => {
        try {
            await logout(); 
            navigate("/"); 
        }  catch (err) {
            console.error(err); 
        }
    }; 

    if (loading) return <p>loading...</p>; 

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
            const payload = {...formData, frequency: Number(formData.frequency)}; 

            const response = await apiClient.post("/programs/create", payload); 

            const addedProgram = response.data; 
            
            navigate(`/programs/${addedProgram.data.id}`); 

        } catch (err) {
            setError(err.response?.data?.error?.message || "Error generating Program"); 
        }
    }; 

    return (
        <main className={styles.generateProgramMain}>
            <h1>Program Generator</h1>
                    <h2>Welcome, {user.data.name}</h2>
                    <form onSubmit={handleSubmit}>
                        <article><label htmlFor="name">Name: </label>
                        <input type="text" 
                                name="name"
                                id="name"
                                placeholder="Program name"
                                value={formData.name}
                                onChange={handleChange}
                                ref={inputRef}
                        />
                        </article>

                        <article>
                            <label htmlFor="goal">Goal: </label>
                            <select
                                    name="goal"
                                    id="goal"
                                    value={formData.goal}
                                    onChange={handleChange}
                            >
                                <option value="">Select your main Goal</option>
                                <option value="muscle_gain">Muscle Gain</option>
                                <option value="fat_loss">Fat Loss</option>
                                <option value="strength">Strength</option>
                                <option value="recomp">Recomposition</option>
                            </select>
                        </article>

                        <article>
                            <label htmlFor="level">Level: </label>
                            <select
                                    name="level"
                                    id="level"
                                    value={formData.level}
                                    onChange={handleChange}
                            >
                                <option value="">Current Level</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                            </select>
                        </ article>

                        <article>
                            <label htmlFor="frequency">Frequency: </label>
                            <select
                                name="frequency"
                                id="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                disabled={!formData.level}
                            >
                                <option value="">Select frequency</option>
                                {(frequencyOptions[formData.level] || []).map((frequency) =>
                                (<option key={frequency} value={frequency}>
                                    {frequency} days/week
                                </option>)
                                )}
                            </select>
                        </article>

                        <button type="submit">Submit</button>
                    </form>
                    <button onClick={handleLogout}>Logout</button>
        </main>
    );
};

export default GenerateProgramPage; 