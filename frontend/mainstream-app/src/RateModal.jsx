import "./RateModal.css";
import React from "react";
import { useState, useEffect } from 'react';

const RateModal = ({ songID, closeModal}) => {
    const [num, setNum] = useState("");

    const handleRate = (e) => {
        e.preventDefault();
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/song/rate/${songID}/${num}`,
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
            console.log(data);
            closeModal();
        })
        .catch(error => {
            console.error('Error fetching post', error);
        });
    }

    const pickNum = (e) => {
        e.preventDefault();
        setNum(e.target.value);
    }

    return (
        <>
            <div id="rateModal">
                <div id="modalContent">
                    <h2>Rate song</h2>
                    <form id="rateForm" onSubmit={(e) => handleRate(e)}>
                        <div id="rateButtons">
                                <button type="button" value="1" onClick={(e) => pickNum(e)}>1</button>
                                <button type="button" value="2" onClick={(e) => pickNum(e)}>2</button>
                                <button type="button" value="3" onClick={(e) => pickNum(e)}>3</button>
                                <button type="button" value="4" onClick={(e) => pickNum(e)}>4</button>
                                <button type="button" value="5" onClick={(e) => pickNum(e)}>5</button>
                                <button type="button" value="6" onClick={(e) => pickNum(e)}>6</button>
                                <button type="button" value="7" onClick={(e) => pickNum(e)}>7</button>
                                <button type="button" value="8" onClick={(e) => pickNum(e)}>8</button>
                                <button type="button" value="9" onClick={(e) => pickNum(e)}>9</button>
                                <button type="button" value="10" onClick={(e) => pickNum(e)}>10</button>
                        </div>
                        {num && <p id="selectedNum">{num}</p>}
                        <input type="checkbox"></input>
                        <label>I already know this song</label>
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