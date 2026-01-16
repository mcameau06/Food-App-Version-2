import styles from "./Search.module.css";
import { useState } from "react";

function Search({onSearch}){
    const [query, setQuery] = useState("");
    
    function handleInput(e){
        setQuery(e.target.value);
    }
    
    function handleSubmit(e){
        e.preventDefault();
        onSearch(query);
    }

    return (
        <div className={styles.searchContainer}>
            <h2 className={styles.title}>What food are you feeling today?</h2>
            <form className={styles.foodForm} onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    id="query" 
                    value={query} 
                    onChange={handleInput} 
                    placeholder="Search for restaurants, cuisines, dishes..."
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>
                    Search
                </button>
            </form>
        </div>
    )
}

export default Search;