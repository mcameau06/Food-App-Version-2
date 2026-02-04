import React, { useState } from 'react';
import SearchForm from './components/Search/SearchForm';
import Results from './components/Results/Results';
import RestaurantMap from './components/Map/Map';
import Navbar from './components/Navbar/Navbar';
import useGeolocation from './hooks/useGeolocation';
import { searchFood } from './services/api';
import Favorites from './components/Favorites/Favorites';
import './App.css';

function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { lat,lng,errors,loading } = useGeolocation();
  const [showFavorites, setShowFavorites] = useState(false);
  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    
    try {
      
      const searchResults = await searchFood(query, lat, lng);
      setResults(searchResults);
      
      
    } catch (err) {
      console.log(errors);
      setError(err.message || 'An error occurred');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='App'>
      <Navbar/>
      <button onClick={() => setShowFavorites(!showFavorites)}>
        {showFavorites ? '← Back' : 'Favorites'}
      </button>


       <div className='foodContainer'>
  {showFavorites ? (
    <Favorites/> 
  ) : ( 
    <>
      {results ? (
        <>
          <Results results={results} isLoading={isLoading} error={error}/>
          <RestaurantMap/>
        </>
      ) : (
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      )}   
    </>    
  )}
</div>

    </div>
  );
}

export default App;
