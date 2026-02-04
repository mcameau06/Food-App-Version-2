import { useState, useEffect, useCallback } from 'react';

const PERMISSION_DENIED = 1;
const POSITION_UNAVAILABLE = 2;
const TIMEOUT = 3;

/**
 * Custom hook to get user's geolocation
 * @returns {Object} { lat, lng, loading, error, retry }
 */
function useGeolocation() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const requestPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    if (typeof window !== 'undefined' && !window.isSecureContext) {
      setError('Location is only available on secure (HTTPS) connections');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLat = position.coords.latitude;
        const nextLng = position.coords.longitude;

        setLat(nextLat);
        setLng(nextLng);
        setLoading(false);
        setError(null);

        // Cache location so we only have to ask once
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(
              'foodfindr:user_location',
              JSON.stringify({
                lat: nextLat,
                lng: nextLng,
                timestamp: Date.now(),
              })
            );
          }
        } catch {
          // Ignore storage errors
        }
      },
      (err) => {
        let errorMessage = 'Unable to retrieve your location';
        switch (err.code) {
          case PERMISSION_DENIED:
            errorMessage = 'Location access denied. Enable location in your browser or device settings to search nearby.';
            break;
          case POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Try again later.';
            break;
          case TIMEOUT:
            errorMessage = 'Location request timed out. Check your connection and try again.';
            break;
          default:
            errorMessage = err.message || 'An unknown error occurred';
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      options
    );
  }, []);

  useEffect(() => {
    // If we already have a cached location, use it and skip asking again
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem('foodfindr:user_location');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.lat != null && parsed?.lng != null) {
            setLat(parsed.lat);
            setLng(parsed.lng);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Ignore JSON / storage errors and fall back to fresh request
      }
    }

    requestPosition();
  }, [requestPosition]);

  return { lat, lng, loading, error, retry: requestPosition };
}

export default useGeolocation;
