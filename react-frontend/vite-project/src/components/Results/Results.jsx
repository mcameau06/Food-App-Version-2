import React from 'react';
import Card from './Card/Cards';
import styles from './Results.module.css';

const Results = ({ results, isLoading, error }) => {

  const onLike= (place) =>{
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(place);
    localStorage.setItem("favorites",JSON.stringify(favorites));
    console.log("Liked: ",place.name);
  }
  const onPass = (place) => {
    console.log("Passed: ",place.name);
  }



  if (isLoading) {
    return (
      <>
        <div className={styles.results}>
          <div className={styles.loading}>Loading...</div>
        </div>;
      </>
    )
  }

  if (error) {
    return (
      <>
    <div className={styles.results}>
      <div className={styles.error}>Error: {error}</div>
    </div>
    </>
    );
  }

   if(!results){
    return null
  }

  if (results && results.length === 0) {
    return <div className={styles.results}>
      <div className={styles.noResults}>No results found</div>
    </div>;
  }

  return (
    <div className={styles.results}>
      <div className={styles.resultsHeader}>
        <h2>Found {results.length} places</h2>
      </div>
      <div className={styles.cardsContainer}>
        {results.map((place, index) => ( 
          <Card key={place.place_id} place={place} onLike={onLike} onPass={onPass} />   
        )
        )}
      </div>
    </div>
  );
};

export default Results;