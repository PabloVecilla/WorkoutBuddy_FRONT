import styles from "./StateComponents.module.css";

export const EmptyState = ({
  title = "No items found",
  message,
  actionLabel,
  onAction,
}) => (
  <div className={styles.stateContainer}>
    <span className={styles.emptyIcon}>🏋️‍♂️</span>
    <h3 className={styles.emptyTitle}>{title}</h3>
    {message && <p className={styles.emptyMessage}>{message}</p>}
    {actionLabel && onAction && (
      <button className={styles.actionBtn} onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
);