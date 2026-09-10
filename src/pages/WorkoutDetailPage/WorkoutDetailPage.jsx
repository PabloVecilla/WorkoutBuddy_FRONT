import { useContext, useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { AuthContext } from "../../context/authContext";

import apiClient from "../../api/client";

import styles from "./WorkoutDetailPage.module.css"

import MainLayout from "../../layouts/MainLayout/MainLayout"; 

const WorkoutDetailPage = () => {
    const navigate = useNavigate(); 
    const { loading } = useContext(AuthContext); 

    const { programId, workoutId } = useParams(); 

    const [ workout, setWorkout ] = useState(null); 

    const [ formData, setFormData ] = useState({ weight: 0, sets: 0, reps: 0 }); 

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

    if (loading) return <p>loading...</p>; 

    if (error) return <p>{error}</p>

    if (!workout) return <p>Fetching workout details...</p>; 
    console.log("WORKOUT OBJECT: ", workout); 

    return (
        <MainLayout>
        <main className={styles.workoutDetailPage}>
            <h1>Workout: {}</h1>
            <div className={styles.contentWrapper}>
                { workout.data?.map((workoutExercise) => (
                    <section className={styles.exerciseContainer}
                                key={workoutExercise.id}>

                        <h2><b>{workoutExercise.exercise.name}</b></h2>
                        <button>Edit</button>
                        
                        {Array.from({ length: workoutExercise.sets }).map((_, index) => (
                            <article key={index} className={styles.exerciseCard}>
                                <h3>Set {index + 1}</h3>

                                <footer className={styles.weightReps}>
                                    <form action="">
                                        <section className={styles.formSection}>
                                        <label htmlFor="weight-kg">Weight:</label>
                                        <input 
                                            type="number" 
                                            step="0.01" 
                                            inputmode="decimal"
                                            id="weight-kg" 
                                            placeholder={ workoutExercise.weightKg ? workoutExercise.weightKg : "0.00" }
                                            onblur="if(this.value) this.value = parseFloat(this.value).toFixed(2);" />
                                        <label htmlFor="reps">Reps: </label>
                                        <input 
                                            type="number" 
                                            id="precio" 
                                            placeholder={ workoutExercise.reps ? workoutExercise.reps : "0" }
                                            onblur="if(this.value) this.value = parseFloat(this.value).toFixed(2);" />
                                        </section>
                                        <button onClick={() => handleSendExerciseData} className={styles.send}>Done!</button>
                                    </form>
                                    
                                </footer>
                            </article>
                        ))}
                        <p className={styles.weightSymbol}>||-||</p>
                    </section>
                ))}
            </div>
        </main>
        </MainLayout>
    );
};

export default WorkoutDetailPage; 