import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import LoginPage from './components/LoginPage/LoginPage'
import useGeolocation from './hooks/useGeolocation'
import Results from './components/Results/Results'

function AppContent() {
  const navigate = useNavigate()
  const {lat, lng, error, loading} = useGeolocation()
  const [results, setResults] = useState(null)
  
  async function handleSearch(query){
    try {
      const result = await searchFood(query, lat, lng)
      setResults(result)
      navigate('/results')
    }
    catch(err){
      console.log(err)
    }
  }
  
  async function searchFood(query, lat, lng){
    const API_BASE_URL = 'http://127.0.0.1:8000'
    let url = `${API_BASE_URL}/api/v1/search?query=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}`
  
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    }
    catch(error){
      console.error(error)
      return []
    }
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home searchFunction={handleSearch} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/results" element={<Results foodResults={results} />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
