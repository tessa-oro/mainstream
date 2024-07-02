import "./FollowModal.css";
import React from "react";
import { useState, useEffect } from 'react';

const FollowModal = ({ closeModal, userToFollow, curUser }) => {
    const [result, setResult] = useState("");
    const [follower, setFollower] = useState(curUser);
    const [following, setFollowing] = useState(userToFollow);

    const createRelationship = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/follow`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                follower,
                following,
            }),
        })
        .then(response => {
            console.log(response)
            if (response.ok) {
                setResult(`following ${userToFollow}!`);
                console.log("following");
            } else {
                setResult("failed to follow");
            }
        })
        .catch(error => {
            setResult("failed to follow");
        });
    }

    return (
        <>
            <div id="followModal">
                <p id="close" onClick={closeModal}>&times;</p>
                <div id="modalContent">
                    <h2>follow {userToFollow}?</h2>
                    <button onClick={() => createRelationship()}>yes</button>
                    <button>cancel</button>
                </div>
                {result && <p id="result">{result}</p>}
            </div>
            <div id="overlay"></div>
        </>
    );
}

export default FollowModal;