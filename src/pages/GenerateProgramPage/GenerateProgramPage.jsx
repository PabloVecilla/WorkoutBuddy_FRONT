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
            const payload = {...formData, frquency: Number(formData.frequency)}; 

            const response = await apiClient.post("/programs/generate", payload); 

            const addedProgram = response.data.addedProgram; 
            
            navigate(`/programs/${addedProgram.id}`); 

        } catch (err) {
            setError(err.message || "Error generating Program"); 
        }
    }; 

    return (
        <main className={styles.generateProgramMain}>
            <h1>Program Generator</h1>
                    <h2>Welcome, {user.name}</h2>
                    <form onSubmit={handleSubmit}>
                        <p><label htmlFor="name">Name: </label>
                        <input type="text" 
                                name="name"
                                placeholder="Workout Program name"
                                value={formData.name}
                                onChange={handleChange}
                                ref={inputRef}
                        />
                        </p>

                        <p>
                            <label htmlFor="goal">Goal: </label>
                            <select
                                    name="goal"
                                    value={formData.goal}
                                    onChange={handleChange}
                            >
                            <option value="">Select your current Goal</option>
                            <option value="muscle_gain">Muscle Gain</option>
                            <option value="fat_loss">Fat Loss</option>
                            <option value="strength">Strength</option>
                            <option value="recomp">Recomposition</option>
                        </select>
                        </ p>

                        <p>
                            <label htmlFor="level">Level: </label>
                        <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                        >
                            <option value="">Select your current Level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                        </select>
                        </ p>

                        <p>
                            <label htmlFor="frequency">Frequency: </label>
                        <select
                            name="frequency"
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
                        </ p>

                        <button type="submit">Submit</button>
                    </form>
                    <button onClick={handleLogout}>Logout</button>
        </main>
    );
};

export default GenerateProgramPage; 