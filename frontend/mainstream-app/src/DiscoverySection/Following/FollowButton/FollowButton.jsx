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
    * Unfollow a user in the search section
    */
    const undoFollow = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/unfollow`,
            {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    followedBy: curUser,
                    following: userToFollow
                }),
            })
            .then(response => {
                if (response.ok) {
                    setIcon(faPlus);
                    handleFollow();
                }
            })
            .catch(error => {});
    }

    /*
    * Creates following and follwer relationships
    */
    const createRelationship = () => {
        addToFollowing();
        addToFollowers();
    }

    /*
    * Changes follow state accordingly when plus sign or check mark is clicked
    */
    const changeFollow = () => {
        if (icon === faPlus) {
            createRelationship();
            setIcon(faCheck);
        } else {
            undoFollow();
        }
    }

    return (
        <div style={{ fontSize: '24px', cursor: 'pointer' }} onClick={changeFollow}>
            <FontAwesomeIcon icon={icon} />
        </div>
    );
}
export default FollowButton;