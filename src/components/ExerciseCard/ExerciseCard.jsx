import { useEffect, useState } from "react";
import ExerciseSelect from "../ExerciseSelect/ExerciseSelect";
import styles from "./ExerciseCard.module.css";
import SetRow from "../SetRow/SetRow";

const ExerciseCard = ({
    workoutExercise,
    workingWeightKg,
    sessionSets,
    sessionActive,
    onWorkingWeightChange,
    onExerciseChange,
    onSetUpdate,
  }) => {
  const {
    id,
    exercise,
    sets: targetSetCount,
    reps: targetReps,
    restSeconds,
  } = workoutExercise;

  const [draftWeightKg, setDraftWeightKg] = useState(
    workingWeightKg ?? ""
  ); 

  useEffect(() => {
    setDraftWeightKg(workingWeightKg ?? ""); 
  }, [workingWeightKg]); 

  const mode = workoutExercise.exercise.movementPattern === "cardio" ? "cardio" : "strength"; 

  const handleWorkingWeightSubmit = (event) => {
    event.preventDefault(); 

    if (draftWeightKg === "") return; 

    const numericWeight = Number(draftWeightKg); 

    if (!Number.isFinite(numericWeight) || numericWeight < 0 || numericWeight > 999.99) return; 

    onWorkingWeightChange(draftWeightKg)
  }

  return (
    <section className={styles.exerciseCard}>
      <ExerciseSelect
        currentExercise={exercise}
        disabled={sessionActive}
        onExerciseChange={(newExercise) =>
          onExerciseChange(id, newExercise)
        }
      />

      {!sessionActive && (
        <div
          className={styles.prescription}
          aria-label="Workout prescription"
        > 
          <span>{targetSetCount} sets</span>
          <span>{targetReps} reps</span>
          <span>{restSeconds}s rest</span>
        </div>
      )}

      <div className={styles.setList}>
        {mode === "strength" && sessionActive &&
          <form onSubmit={handleWorkingWeightSubmit}>
            <label htmlFor={`working-weight-${id}`}>Working weight (kg)</label>
            <input
              id={`working-weight-${id}`}
              name="workingWeightKg"
              type="number"
              inputMode="decimal"
              value={draftWeightKg}
              onChange={(event) => setDraftWeightKg(event.target.value)}
              min={0}
              max={999.99}
              step="0.25"
              required
            />
            <button type="submit"><strong>Set Working weight</strong></button>
          </form>
        }
        {sessionActive ? (
            sessionSets.map((set) => (
                <SetRow
                    key={set.id}
                    workoutSet={set}
                    mode={mode}
                    onSave={onSetUpdate}
                    workingWeightKg={workingWeightKg}
                />
            ))
        ) : (
          <p>Start the session to log your sets.</p>
        )}
      </div>
    </section>
  );
};

export default ExerciseCard;