import ExerciseSelect from "../ExerciseSelect/ExerciseSelect";
import styles from "./ExerciseCard.module.css";

const ExerciseCard = ({
  workoutExercise,
  sessionSets,
  sessionActive,
  onExerciseChange,
}) => {
  const {
    id,
    exercise,
    sets: targetSetCount,
    reps: targetReps,
    restSeconds,
  } = workoutExercise;

  return (
    <section className={styles.card}>
      <ExerciseSelect
        currentExercise={exercise}
        disabled={sessionActive}
        onExerciseChange={(newExercise) =>
          onExerciseChange(id, newExercise)
        }
      />

      <div className={styles.prescription}>
        <span>{targetSetCount} sets</span>
        <span>{targetReps} reps</span>
        <span>{restSeconds}s rest</span>
      </div>

      <div className={styles.setList}>
        {sessionActive ? (
          sessionSets.map((set) => (
            <article key={set.id}>
              Set {set.setNumber}: {set.targetReps} target reps
            </article>
          ))
        ) : (
          <p>Start the session to log your sets.</p>
        )}
      </div>
    </section>
  );
};

export default ExerciseCard;