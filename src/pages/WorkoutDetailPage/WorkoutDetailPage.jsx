import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getWorkoutExercisesInProgramById, updateWorkoutExercise } from "../../services/workout.service";
import ExerciseCard from "../../components/ExerciseCard/ExerciseCard";
import { useWorkoutTimer } from "../../hooks/useWorkoutTimer";
import { createWorkoutSession, finishWorkoutSession } from "../../services/session.service"; 
import styles from "./WorkoutDetailPage.module.css"; 
import { LoadingState, ErrorState, EmptyState } from "../../components/UI";
import { updateSetData } from "../../services/set.service"; 


const WorkoutDetailPage = () => {
    const navigate = useNavigate(); 
    const { programId, workoutId } = useParams(); 
    const [workout, setWorkout] = useState(null); 
    const [error, setError] = useState(""); 

    const [session, setSession] = useState(null);
    const [isStarting, setIsStarting] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false); 

    const [  retryCount, setRetryCount] = useState(0); 

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

    const allSetsCompleted = session?.workoutSets?.length > 0 && session.workoutSets.every((set) => set.isCompleted === true);

    const handleFinishSession = async () => {
        setError("");
        if (!allSetsCompleted) {
            const confirmed = window.confirm("Some sets are incomplete. Finish the workout anyway?");
            if (!confirmed) return; 
        }
        setIsFinishing(true);
        try {
            // Calls backend route: POST /workout-sessions/:sessionId/finish
            await finishWorkoutSession(session.id);
            navigate("/dashboard", { state: { message: "Workout Session completed successfully" } }); 
        } catch (err) {
            setError(err.response?.data?.error?.message || "Failed to finish session");
        } finally {
            setIsFinishing(false);
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
        return updatedSet; //allows SetRow to refresh its draft with the normalized server values
      };

      const handleRetry = () => {
        setRetryCount(prev => prev + 1);
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
    }, [programId, workoutId, retryCount]);

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

    if (error) return <ErrorState message={error} onRetry={handleRetry} />;
    if (!workout) return <LoadingState message="Fetching workout details..." />;
    if (workout.length === 0) {
        return (
            <EmptyState 
                title="No Exercises In Workout" 
                message="This workout doesn't have any exercises assigned yet."
                actionLabel="Back to Dashboard"
                onAction={() => navigate("/dashboard")}
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
                    {isStarting ? "Loading session..." : "Start / Resume Session"}
                </button>
                )}
            </header>

            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.contentWrapper}>
                {workout.map((workoutExercise) => (
                    <ExerciseCard
                        key={workoutExercise.id}
                        workoutExercise={workoutExercise}
                        sessionSets={ setsByWorkoutExerciseId[workoutExercise.id] ?? [] }
                        sessionActive={session?.isInProgress === true}                        
                        onExerciseChange={handleExerciseChange}
                        onSetUpdate={handleSetUpdate}
                    />
                ))}
            </div>

            <button 
                className={styles.finishBtn} 
                onClick={handleFinishSession} 
                disabled={!session || isFinishing}
            >
                {isFinishing ? "Finishing..." : "Finish Session"}
            </button>
        </main>
    );
};

export default WorkoutDetailPage;