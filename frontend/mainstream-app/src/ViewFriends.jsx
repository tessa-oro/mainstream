import React from 'react';
import { useState, useEffect } from 'react';
import "./ViewFriends.css";

function ViewFriends( {curUser, login} ) {
    const [following, setFollowing] = useState([]);
    const [userResults, setUserResults] = useState([]);

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
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching boards', error);
            });
        } else {
            setUserResults([]);
        }
    }

    return (
      <div id="viewFriendsContainer">
        <h2>Following</h2>
        <form onSubmit={(e) => getUsers(e)}>
            <label>search users: </label>
            <input type="text" name="searchUser"></input>
        </form>
        <div>
            {userResults && userResults.map((user) => (
                    <p id="user">{user}</p>)                        
            )}
        </div>
        <div id="followingContainer">
        {following.map((follow, index) => (
                <p id="following">{follow.following}</p>)                        
        )}
        </div>
      </div>
    )
  }
  
export default ViewFriends;