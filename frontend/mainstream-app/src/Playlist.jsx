import React from 'react';
import { useState, useEffect } from 'react';
import "./Playlist.css";

function Playlist( { curUser } ) {
    const [songs, setSongs] = useState([]);
    const [score, setScore] = useState("...");

    useEffect(() => {
        fetchUserSongs();
        fetchUserScore();
    });

    /*
    * Fetches songs on user playlist
    */
    const fetchUserSongs = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/songs/${curUser}`)
        .then(response => {
             if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
             } else {
                return response.json();
              } 
        })
        .then(data => {
            setSongs(data);
        })
        .catch(error => {
        });
    }

    /*
    * Fetches a user's score
    */
    const fetchUserScore = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/user/${curUser}/score`)
        .then(response => {
             if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
             } else {
                return response.json();
              } 
        })
        .then(data => {
            setScore(parseFloat(data));
        })
        .catch(error => {
        });
    }

    return (
      <div id="playlistContainer">
        <h3>{curUser}'s playlist</h3>
        <p>score: {score}</p>
        {songs.map((song) => (
            <div id="songPlayer" dangerouslySetInnerHTML={{ __html: song.player }} />)                          
        )}
      </div>
    )
  }
  
export default Playlist;