import "./UserAnalysisModal.css";
import React from "react";
import { useState, useEffect } from 'react';
import background from '/Users/tessaoro/Desktop/capstone/mainstream/frontend/mainstream-app/assets/lbBg.mp4';

const UserAnalysisModal = ({ closeModal, curUser }) => {
    const [analysisResult, setAnalysisResult] = useState("");
    const [topEmotion, setTopEmotion] = useState("");

    useEffect(() => {
        fetchUserAnalysis();
        fetchTopEmotion();
    }, [curUser]);

    /*
    * Fetch a user's playlist analysis using GET
    */
    const fetchUserAnalysis = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/userAnalysis/${curUser}`)
        .then(response => response.json())
        .then(data => {
            setAnalysisResult(data);
        })
        .catch(error => {
            setAnalysisResult("No analysis to show");
        });
    }

    /*
    * Fetch a user's top emotion using GET
    */
    const fetchTopEmotion = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/topEmotion/${curUser}`)
        .then(response => response.json())
        .then(data => {
            setTopEmotion("The most prevalent emotion in your playlist is: " + JSON.stringify(data).replace(/["]/g, ''));
        })
        .catch(error => {
            setTopEmotion("Cannot get top emotion");
        });
    }

    return (
        <>
            <div id="analysisModal">
                <video id="analysisVid" autoPlay loop muted>
                    <source src={background} type='video/mp4'></source>
                </video>
                <div id="modalContent">
                    {topEmotion && <h3>{topEmotion}</h3>}
                    {analysisResult && <p className="analysisPlayer" dangerouslySetInnerHTML={{ __html: analysisResult }}></p>}
                </div>
                <button id="closeAnalysis" onClick={closeModal}>close</button>
            </div>
            <div id="overlay"></div>
        </>
    );
}

export default UserAnalysisModal;