import { useState, useRef, useEffect } from "react";
import { getAlternativesForExercise } from "../../services/exercise.service";
import styles from "./ExerciseSelect.module.css";

const ExerciseSelectHeader = ({ currentExercise, onExerciseChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lazily fetch alternatives when opening dropdown for the first time
  const handleToggle = async () => {
    if (!isOpen && options.length === 0 && currentExercise?.movementPattern) {
      setIsLoading(true);
      try {
        const alternatives = await getAlternativesForExercise(currentExercise.movementPattern);
        console.log("movementPattern: ", currentExercise.movementPattern)
        setOptions(alternatives);
      } catch (err) {
        console.error("Failed to load alternatives:", err);
      } finally {
        setIsLoading(false);
      }
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (exercise) => {
    setIsOpen(false);
    if (exercise.id !== currentExercise.id) {
      onExerciseChange(exercise);
    }
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div className={styles.headerBar}>
        <h2><b>{currentExercise?.name || "Select Exercise"}</b></h2>
        <button
          type="button"
          className={styles.expandBtn}
          onClick={handleToggle}
          aria-label="Expand exercise options"
        >
          {isOpen ? "▲" : "▼"}
        </button>
      </div>

      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {isLoading ? (
            <li className={styles.emptyOption}>Loading alternatives...</li>
          ) : options.length > 0 ? (
            options.map((exercise) => (
              <li
                key={exercise.id}
                className={`${styles.optionItem} ${
                  currentExercise?.id === exercise.id ? styles.activeOption : ""
                }`}
                onClick={() => handleSelect(exercise)}
              >
                {exercise.name}
              </li>
            ))
          ) : (
            <li className={styles.emptyOption}>No alternatives found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default ExerciseSelectHeader;