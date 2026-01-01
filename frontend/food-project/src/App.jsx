import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar';
import Search from './components/Search/Search';
function App() {
  

  async function handleSearch(query){
    console.log(query);
  }

  return (
    <>
    <Navbar />

    <main className='main-container'>
      <Search onSearch = {handleSearch} />
    </main>
    </>
  )
}

export default App
