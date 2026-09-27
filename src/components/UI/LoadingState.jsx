import styles from "./StateComponents.module.css";

export const LoadingState = ({ message = "Loading details..." }) => (
  <div className={styles.stateContainer}>
    <div className={styles.spinner}>||-||</div>
    <p>{message}</p>
  </div>
);