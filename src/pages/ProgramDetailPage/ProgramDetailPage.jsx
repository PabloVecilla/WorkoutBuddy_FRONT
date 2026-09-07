import { useContext, useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { AuthContext } from "../../context/authContext";

import apiClient from "../../api/client";

import styles from "./ProgramDetailPage.module.css"

const ProgramDetailPage = () => {
    const navigate = useNavigate(); 
    const { loading, logout } = useContext(AuthContext); 

    const { id } = useParams(); 

    const [ program, setProgram ] = useState(null); 
    const [ error, setError ] = useState(""); 

    useEffect (() => {
        const getProgramById = async () => {
            try {
                const response = await apiClient.get(`/programs/${id}`); 
                setProgram(response.data.data);  

            } catch (err) {
                setError(err.response?.data?.message || "Error loading Program")
            }
        }; 
        getProgramById(); 
        
    }, [id])

    const handleLogout = async() => {
        try {
            await logout(); 
            navigate("/"); 
        }  catch (err) {
            console.error(err); 
        }
    }; 

    if (loading) return <p>loading...</p>; 

    if (error) return <p>{error}</p>

    if (!program) return <p>Fetching program details...</p>; 
    console.log(program); 

    return (
        <main className={styles.programDetailPage}>
            <h1>Program: {program.name}</h1>
            <div className={styles.cardsContainer}>
                {
                    program?.Workouts?.map((day) => (
                            <article className="card"
                                        key={day.id}>
                                <header>
                                    <h2><b>{day.dayNumber} {day.focus}</b></h2>
                                </header>
                                <div>
                                    {day.workoutExercises?.map((workoutExercise) => (
                                        <div key={workoutExercise.exercise.id}>
                                            <p className="name">{workoutExercise.exercise.name}</p>
                                            <p>{workoutExercise.sets} sets x {workoutExercise.reps} reps</p>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        )
                    )}
            </div>
            <Link to={"/dashboard/"} >Back to dashboard</Link>

            <button onClick={handleLogout}>Logout</button>
        </main>
    );
};

export default ProgramDetailPage; 