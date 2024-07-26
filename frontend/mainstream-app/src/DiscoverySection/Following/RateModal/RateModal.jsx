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
        e.preventDefault();
        setNum(e.target.value);
    }

    /*
    * Marks that a user already knows a song
    */
    const handleCheck = (e) => {
        setCheck(e.target.checked);
        if (e.target.checked) {
            setSubScore(2);
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
                        <div id="rateButtons">
                            <button id="score1" className="scoreButton" type="button" value="1" onClick={(e) => pickNum(e)}>1</button>
                            <button id="score2" className="scoreButton" type="button" value="2" onClick={(e) => pickNum(e)}>2</button>
                            <button id="score3" className="scoreButton" type="button" value="3" onClick={(e) => pickNum(e)}>3</button>
                            <button id="score4" className="scoreButton" type="button" value="4" onClick={(e) => pickNum(e)}>4</button>
                            <button id="score5" className="scoreButton" type="button" value="5" onClick={(e) => pickNum(e)}>5</button>
                            <button id="score6" className="scoreButton" type="button" value="6" onClick={(e) => pickNum(e)}>6</button>
                            <button id="score7" className="scoreButton" type="button" value="7" onClick={(e) => pickNum(e)}>7</button>
                            <button id="score8" className="scoreButton" type="button" value="8" onClick={(e) => pickNum(e)}>8</button>
                            <button id="score9" className="scoreButton" type="button" value="9" onClick={(e) => pickNum(e)}>9</button>
                            <button id="score10" className="scoreButton" type="button" value="10" onClick={(e) => pickNum(e)}>10</button>
                        </div>
                        {num && <p id="selectedNum">{num}</p>}
                        <input type="checkbox" onChange={(e) => handleCheck(e)}></input>
                        <label id="markKnown">I already know this song</label>
                        <button id="submit" type="submit">Submit</button>
                    </form>
                </div>
                <button id="close" onClick={closeModal}>cancel</button>
            </div>
            <div id="overlay"></div>
        </>
    );
}

export default RateModal;