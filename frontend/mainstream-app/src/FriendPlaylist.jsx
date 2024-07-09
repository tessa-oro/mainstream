import React from 'react';
import RateModal from "./RateModal";
import { useState, useEffect } from 'react';
import "./FriendPlaylist.css";

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
        <h3 class="playlistHeader">{curUser}'s playlist</h3>
        <p>score: {score}</p>
        {songs.map((song) => (
            <div id="songBorder">
                <div id="songPlayerFollowing" dangerouslySetInnerHTML={{ __html: song.player }} />
                <button id="rate" onClick={() => goToRate(song.id)}>rate song</button>
            </div>
        )                          
        )}
        {showModal && <RateModal curUser={curUser} songID={songID} closeModal={closeModal}></RateModal>}
      </div>
    )
  }
  
export default FriendPlaylist;