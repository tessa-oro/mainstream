import "./UserAnalysisModal.css";
import React from "react";
import { useState, useEffect } from 'react';

const UserAnalysisModal = ({ closeModal }) => {

    return (
        <>
            <div id="analysisModal">
                <div id="modalContent">
                </div>
                <button id="close" onClick={closeModal}>cancel</button>
            </div>
            <div id="overlay"></div>
        </>
    );
}

export default UserAnalysisModal;