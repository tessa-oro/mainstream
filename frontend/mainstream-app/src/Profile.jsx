import React from 'react';
import { useState, useEffect } from 'react';
import "./Profile.css";

function Profile() {
    const [searchQuery, setSearchQuery] = useState("");
    const [search, setSearch] = useState([]);

    useEffect(() => {
        fetchSearch();
        console.log(searchQuery)
    }, [searchQuery]);

    const key = import.meta.env.VITE_API_KEY;

    const fetchSearch = () => {
        console.log("fetching")
        let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=AIzaSyD9ZWWiNhlyqM-qoWv3YEcLxGQ8IEB5B-o`;
        fetch(url)
            .then(response => response.json())
            .then(response => {setSearch(response.data);
                console.log(response);
            })
            .catch(err => console.error(err));
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(e.target.elements.searchQ.value);
    }

    console.log(search);


    return (
      <div id="profileContainer">
        <h2>my profile</h2>
        <form onSubmit={(e) => handleSearch(e)}>
            <input name="searchQ"></input>
        </form>
      </div>
    )
}
  
export default Profile;