import Search from '../Search/Search'
import styles from './Home.module.css'

export default function Home({searchFunction}){
    return (
        <main className={styles.mainContainer}>
            <Search onSearch={searchFunction} />
        </main>
    )
}