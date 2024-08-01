import React from 'react';
import { useState, useEffect } from 'react';
import "./Profile.css";
import Playlist from "../Playlist/Playlist";
import { Link } from 'react-router-dom';
import UserAnalysisModal from '../UserAnalysisModal/UserAnalysisModal';

function Profile({ curUser, handleLogout }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [searched, setSearched] = useState(false);
    const [result, setResult] = useState("");
    const [songAdded, setSongAdded] = useState("");
    const [clicked, setClicked] = useState(false);
    const [searchQ, setSearchQ] = useState("");
    const [searchA, setSearchA] = useState("");
    const [showAnalysis, setShowAnalysis] = useState(false);

    useEffect(() => {
        fetchSearch();
    }, [searchQuery]);

    useEffect(() => {
        clearSearch();
    }, [curUser]);

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
        setSearchQuery(searchQ + searchA);
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
            addSongToUser(songData.player.embedHtml, songData.statistics, songData.snippet.tags, vidID);
            setSongAdded(response.items[0].player.embedHtml);
        })
        .catch(err => { });
    }

    /*
    * Adds the selected song to the user playlist in database
    */
    const addSongToUser = (playerToAdd, stats, tags, vidID) => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/songs/${curUser}/create/`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    player: playerToAdd,
                    stats: stats,
                    tags: tags,
                    vidID: vidID
                }),
            })
            .then(response => {
                if (response.ok) {
                    setClicked(!clicked);
                    addSongItem(playerToAdd);
                    clearSearch();
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
        setSearchQ("");
        setSearchA("");
        setSearched(false);
    }

    const changeModal = () => {
        setShowAnalysis(!showAnalysis);
    }

    return (
        <div id="profileContainer">
            <div id="logoutContainer">
                <Link to='/'>
                    <button id="logoutButton" onClick={() => handleLogout()}>Logout</button>
                </Link>
            </div>
            <p id="profileHeader">Profile</p>
            <div id="iconNameContainer">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                <mask id="mask0_1_96" maskType="alpha" maskUnits="userSpaceOnUse" x="1" y="3" width="34" height="33">
                    <circle cx="18" cy="19.5" r="15" fill="#D9D9D9" stroke="black" strokeWidth="3" />
                </mask>
                <g mask="url(#mask0_1_96)">
                    <circle cx="18" cy="15" r="3.75" stroke="black" stroke-width="3"/>
                    <circle cx="18" cy="33.75" r="12.75" stroke="black" stroke-width="3"/>
                </g>
                <circle cx="18" cy="18" r="16.5" stroke="black" stroke-width="3"/>
                </svg>
                <p id="profileName">{curUser}</p>
            </div>
            <div id="searchSongSection">
                <p id="searchSongPrompt">Create your stream</p>
                <form onSubmit={(e) => handleSearch(e)} id="searchForm">
                    <div id="searchInputs">
                        <input name="searchQ" className="searchBox" value={searchQ} required placeholder="Add song title" onChange={((e) => setSearchQ(e.target.value))}></input>
                        <input name="searchA" className="searchBox" value={searchA} required placeholder="Add artist" onChange={((e) => setSearchA(e.target.value))}></input>
                    </div>
                    <button id="goSearch" type="submit" value="Submit">Search</button>
                </form>
                {searchResult && <div>
                    {searchResult.map((searchResult, index) => (
                        <p id="searchResult" onClick={() => fetchSong(searchResult.id.videoId)}>{searchResult.snippet.title}</p>)
                    )}
                </div>}
                {searched && <button id="clearSearchButton" onClick={() => clearSearch()}>cancel</button>}
            </div>
            <button id="analyzeButton" onClick={() => changeModal()} >~Analyze my music taste~</button>
            { showAnalysis && <UserAnalysisModal closeModal={() => changeModal()} curUser={curUser}></UserAnalysisModal> }
            <Playlist refetch={clicked} curUser={curUser}></Playlist>
        </div>
    )
}

export default Profile;