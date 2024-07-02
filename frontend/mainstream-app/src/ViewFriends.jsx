import React from 'react';
import { useState, useEffect } from 'react';
import "./ViewFriends.css";
import FollowModal from "./FollowModal";

function ViewFriends( {curUser, login} ) {
    const [following, setFollowing] = useState([]);
    const [userResults, setUserResults] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userToFollow, setUserToFollow] = useState("");
 
    useEffect(() => {
        fetchFollowing();
    }, [login, showModal]);

    const fetchFollowing = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/following/${curUser}`)
        .then(response => {
             if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
             } else {
                return response.json();
              } 
        })
        .then(data => {
            setFollowing(data);
        })
        .catch(error => {
            
        });
    }

    const getUsers = (e) => {
        e.preventDefault();
        let searchName = e.target.elements.searchUser.value;
        if (searchName) {
            fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/users/${searchName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                } else {
                    return response.json();
                } 
            })
            .then(data => {
                setUserResults(data);
            })
            .catch(error => {
                
            });
        } else {
            setUserResults([]);
        }
    }

    const followModal = (user) => {
        setUserToFollow(user);
        setShowModal(!showModal);
    }

    return (
      <div id="viewFriendsContainer">
        <h2>Discover</h2>
        <form onSubmit={(e) => getUsers(e)}>
            <label>search users to follow: </label>
            <input type="text" name="searchUser"></input>
        </form>
        { showModal && <FollowModal closeModal={() => followModal()} userToFollow={userToFollow} curUser={curUser}/>}
        <div>
            {userResults && userResults.map((user) => (
                    <p onClick={() => followModal(user)} id="user">{user}</p>)                        
            )}
        </div>
        <div id="followingContainer">
            <h3>Following: </h3>
            {following.map((follow, index) => (
                    <p id="following">{follow.name}</p>)                        
            )}
        </div>
      </div>
    )
  }
  
export default ViewFriends;