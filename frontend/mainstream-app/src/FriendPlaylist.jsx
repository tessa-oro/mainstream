import React from 'react';
import RateModal from "./RateModal";
import { useState, useEffect } from 'react';
import "./FriendPlaylist.css";
import FriendSong from './FriendSong';

function FriendPlaylist( { curUser } ) {
    const [songs, setSongs] = useState([]);
    const [score, setScore] = useState("...");
    const [showModal, setShowModal] = useState(false);
    const [songID, setSongID] = useState();

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
    
    /*
    * Opens rate modal for selected song to rate
    */
    const goToRate = (id) => {
        setSongID(id);
        setShowModal(true);
    }

    /*
    * Closes the modal
    */
    const closeModal = () => {
        setShowModal(false);
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
            <FriendSong player={song.player} goToRate={goToRate} songId={song.id}></FriendSong>
        )                          
        )}
        {showModal && <RateModal curUser={curUser} songID={songID} closeModal={closeModal}></RateModal>}
      </div>
    )
  }
  
export default FriendPlaylist;