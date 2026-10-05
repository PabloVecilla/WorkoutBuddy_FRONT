import Header from "../../components/Header/Header";
// import Footer from "../../components/Footer/Footer";
import styles from "./MainLayout.module.css";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className={styles.layout}>
      <Header />

        <main className={styles.mainContent}>
          <Outlet />
        </main>

      {/* <Footer /> */}
    </div>
  );
}

export default MainLayout;