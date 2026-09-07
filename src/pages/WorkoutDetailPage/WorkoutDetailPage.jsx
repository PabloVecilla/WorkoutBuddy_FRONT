import { useContext, useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { AuthContext } from "../../context/authContext";

import apiClient from "../../api/client";

import styles from "./WorkoutDetailPage.module.css"

const WorkoutDetailPage = () => {
    const navigate = useNavigate(); 
    const { loading, logout } = useContext(AuthContext); 

    const { programId, workoutId } = useParams(); 

    const [ workout, setWorkout ] = useState(null); 
    const [ error, setError ] = useState(""); 

    useEffect (() => {
        const getWorkoutExercisesInProgramById = async () => {
            try {
                const response = await apiClient.get(`/programs/${programId}/workouts/${workoutId}/workout-exercises`); 
                setWorkout(response.data);  

            } catch (err) {
                setError(err.response?.data?.message || "Error loading Program")
            }
        }; 
        getWorkoutExercisesInProgramById(); 
        
    }, [workoutId])

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

    if (!workout) return <p>Fetching workout details...</p>; 
    console.log("WORKOUT OBJECT: ", workout); 

    return (
        <main className={styles.workoutDetailPage}>
            <h1>Workout: {}</h1>
            <div className={styles.cardsContainer}>
                {
                    workout.data?.map((workoutExercise) => (
                            <article className="card"
                                        key={workoutExercise.id}>
                                <header>
                                    <h2><b>{workoutExercise.exercise.name}</b></h2>
                                    <p>Sets: {workoutExercise.sets}</p>
                                    <p>Reps: {workoutExercise.reps}</p>
                                </header>
                                {/* <div>
                                    {day.workoutExercises?.map((workoutExercise) => (
                                        <div key={workoutExercise.exercise.id}>
                                            <p className="name">{workoutExercise.exercise.name}</p>
                                            <p>{workoutExercise.sets} sets x {workoutExercise.reps} reps</p>
                                        </div> 
                                    ))}
                                </div> */}
                            </article>
                        )
                    )}
            </div>
            <Link to={"/dashboard/"} >Back to dashboard</Link>

            <button onClick={handleLogout}>Logout</button>
        </main>
    );
};

export default WorkoutDetailPage; 