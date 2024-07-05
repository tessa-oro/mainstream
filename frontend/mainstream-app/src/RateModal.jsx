import "./RateModal.css";
import React from "react";
import { useState, useEffect } from 'react';

const RateModal = ({ songID, closeModal}) => {

    return (
        <>
            <div id="followModal">
                <div id="modalContent">
                    <h2>Rate song</h2>
                    <form id="rateForm">
                        <div id="rateButtons">
                                <button>1</button>
                                <button>2</button>
                                <button>3</button>
                                <button>4</button>
                                <button>5</button>
                                <button>6</button>
                                <button>7</button>
                                <button>8</button>
                                <button>9</button>
                                <button>10</button>
                        </div>
                        <input type="checkbox"></input>
                        <label>I already know this song</label>
                   </form>
                </div>
                <button id="close" onClick={closeModal}>cancel</button>
            </div>
            <div id="overlay"></div>
        </>
    );
}

export default RateModal;