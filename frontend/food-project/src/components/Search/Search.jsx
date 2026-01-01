import styles from "./Search.module.css";
import { useState } from "react";

function Search({onSearch}){

    const [query,setQuery] = useState("");
    
    function handleInput(e){
        setQuery(e.target.value);
    }
    function handleSubmit(e){
        e.preventDefault();
        onSearch(query);
    }

    return (
        <>
        <div className={styles.searchContainer}>
            <h2>What food are you feeling today?</h2>
            <form className={styles.foodForm} onSubmit={handleSubmit}>
            <button type="submit">Search</button>
                <input type="text" id="query" value={query} onChange={handleInput}/>
                {console.log(query)}
            </form>
        </div>
        
        </>
    )
}

export default Search;