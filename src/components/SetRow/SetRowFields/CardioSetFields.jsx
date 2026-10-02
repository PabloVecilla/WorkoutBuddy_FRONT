export const CardioSetFields = ({ formData, onChange, disabled, styles, ids }) => (
    <>
      <label htmlFor={ids.duration}>
        Duration (mins)
        <input
          id={ids.duration}
          name="durationMinutes"
          type="number"
          inputMode="numeric"
          min="1"
          max="180"
          required
          value={formData.durationMinutes || ""}
          onChange={onChange}
          disabled={disabled}
          className={styles.input}
        />
      </label>
  
      <label htmlFor={ids.intensity}>
        Intensity (1-10)
        <input
          id={ids.intensity}
          name="intensityLevel"
          type="number"
          inputMode="numeric"
          min="1"
          max="10"
          required
          value={formData.intensityLevel || ""}
          onChange={onChange}
          disabled={disabled}
          className={styles.input}
        />
      </label>
    </>
  );