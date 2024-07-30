import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';

function FollowButton({ userToFollow, curUser, handleFollow }) {
    const [result, setResult] = useState("");
    const [follower, setFollower] = useState(curUser);
    const [following, setFollowing] = useState(userToFollow);
    const [icon, setIcon] = useState(faPlus);

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
                    handleFollow();
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

    const toggleIcon = () => {
        setIcon(icon === faPlus ? faCheck : faPlus);
        createRelationship();
    }

    return (
        <div style={{ fontSize: '24px', cursor: 'pointer' }} onClick={toggleIcon}>
            <FontAwesomeIcon icon={icon} />
        </div>
    );
}
export default FollowButton;