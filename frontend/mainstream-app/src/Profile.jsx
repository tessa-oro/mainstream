import React from 'react';
import { useState, useEffect } from 'react';
import "./Profile.css";
import Playlist from "./Playlist";

function Profile({ curUser, handleLogout }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [searched, setSearched] = useState(false);
    const [result, setResult] = useState("");
    const [songAdded, setSongAdded] = useState("");
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        fetchSearch();
    }, [searchQuery]);

    /*
    * Fetches youtube search results that match search query
    */
    const fetchSearch = () => {
        if (searchQuery.trim().length !== 0) {
            let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&maxResults=3&type=video&videoCategoryId=10&key=${import.meta.env.VITE_API_KEY}`;
            fetch(url)
            .then(response => response.json())
            .then(response => {
                setSearchResult(response.items);
            })
            .catch(err => { });
        } else {
            setSearchResult([]);
        }
    }

    /*
    * Sets search query to the inputted title and artist 
    */
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(e.target.elements.searchQ.value + e.target.elements.searchA.value);
        setSearched(true);
    }

    /*
    * Fetches video info for the selected song and sets the embed html to add to database
    */
    const fetchSong = (vidID) => {
        let url = `https://www.googleapis.com/youtube/v3/videos?part=player,statistics,snippet&id=${vidID}&key=${import.meta.env.VITE_API_KEY}`;
        fetch(url)
        .then(response => response.json())
        .then(response => {
            const songData = response.items[0];
            addSongToUser(songData.player.embedHtml, songData.statistics, songData.snippet.tags);
            setSongAdded(response.items[0].player.embedHtml);
        })
        .catch(err => { });
    }

    /*
    * Adds the selected song to the user playlist in database
    */
    const addSongToUser = (playerToAdd, stats, tags) => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/songs/${curUser}/create/`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    player: playerToAdd,
                    stats: stats,
                    tags: tags
                }),
            })
            .then(response => {
                if (response.ok) {
                    setClicked(!clicked);
                    addSongItem(playerToAdd);
                    setResult("added to playlist!");
                } else {
                    setResult("failed to add song");
                }
            })
            .catch(error => {
                setResult("failed to add song");
            });
    }

    const addSongItem = (playerToAdd) => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/songItem`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    playerID: playerToAdd
                }),
            })
            .then(response => {
                if (response.ok) {
                    createInteraction(playerToAdd);
                }
            })
            .catch(error => {
            });
    }

    /*
    * Clears search query variable
    */
    const clearSearch = () => {
        setSearchQuery("");
        setResult("");
        setSearched(false);
    }

    return (
        <div id="profileContainer">
            <div id="logoutContainer">
                <button id="logoutButton" onClick={() => handleLogout()}>logout</button>
            </div>
            <h2 id="profileHeader">{curUser}</h2>
            <div id="searchSongSection">
                <p id="searchSongPrompt">Search songs to recommend to your friends!</p>
                <form onSubmit={(e) => handleSearch(e)} id="searchForm">
                    <div>
                        <input name="searchQ" required placeholder="Song title"></input>
                        <input name="searchA" required placeholder="Artist"></input>
                    </div>
                    <button id="goSearch" type="submit" value="Submit">Go</button>
                </form>
                {searchResult && <div>
                    {searchResult.map((searchResult, index) => (
                        <p id="searchResult" onClick={() => fetchSong(searchResult.id.videoId)}>{searchResult.snippet.title}</p>)
                    )}
                </div>}
                {searched && <button id="clearSearchButton" onClick={() => clearSearch()}>Clear search</button>}
            </div>
            <Playlist refetch={clicked} curUser={curUser}></Playlist>
        </div>
    )
}

export default Profile;