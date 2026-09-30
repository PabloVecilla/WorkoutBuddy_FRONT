import { useState } from "react";
import styles from "./SetRow.module.css";
import { CardioSetFields } from "./SetRowFields/CardioSetFields";
import { StrengthSetFields } from "./SetRowFields/StrengthSetFields";

const SetRow = ({
  workoutSet,
  mode,
  onSave,
  disabled = false,
}) => {
  const [formData, setFormData] = useState(() => mode === "cardio" ? ({
    intensityLevel: workoutSet.intensityLevel ?? "",
    durationMinutes: workoutSet.durationMinutes ?? "",
  }) : ({
    weightKg: workoutSet.weightKg ?? "",
    executedReps: workoutSet.executedReps ?? "",
  }));

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Input ID generators
  const ids = {
    weight: `weight-${workoutSet.id}`,
    reps: `reps-${workoutSet.id}`,
    duration: `duration-${workoutSet.id}`,
    intensity: `intensity-${workoutSet.id}`,
  };

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

    let payload = { isCompleted: true };

    if ( mode === "cardio") {
      if (formData.intensityLevel === "" || formData.durationMinutes === "") {
        setError("Enter intensity level and duration in minutes of your cardio set");
        return;
      } 
      const intensityLevel = Number(formData.intensityLevel); 
      const durationMinutes = Number(formData.durationMinutes); 
      if ( !Number.isInteger(intensityLevel) || intensityLevel < 1 || intensityLevel > 10) {
        setError(" set Intensity level between 1 and 10");
        return;
      }
      if ( !Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 180) {
        setError(" set Duration in between 1 and 180 minutes");
        return;
      }
      payload = {... payload, intensityLevel, durationMinutes }; 
    } else {
      if (formData.weightKg === "" || formData.executedReps === "") {
        setError("Enter weight and completed reps");
        return;
      }
      const weightKg = Number(formData.weightKg);
      const executedReps = Number(formData.executedReps);

      if ( !Number.isFinite(weightKg) || weightKg < 0 || weightKg > 999.99 ) {
        setError("Weight must be between 0 and 999.99 kg");
        return;
      }
      if ( !Number.isInteger(executedReps) || executedReps < 1 || executedReps > 30) {
        setError("Reps must be a whole number between 1 and 30");
        return;
      }
      payload = { ...payload, weightKg, executedReps }; 
    }
    setIsSaving(true);

    try {
      const updatedSet = await onSave(workoutSet.id, payload);

      setFormData( mode === "cardio" ? {
        intensityLevel: updatedSet.intensityLevel ?? "",
        durationMinutes: updatedSet.durationMinutes ?? "",
      } : {
        weightKg: updatedSet.weightKg ?? "",
        executedReps: updatedSet.executedReps ?? "",
      });
    } catch (err) {
      setError ( err.response?.data?.error?.message || "Unable to save this set" );
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
        Target: { mode === "cardio" ? ` ${workoutSet.durationMinutes} minutes` : ` ${workoutSet.targetReps} reps`}
      </p>

      <div className={styles.fields}>
        {mode === "cardio" ? 
        <CardioSetFields 
          formData={formData}
          onChange={handleChange}
          disabled={disabled || isSaving}
          styles={styles}
          ids={ids}
        /> : 
        <StrengthSetFields 
          formData={formData}
          onChange={handleChange}
          disabled={disabled || isSaving}
          styles={styles}
          ids={ids}
        />}
        {/* <label htmlFor={weightInputId}>
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
        </label> */}
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