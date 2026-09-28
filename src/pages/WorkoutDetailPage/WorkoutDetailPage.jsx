import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getWorkoutExercisesInProgramById, updateWorkoutExercise } from "../../services/workout.service";
// import ExerciseSelect from "../../components/ExerciseSelect/ExerciseSelect";
import ExerciseCard from "../../components/ExerciseCard/ExerciseCard";
import { useWorkoutTimer } from "../../hooks/useWorkoutTimer";
import { createWorkoutSession } from "../../services/session.service"; 
import styles from "./WorkoutDetailPage.module.css"; 
import { LoadingState, ErrorState, EmptyState } from "../../components/UI";
import { updateSetData } from "../../services/set.service"; 


const WorkoutDetailPage = () => {
    const { programId, workoutId } = useParams(); 
    const [workout, setWorkout] = useState(null); 
    const [error, setError] = useState(""); 

    const [ setData, setSetData ] = useState({executedReps: 0, weightKg: 0.00,  isCompleted: true}); 

    // const [weight, setWeight] = useState(""); 
    // const [reps, setReps] = useState(""); 

    const [session, setSession] = useState(null);
    const [isStarting, setIsStarting] = useState(false);

    // const handleBlur = () => {
    //     if (weight) {
    //         setWeight(parseFloat(weight).toFixed(2));
    //     }
    //     if (reps) {
    //         setReps(parseInt(reps, 10));
    //     }
    // };

    // Pass activeSession.startedAt into the custom timer hook
    const { formattedTime } = useWorkoutTimer(session?.startedAt);

    // Handle Start Session button click
    const handleStartSession = async () => {
        setIsStarting(true);
        setError("");
        try {
        // Calls your backend route: POST /programs/:programId/workouts/:workoutId/sessions
        const responseData = await createWorkoutSession(programId, workoutId);
        setSession(responseData); 
        } catch (err) {
        setError(err.response?.data?.error?.message || "Failed to start session");
        } finally {
        setIsStarting(false);
        }
    };

    const handleSetUpdate = async (setId, updateData) => {
        const updatedSet = await updateSetData(
          session.id,
          setId,
          updateData
        );
      
        setSession((currentSession) => ({
          ...currentSession,
          workoutSets: currentSession.workoutSets.map((set) =>
            set.id === updatedSet.id ? updatedSet : set
          ),
        }));
      };

    useEffect(() => {
        const fetchWorkoutExercises = async () => {
            try {
                const data = await getWorkoutExercisesInProgramById(programId, workoutId); 
                setWorkout(data);  
            } catch (err) {
                setError(err.response?.data?.error?.message || "Error loading workout details");
            }
        }; 
        fetchWorkoutExercises(); 
    }, [programId, workoutId]);

    const setsByWorkoutExerciseId = useMemo(() => {
        const groups = {};
      
        for (const set of session?.workoutSets ?? []) {
          const exerciseId = set.workoutExerciseId;
      
          if (!groups[exerciseId]) {
            groups[exerciseId] = [];
          }
      
          groups[exerciseId].push(set);
        }
      
        for (const sets of Object.values(groups)) {
          sets.sort((a, b) => a.setNumber - b.setNumber);
        }
      
        return groups;
      }, [session]);

    const handleExerciseChange = async (workoutExerciseId, newExercise) => {
        try {
            await updateWorkoutExercise(programId, workoutId, workoutExerciseId, newExercise.id);
            
            // Optimistically update the local exercise state
            setWorkout((prev) =>
                prev.map((item) =>
                    item.id === workoutExerciseId
                        ? { ...item, exercise: newExercise }
                        : item
                )
            );
        } catch (err) {
            setError(err.response?.data?.error?.message || "Failed to update exercise");
        }
    };

    if (error) return <ErrorState message={error} onRetry={fetchWorkoutExercises} />;
    if (!workout) return <LoadingState message="Fetching workout details..." />;
    if (workout.length === 0) {
        return (
            <EmptyState 
                title="No Exercises In Workout" 
                message="This workout doesn't have any exercises assigned yet."
                actionLabel="+ Add Exercise"
                onAction={() => navigate("/exercises")}
            />
        );
    }

    return (
        <main className={styles.workoutDetailPage}>
            <header className={styles.sessionHeader}>
                <h1>Workout</h1>

                {/* Dynamic Display: Show Timer or Start Button */}
                {session ? (
                <div className={styles.timerDisplay}>
                    <span className={styles.pulseDot}></span>
                    <span>{formattedTime}</span>
                </div>
                ) : (
                <button 
                    className={styles.startBtn} 
                    onClick={handleStartSession} 
                    disabled={isStarting}
                >
                    {isStarting ? "Starting..." : "Start Session"}
                </button>
                )}
            </header>

            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.contentWrapper}>
                {workout.map((workoutExercise) => (
                    <ExerciseCard
                    key={workoutExercise.id}
                    workoutExercise={workoutExercise}
                    sessionSets={
                        setsByWorkoutExerciseId[workoutExercise.id] ?? []
                    }
                    sessionActive={Boolean(session)}
                    onExerciseChange={handleExerciseChange}
                    onSetUpdate={handleSetUpdate}
                    />
                ))}
            </div>

            {/* <div className={styles.contentWrapper}>
                {workout.map((workoutExercise) => (
                    <section className={styles.exerciseContainer} key={workoutExercise.id}>
                        <ExerciseSelect
                            currentExercise={workoutExercise.exercise} 
                            onExerciseChange={(newEx) => handleExerciseChange(workoutExercise.id, newEx)}
                        />

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
                                            inputMode="decimal"
                                            id="weight-kg" 
                                            placeholder={ workoutExercise.weightKg ? workoutExercise.weightKg : "0.00" }
                                            onChange={(e) => setWeight(e.target.value)} 
                                            onBlur={handleBlur} />
                                        <label htmlFor="reps">Reps: </label>
                                        <input 
                                            type="number" 
                                            id="reps" 
                                            placeholder={ workoutExercise.reps ? workoutExercise.reps : "0" }
                                            onChange={(e) => setReps(e.target.value)} 
                                            onBlur={handleBlur} />
                                        </section>
                                        <button </form>disabled onClick={() => handleSendExerciseData} className={styles.send}>Done!</button>
                                    </form>
                                    
                                </footer>
                            </article>
                        ))}
                        <p className={styles.weightSymbol}>||-||</p>
                    </section>
                ))}
            </div> */}
        </main>
    );
};

export default WorkoutDetailPage;