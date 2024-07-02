import React from 'react';
import { useState, useEffect } from 'react';
import "./ViewFriends.css";

function ViewFriends( {curUser, login} ) {
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        console.log("fetching following");
        fetchFollowing();
    }, [login]);

    const fetchFollowing = () => {
        console.log("fetch function");
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/following/${curUser}`)
        .then(response => {
             if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
             } else {
                return response.json();
              } 
        })
        .then(data => {
            console.log(data);
            setFollowing(data);
        })
        .catch(error => {
            console.error('Error fetching boards', error);
        });
    }

    return (
      <div id="viewFriendsContainer">
        <h2>Following</h2>
        <form>
            <label>search users: </label>
            <input type="text"></input>
        </form>
        <div id="followingContainer">
        {following.map((follow, index) => (
                <p id="following">{follow.following}</p>)                        
        )}
        </div>
      </div>
    )
  }
  
export default ViewFriends;