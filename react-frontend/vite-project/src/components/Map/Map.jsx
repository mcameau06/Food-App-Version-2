import React from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import styles from './Map.module.css'

const RestaurantMap = () => (
  <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>

    <div className={styles.mapContainer}>
    <Map
      className={styles.map}
      defaultCenter={{lat: 22.54992, lng: 0}}
      defaultZoom={3}
      gestureHandling='greedy'
      disableDefaultUI
    />
    </div>
  </APIProvider>
  
);


export default RestaurantMap;