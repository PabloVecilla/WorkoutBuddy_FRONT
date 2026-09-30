import ExerciseSelect from "../ExerciseSelect/ExerciseSelect";
import styles from "./ExerciseCard.module.css";
import SetRow from "../SetRow/SetRow";

const ExerciseCard = ({
    workoutExercise,
    sessionSets,
    sessionActive,
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
        {sessionActive ? (
            sessionSets.map((set) => (
                <SetRow
                    key={set.id}
                    workoutSet={set}
                    onSave={onSetUpdate}
                    disabled={!sessionActive}
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