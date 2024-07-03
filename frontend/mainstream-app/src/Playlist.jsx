import React from 'react';
import { useState, useEffect } from 'react';
import "./Playlist.css";

function Playlist( { curUser } ) {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        fetchUserSongs();
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

    return (
      <div id="playlistContainer">
        <h3>{curUser}'s playlist</h3>
        {songs.map((song) => (
            <div id="songPlayer" dangerouslySetInnerHTML={{ __html: song.player }} />)                          
        )}
      </div>
    )
  }
  
export default Playlist;