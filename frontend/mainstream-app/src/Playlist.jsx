import React from 'react';
import { useState, useEffect } from 'react';
import "./Playlist.css";

function Playlist( { curUser } ) {
    const [songs, setSongs] = useState([]);
    const [score, setScore] = useState("...");

    useEffect(() => {
        fetchUserSongs();
        fetchUserScore();
    }, [curUser]);

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
            setSongs([]);
            setScore("...");
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
            if (parseFloat(data) === 0) {
                setScore("...");
            } else {
                setScore(parseFloat(data));
            }
        })
        .catch(error => {
        });
    }

    return (
      <div id="playlistContainer">
        <div class="playlistHeaderContainer">
            <h3 class="playlistHeader">{curUser}'s playlist</h3>
            <div class="score">
                <p class="scoreVal">{score}</p>
            </div>
        </div>
        {songs.map((song) => (
            <div id="songPlayer" dangerouslySetInnerHTML={{ __html: song.player }} />)                          
        )}
      </div>
    )
  }
  
export default Playlist;