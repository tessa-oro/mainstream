import React from 'react';
import { useState, useEffect } from 'react';
import "./Playlist.css";

function Playlist( { curUser } ) {
    const [songs, setSongs] = useState([]);

    // use click from profile search to use video ID to fetch video and create new song in user 
    // array of songs. fetch user songs and set to array of of songs. refetch on new songID.
    // for each song, display in playlist.

    useEffect(() => {
        fetchUserSongs();
    }, []);

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
        <h3>Playlist</h3>
        {songs.map((song) => (
            <iframe src={song.player}/>)                          
        )}
      </div>
    )
  }
  
export default Playlist;