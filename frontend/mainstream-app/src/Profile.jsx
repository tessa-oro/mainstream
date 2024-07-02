import React from 'react';
import { useState, useEffect } from 'react';
import "./Profile.css";
import Playlist from "./Playlist";

function Profile( {curUser} ) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [playerToAdd, setPlayerToAdd] = useState("");
    const [toAddTitle, setToAddTitle] = useState("addLater");
    const [result, setResult] = useState("");

    useEffect(() => {
        fetchSearch();
    }, [searchQuery]);

    const fetchSearch = () => {
        let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&maxResults=3&type=video&videoCategoryId=10&key=${import.meta.env.VITE_API_KEY}`;
        fetch(url)
            .then(response => response.json())
            .then(response => {setSearchResult(response.items);
            })
            .catch(err => {});
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(e.target.elements.searchQ.value + " " + e.target.elements.searchA.value);
    }

    const fetchSong = (vidID) => {
        let url = `https://www.googleapis.com/youtube/v3/videos?part=player&id=${vidID}&key=${import.meta.env.VITE_API_KEY}`;
        fetch(url)
            .then(response => response.json())
            .then(response => {
                setPlayerToAdd(response.items[0].player.embedHtml);
            })
            .catch(err => {});
        addSongToUser();
    }

    const addSongToUser = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/songs/${curUser}/create/`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                toAddTitle,
                playerToAdd
            }),
        })
        .then(response => {
            if (response.ok) {
                setResult("added song!");
            } else {
                setResult("failed to add song");
            }
        })
        .catch(error => {
            setResult("failed to add song");
        });
    }


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
        {searchResult && <div>
            {searchResult.map((searchResult, index) => (
                <p onClick={fetchSong(searchResult.id.videoId)}>{searchResult.snippet.title}</p>)                          
            )}
        </div>}
        <Playlist curUser={curUser}></Playlist>
      </div>
    )
}
  
export default Profile;