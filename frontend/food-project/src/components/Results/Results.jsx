
import styles from './Results.module.css';
import Card from './Card/Card'


function Results({foodResults}){

    if ( foodResults.length === 0){
        return (
            <>
            <div className={styles.noResultsContainer}>
                <h1>No Results Found</h1>
            </div>
            </>
        )
    }

    return (
        <>
        <div className={styles.resultsContainer}>
        {foodResults.map((result,index)=>(
            
            <Card key={result.place_id} place={result}/>
        ))}
        </div>
        
        </>
    )
}

export default Results;