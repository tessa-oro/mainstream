import "./UserAnalysisModal.css";
import React from "react";
import { useState, useEffect } from 'react';

const UserAnalysisModal = ({ closeModal, curUser }) => {
    const [analysisResult, setAnalysisResult] = useState("");

    useEffect(() => {
        fetchUserAnalysis();
    }, [curUser]);

    const fetchUserAnalysis = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/userAnalysis/${curUser}`)
        .then(response => response.json())
        .then(data => {
            setAnalysisResult(data);
        })
        .catch(error => {
            setAnalysisResult("no analysis to show");
        });
    }

    return (
        <>
            <div id="analysisModal">
                <div id="modalContent">
                    {analysisResult && <p>{analysisResult}</p>}
                </div>
                <button id="close" onClick={closeModal}>cancel</button>
            </div>
            <div id="overlay"></div>
        </>
    );
}

export default UserAnalysisModal;