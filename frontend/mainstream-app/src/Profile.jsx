import React from 'react';
import { useState, useEffect } from 'react';
import "./Profile.css";

function Profile() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        fetchSearch();
        console.log(searchQuery)
    }, [searchQuery]);

    const key = import.meta.env.VITE_API_KEY;

    const fetchSearch = () => {
        console.log("fetching")
        let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&videoCategoryId=10&key=${import.meta.env.VITE_API_KEY}`;
        fetch(url)
            .then(response => response.json())
            .then(response => {setSearchResult(response.items);
                console.log(response);
            })
            .catch(err => console.error(err));
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(e.target.elements.searchQ.value + " " + e.target.elements.searchA.value);
    }

    console.log(searchResult);


    return (
      <div id="profileContainer">
        <h2>my profile</h2>
        <p>Search songs to recommend to your friends!</p>
        <form onSubmit={(e) => handleSearch(e)}>
            <label>Song title</label>
            <input name="searchQ" required></input>
            <label>Artist</label>
            <input name="searchA" required></input>
            <button type="submit" value="Submit">Go</button>
        </form>
        <div>
            {searchResult.map((searchResult, index) => (
                <p>{searchResult.snippet.title}</p>)                          
            )}
        </div>
      </div>
    )
}
  
export default Profile;