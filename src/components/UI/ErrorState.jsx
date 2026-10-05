import styles from "./StateComponents.module.css";

export const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
  <div className={styles.stateContainer}>
    <span className={styles.errorIcon}>⚠️</span>
    <p className={styles.errorMessage}>{message}</p>
    {onRetry && (
      <button className={styles.actionBtn} onClick={onRetry}>
        Try Again
      </button>
    )}
  </div>
);