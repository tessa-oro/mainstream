import "./FollowModal.css";
import React from "react";
import { useState, useEffect } from 'react';

const FollowModal = ({ closeModal, userToFollow, curUser }) => {
    const [result, setResult] = useState("");
    const [follower, setFollower] = useState(curUser);
    const [following, setFollowing] = useState(userToFollow);

    /*
    * Adds the selected user to the following list of the current user.
    */
    const addToFollowing = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/following/${follower}`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: following
            }),
        })
        .then(response => {
            if (response.ok) {
                setResult(`following ${following}!`);
            } else {
                setResult("already following");
            }
        })
        .catch(error => {
            setResult("could not follow");
        });
    }

    /*
    * Adds the current user to the follower list of the selected user.
    */
    const addToFollowers = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/follower/${following}`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: follower
            }),
        })
        .then(response => {
            if (response.ok) {
                setResult("following!");
                closeModal();
            } else {
                setResult("already following");
            }
        })
        .catch(error => {
            setResult("already following");
        });
    }

    /*
    * Creates following and follwer relationships
    */
    const createRelationship = () => {
        addToFollowing();
        addToFollowers();
    }

    return (
        <>
            <div id="followModal">
                <div id="modalContent">
                    <h2>follow {userToFollow}?</h2>
                    <button onClick={() => createRelationship()}>yes</button>
                    <button onClick={closeModal}>cancel</button>
                </div>
                <div>
                {result && <p id="result">{result}</p>}
                </div>
            </div>
            <div id="overlay"></div>
        </>
    );
}

export default FollowModal;