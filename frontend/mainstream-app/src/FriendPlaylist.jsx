import React from 'react';
import RateModal from "./RateModal";
import { useState, useEffect } from 'react';
import { Vortex } from 'react-loader-spinner';
import "./FriendPlaylist.css";
import FriendSong from './FriendSong';

function FriendPlaylist({ curUser, friend, showPlaylist }) {
    const [songs, setSongs] = useState([]);
    const [score, setScore] = useState("...");
    const [showModal, setShowModal] = useState(false);
    const [songID, setSongID] = useState();
    const [songPlayer, setSongPlayer] = useState("");
    const [rated, setRated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetchUserSongs();
        fetchUserScore();
    }, [curUser, friend, showPlaylist, rated]);

    /*
    * Fetches songs on user playlist
    */
    const fetchUserSongs = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/songs/${friend}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                return response.json();
            }
        })
        .then(data => {
            setSongs(data);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000)
        })
        .catch(error => {
            setSongs([]);
            setIsLoading(false);
        });
    }

    /*
    * Fetches a user's score
    */
    const fetchUserScore = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/user/${friend}/score`)
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
    * Opens rate modal for selected song to rate
    */
    const goToRate = (id, player) => {
        setSongID(id);
        setSongPlayer(player);
        setShowModal(true);
    }

    /*
    * Closes the modal
    */
    const closeModal = () => {
        setShowModal(false);
    }

    /*
    * Identifies a song as rated
    */
    const markRated = () => {
        setRated(!rated);
    }

    if (isLoading) {
        return (
            <div id="loadingContainer">
                <div class="progress-bar">
                    <div class="circle border">
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div id="playlistContainer">
            <div class="playlistHeaderContainer">
                <h3 class="playlistHeader">{friend}'s playlist</h3>
                <div class="score">
                    <p class="scoreVal">{score}</p>
                </div>
            </div>
            <div id="songsWrapper">
                {songs.map((song) => (
                    <FriendSong curUser={curUser} rated={rated} player={song.player} goToRate={goToRate} songId={song.id}></FriendSong>
                )
                )}
            </div>
            {showModal && <RateModal markRated={() => markRated()} curUser={curUser} friend={friend} songID={songID} player={songPlayer} closeModal={closeModal}></RateModal>}
        </div>
    )
}

export default FriendPlaylist;