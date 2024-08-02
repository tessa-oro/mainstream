import "./RateModal.css";
import React from "react";
import { useState, useEffect } from 'react';

const RateModal = ({ curUser, friend, songID, closeModal, markRated, player }) => {
    const [num, setNum] = useState("");
    const [check, setCheck] = useState(false);
    const [subScore, setSubScore] = useState(0);

    /*
    * Adds submitted rating to a song's collection of ratings using PATCH
    */
    const handleRate = (e) => {
        e.preventDefault();
        let rating = (num - subScore) > 0 ? (num - subScore) : (1);
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/song/rate/${friend}/${curUser}/${songID}/${rating}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                return response.json();
            }
        })
        .then(data => {
            markRated();
            createInteraction(rating);
        })
        .then(done => {
            closeModal();
        })
        .catch(error => {
        });
    }

    /*
    * Stores interaction in database when song is rated
    */
    const createInteraction = (rating) => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/interaction`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: curUser,
                    songItem: player,
                    rating: rating
                }),
            })
            .catch(error => {
            });
    }

    /*
    * Sets the currently selected rating
    */
    const pickNum = (e) => {
        setNum(e.target.value);
    }

    /*
    * Marks that a user already knows a song
    */
    const handleCheck = (e) => {
        setCheck(e.target.checked);
        if (e.target.checked) {
            setSubScore(1);
        } else {
            setSubScore(0);
        }
    }

    return (
        <>
            <div id="rateModal">
                <div id="modalContent">
                    <h2 id="rateHeader">Rate song</h2>
                    <form id="rateForm" onSubmit={(e) => handleRate(e)}>
                        <div className="rating">
                            <input type="radio" id="star5" name="rating" value="5" onClick={(e) => pickNum(e)}></input>
                            <label for="star5">&#9733;</label>
                            <input type="radio" id="star4" name="rating" value="4" onClick={(e) => pickNum(e)}></input>
                            <label for="star4">&#9733;</label>
                            <input type="radio" id="star3" name="rating" value="3" onClick={(e) => pickNum(e)}></input>
                            <label for="star3">&#9733;</label>
                            <input type="radio" id="star2" name="rating" value="2" onClick={(e) => pickNum(e)}></input>
                            <label for="star2">&#9733;</label>
                            <input type="radio" id="star1" name="rating" value="1" onClick={(e) => pickNum(e)}></input>
                            <label for="star1">&#9733;</label>
                        </div>
                        <input type="checkbox" onChange={(e) => handleCheck(e)}></input>
                        <label id="markKnown">I already know this song</label>
                        <button id="submit" type="submit">Submit</button>
                    </form>
                    <button id="closeRate" onClick={closeModal}>cancel</button>
                </div>
            </div>
            <div id="overlay"></div>
        </>
    );
}

export default RateModal;