import styles from './Card.module.css'
import { useState, useEffect } from 'react';

function Card({place}){
    const {
        name,
        address,
        rating,
        open_now,
        price_level,
        photo_urls,
        place_id
      } = place;
    
    const [favorited, setFavorite] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Only show carousel if there are multiple images
    const hasMultipleImages = photo_urls && photo_urls.length > 1;

    function handleFavorite(){
        setFavorite(prevFavorited => !prevFavorited)
    }

    function nextImage() {
        if (photo_urls && photo_urls.length > 0) {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === photo_urls.length - 1 ? 0 : prevIndex + 1
            );
        }
    }

    function prevImage() {
        if (photo_urls && photo_urls.length > 0) {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === 0 ? photo_urls.length - 1 : prevIndex - 1
            );
        }
    }

    function goToImage(index) {
        setCurrentImageIndex(index);
    }

    return (
        <>
        <div className={styles.placeCard}>
            {photo_urls && photo_urls.length > 0 ? (
                <div className={styles.imageCarousel}>
                    <div className={styles.imageContainer}>
                        <img 
                            src={photo_urls[currentImageIndex]} 
                            alt={`${name} - Image ${currentImageIndex + 1}`}
                            className={styles.mainImage}
                        />
                        
                        {hasMultipleImages && (
                            <>
                                <button 
                                    className={styles.carouselButton} 
                                    onClick={prevImage}
                                    aria-label="Previous image"
                                >
                                    ‹
                                </button>
                                <button 
                                    className={`${styles.carouselButton} ${styles.nextButton}`}
                                    onClick={nextImage}
                                    aria-label="Next image"
                                >
                                    ›
                                </button>
                                
                                <div className={styles.indicators}>
                                    {photo_urls.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`${styles.indicator} ${
                                                index === currentImageIndex ? styles.active : ''
                                            }`}
                                            onClick={() => goToImage(index)}
                                            aria-label={`Go to image ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className={styles.noImage}>No Image Available</div>
            )}

            <h2>{name}</h2>
            <ul>
                <li>Address: {address}</li>
                <li>Rating: {rating}</li>
                {open_now? <li>Open Now: Yes</li>: <li>Open Now: No</li>}
            </ul>
           
            {favorited ? (
                <button onClick={handleFavorite}>Remove from Favorites</button>
            ) : (
                <button onClick={handleFavorite}>Add to Favorites</button>
            )}
        </div>
        
        </>
    )
}

export default Card;