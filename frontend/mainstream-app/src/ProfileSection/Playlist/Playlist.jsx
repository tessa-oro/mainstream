import React from 'react';
import { useState, useEffect } from 'react';
import "./Playlist.css";

function Playlist({ refetch, curUser }) {
    const [songs, setSongs] = useState([]);
    const [score, setScore] = useState("...");

    useEffect(() => {
        fetchUserSongs();
        fetchUserScore();
    }, [curUser, refetch]);

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

    /*
    * Deletes a song from playlist and refetches user playlist
    */
    const deleteSong = (songId) => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/deleteSong`,
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    songId: songId
                }),
            })
            .then(response => {
                if (response.ok) {
                    fetchUserSongs();
                }
            })
            .catch(error => {});
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
                <>
                    <div id="songPlayer" dangerouslySetInnerHTML={{ __html: song.player }} />
                    <button onClick={() => deleteSong(song.id)}>delete</button>
                </>)
            )}
        </div>
    )
}

export default Playlist;