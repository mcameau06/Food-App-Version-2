import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

function Navbar(){
    return (
        <header className={styles.mainHeader}>
            <h1 className={styles.logo}>FoodFindr</h1>
            <nav className={styles.nav}>
                <Link to="/" className={styles.navLink}>Home</Link>
                <Link to="/results" className={styles.navLink}>Results</Link>
                <Link to="/login" className={styles.navLink}>Login</Link>
            </nav>
        </header>
    )
}

export default Navbar;

