import Header from "../../components/Header/Header";
// import Footer from "../../components/Footer/Footer";
import styles from "./MainLayout.module.css";

function MainLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Header />

        <main className={styles.mainContent}>
          {children}
        </main>

      {/* <Footer /> */}
    </div>
  );
}

export default MainLayout;