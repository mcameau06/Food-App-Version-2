import styles from './Results.module.css';
import Card from './Card/Card'

function Results({foodResults}){
    if (!foodResults || foodResults.length === 0){
        return (
            <main className={styles.mainContainer}>
                <div className={styles.noResultsContainer}>
                    <h1>No Results Found</h1>
                    <p>Try searching for something else!</p>
                </div>
            </main>
        )
    }

    return (
        <main className={styles.mainContainer}>
            <div className={styles.resultsHeader}>
                <h2>Found {foodResults.length} {foodResults.length === 1 ? 'place' : 'places'}</h2>
            </div>
            <div className={styles.resultsContainer}>
                {foodResults.map((result) => (
                    <Card key={result.place_id} place={result} />
                ))}
            </div>
        </main>
    )
}

export default Results;