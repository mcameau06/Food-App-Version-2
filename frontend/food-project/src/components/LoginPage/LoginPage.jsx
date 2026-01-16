import styles from './LoginPage.module.css'

export default function LoginPage(){
    return (
        <main className={styles.mainContainer}>
            <div className={styles.loginContainer}>
                <h2 className={styles.title}>Login</h2>
                <form className={styles.loginForm}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className={styles.input}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>
                        Login
                    </button>
                </form>
            </div>
        </main>
    )
}