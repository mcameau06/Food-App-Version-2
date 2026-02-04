import { useEffect, useState } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [errors, setError] = useState(null);
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
      setError(e);
      setLoading(false)
    }

    navigator.geolocation.getCurrentPosition(onSuccess,onError);
  },[]);

 return{lat:location?.lat,lng:location?.lng,errors,loading}
};

export default useGeolocation;