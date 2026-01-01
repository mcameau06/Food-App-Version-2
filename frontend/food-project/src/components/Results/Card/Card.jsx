import styles from './Card.module.css'

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

    return (
        <>
        <div className={styles.placeCard}>
            {photo_urls && <img src={photo_urls[0]} alt={name} />}
            <h2>{name}</h2>
            <ul>
                <li>Address: {address}</li>
                <li>Rating: {rating}</li>
                {open_now? <li>Open Now: Yes</li>: <li>Open Now: No</li>}
            </ul>
        </div>
        
        </>
    )


}

export default Card;