import "./FollowModal.css";
import React from "react";
import { useState, useEffect } from 'react';

const FollowModal = ({ closeModal, userToFollow }) => {

    return (
        <>
            <div id="followModal">
                <p id="close" onClick={closeModal}>&times;</p>
                <div id="modalContent">
                    <h2>follow {userToFollow}?</h2>
                </div>
            </div>
            <div id="overlay"></div>
        </>
    );
}

export default FollowModal;