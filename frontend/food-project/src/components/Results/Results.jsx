
import styles from './Results.module.css';
import Card from './Card/Card'


function Results({foodResults}){



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