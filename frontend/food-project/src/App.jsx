import { useState,useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar';
import Search from './components/Search/Search';
import useGeolocation from './hooks/useGeolocation';
import Results from './components/Results/Results';
function App() {
  
  const {lat,lng,error, loading} = useGeolocation();
  const [results, setResults] = useState(null);
  
  async function handleSearch(query){
    try {
      const result = await searchFood(query,lat,lng);
      setResults(result);
      console.log(result);
    }
    catch(err){
      console.log(err);
    }
    
  }
  
  useEffect(( () =>{
    
  }),[]);


  
  async function searchFood(query,lat,lng){
    const API_BASE_URL = 'http://127.0.0.1:8000';
    let url = `${API_BASE_URL}/search?query=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}`;
  
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    }
    catch(error){
      console.error(error);
      return [];
    }
  
  }
  

  return (
    <>
    <Navbar />

    <main className='main-container'>
      {results ? <Results foodResults={results}/>:<Search onSearch = {handleSearch} /> }
    </main>
    </>
  )
}

export default App
