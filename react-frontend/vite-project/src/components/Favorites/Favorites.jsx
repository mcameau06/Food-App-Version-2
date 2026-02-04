import React from 'react';
import { useEffect,useState } from 'react';
import styles from './Favorites.module.css'
const Favorites = () => {
    const [favorites, setFavorites] = useState([])

    useEffect(()=>{
        const saved = JSON.parse(localStorage.getItem("favorites"))|| []
        setFavorites(saved);

    },[]);

    const removeFavorite = ( place_id) => {
        const updated = favorites.filter(fav => fav.place_id !== place_id);
        setFavorites(updated);
        localStorage.setItem("favorites", JSON.stringify(updated))
    };

    if (favorites.length === 0){
        return <div className={styles.empty}>No Favorites</div>
    }

    return(

        <>
                <div className={styles.favorites}>
          <h2>❤️ Your Favorites ({favorites.length})</h2>
          <div className={styles.list}>
            {favorites.map((place) => (
              <div key={place.place_id} className={styles.favCard}>
                {place.photo_urls && <img src={place.photo_urls[0]} alt={place.name} />}
                <div className={styles.info}>
                  <h3>{place.name}</h3>
                  <p>⭐ {place.rating}</p>
                  <p>📍 {place.address}</p>
                </div>
                <button onClick={() => removeFavorite(place.place_id)}>Remove</button>
              </div>
            ))}
          </div>
        </div>




        
        
        
        </>



    )

 


}

export default Favorites;