import { useState } from "react";
import styles from "./SetRow.module.css";

const SetRow = ({
  workoutSet,
  onSave,
  disabled = false,
}) => {
  const [formData, setFormData] = useState(() => ({
    weightKg: workoutSet.weightKg ?? "",
    executedReps: workoutSet.executedReps ?? "",
  }));

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const weightInputId = `weight-${workoutSet.id}`;
  const repsInputId = `reps-${workoutSet.id}`;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      formData.weightKg === "" ||
      formData.executedReps === ""
    ) {
      setError("Enter weight and completed reps");
      return;
    }

    const weightKg = Number(formData.weightKg);
    const executedReps = Number(formData.executedReps);

    if (
      !Number.isFinite(weightKg) ||
      weightKg < 0 ||
      weightKg > 999.99
    ) {
      setError("Weight must be between 0 and 999.99 kg");
      return;
    }

    if (
      !Number.isInteger(executedReps) ||
      executedReps < 1 ||
      executedReps > 30
    ) {
      setError("Reps must be a whole number between 1 and 30");
      return;
    }

    setIsSaving(true);

    try {
      const updatedSet = await onSave(workoutSet.id, {
        weightKg,
        executedReps,
        isCompleted: true,
      });

      setFormData({
        weightKg: updatedSet.weightKg ?? "",
        executedReps: updatedSet.executedReps ?? "",
      });
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          "Unable to save this set"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      className={styles.setRow}
      onSubmit={handleSubmit}
    >
      <h3>Set {workoutSet.setNumber}</h3>

      <p className={styles.target}>
        Target: {workoutSet.targetReps} reps
      </p>

      <div className={styles.fields}>
        <label htmlFor={weightInputId}>
          Weight
          <input
            id={weightInputId}
            name="weightKg"
            type="number"
            inputMode="decimal"
            min="0"
            max="999.99"
            step="0.01"
            value={formData.weightKg}
            onChange={handleChange}
            disabled={disabled || isSaving}
          />
        </label>

        <label htmlFor={repsInputId}>
          Reps
          <input
            id={repsInputId}
            name="executedReps"
            type="number"
            inputMode="numeric"
            min="1"
            max="30"
            step="1"
            value={formData.executedReps}
            onChange={handleChange}
            disabled={disabled || isSaving}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={disabled || isSaving}
      >
        {isSaving
          ? "Saving..."
          : workoutSet.isCompleted
            ? "Update"
            : "Done"}
      </button>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
};

export default SetRow;