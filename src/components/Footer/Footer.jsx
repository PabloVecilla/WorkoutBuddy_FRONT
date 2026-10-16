import styles from "./Footer.module.css"
function Footer () {
    return (
        <footer className={styles.footer_page}>
            <p><a href="https://pablovecilla.github.io">Developed with <span className={styles.heartBeat}>❤️</span> by Pablo</a></p>
        </footer>
    )
}

export default Footer; 