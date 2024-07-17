import React from 'react';
import { useState, useEffect } from 'react';
import "./FriendSong.css";


function FriendSong({ curUser, player, goToRate, songId, rated }) {
    const [ratedBy, setRatedBy] = useState([]);

    useEffect(() => {
        fetchRatedBy();
    }, [curUser, rated, player]);

    /*
    * Fetches array of users who have rated song
    */
    const fetchRatedBy = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/song/ratedBy/${songId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                return response.json();
            }
        })
        .then(data => {
            setRatedBy(data);
        })
        .catch(error => {
        });
    }

    return (
        <div id="songBorder">
            <div id="songPlayerFollowing" dangerouslySetInnerHTML={{ __html: player }} />
            {!(ratedBy.includes(curUser)) && <button id="rate" onClick={() => { goToRate(songId); }}>rate song</button>}
        </div>
    )
}

export default FriendSong;