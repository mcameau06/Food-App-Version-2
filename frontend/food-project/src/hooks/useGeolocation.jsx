import { useEffect, useState } from 'react';

 const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(()=>{

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    const onSuccess = (e)=>{
      setLoading(false);
      setError(null);
      setLocation({
        lat: e.coords.latitude,
        lng: e.coords.longitude
      });
    }

    const onError = (e) => {
      setError(e.message);
      setLoading(false);
    }

    navigator.geolocation.getCurrentPosition(onSuccess,onError);
  },[]);

 return{lat:location?.lat,lng:location?.lng,error,loading}
};
export default useGeolocation;
