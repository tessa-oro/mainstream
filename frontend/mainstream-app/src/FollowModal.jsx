import "./FollowModal.css";
import React from "react";
import { useState, useEffect } from 'react';

const FollowModal = ({ closeModal, userToFollow, curUser }) => {
    const [result, setResult] = useState("");
    const [follower, setFollower] = useState(curUser);
    const [following, setFollowing] = useState(userToFollow);

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
            console.log(response)
            if (response.ok) {
                setResult(`following ${following}!`);
                console.log("following");
            } else {
                setResult("failed to follow");
            }
        })
        .catch(error => {
            setResult("failed to follow");
        });
    }

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
            console.log(response)
            if (response.ok) {
                console.log("one of their followers");
            } else {
                setResult("not a follower");
            }
        })
        .catch(error => {
            setResult("not a follower");
        });
    }

    const createRelationship = () => {
        console.log(follower);
        console.log(following);
        addToFollowing();
        addToFollowers();
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