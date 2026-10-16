export const StrengthSetFields = ({ formData, onChange, disabled, styles, ids }) => (
    <>
      <label htmlFor={ids.weight}>
        Weight (kg)
        <input
          id={ids.weight}
          name="weightKg"
          type="number"
          inputMode="decimal"
          min="0"
          max="999.99"
          required
          step="0.25"
          value={formData.weightKg ?? ""}
          onChange={onChange}
          disabled={disabled}
          className={styles.input}
        />
      </label>
  
      <label htmlFor={ids.reps}>
        Reps
        <input
          id={ids.reps}
          name="executedReps"
          type="number"
          inputMode="numeric"
          min="1"
          max="30"
          required
          step="1"
          value={formData.executedReps ?? ""} // ?? fallback only when value is null or undefined  Preserves 0
          onChange={onChange}
          disabled={disabled}
          className={styles.input}
        />
      </label>
    </>
  );