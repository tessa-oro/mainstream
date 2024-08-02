import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import "./ViewFriends.css";
import FriendPlaylist from "../FriendPlaylist/FriendPlaylist";
import FollowButton from '../FollowButton/FollowButton';

function ViewFriends({ curUser, login }) {
    const [following, setFollowing] = useState([]);
    const [userResults, setUserResults] = useState([]);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [selectedFollowing, setSelectedFollowing] = useState("");
    const [showFollowing, setShowFollowing] = useState(false);
    const [showClear, setShowClear] = useState(false);
    const [searchQ, setSearchQ] = useState("");
    const [changeFollow, setChangeFollow] = useState(false);
    let { url } = useRouteMatch();

    useEffect(() => {
        fetchFollowing();
    }, [login, curUser, changeFollow, selectedFollowing, userResults]);

    useEffect(() => {
        clearSearch();
    }, [curUser, selectedFollowing]);

    /*
    * Fetches users that current user follows.
    */
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
            setShowFollowing(true);
        })
        .catch(error => {
            setUserResults([]);
            setShowPlaylist(false);
            setSelectedFollowing("");
            setShowFollowing(false);
        })
    }

    /*
    * Fetches users that match current user's search
    */
    const getUsers = (e) => {
        e.preventDefault();
        let searchName = searchQ;
        if (searchName) {
            fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/users/${searchName}/${curUser}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                } else {
                    return response.json();
                }
            })
            .then(data => {
                setUserResults(data);
                setShowClear(true);
            })
            .catch(error => {});
        } else {
            setUserResults([]);
        }
    }

    /*
    * Display playlist of the selected user
    */
    const displayPlaylist = (name) => {
        setSelectedFollowing(name);
        setShowPlaylist(true);
    }

    /*
    * Hide the displayed playlist
    */
    const hidePlaylist = () => {
        setSelectedFollowing("");
        setShowPlaylist(false);
    }

    /*
    * Clear search users input and results
    */
    const clearSearch = () => {
        setShowClear(false);
        setUserResults([]);
        setSearchQ("");
    }

    /*
    * State variable to update use effect when user is followed or unfollowed
    */
    const handleFollow = () => {
        setChangeFollow(!changeFollow);
    }

    return (
        <div id="viewFriendsContainer">
            <h2 id="discoverHeader">Discover on Mainstream</h2>
            <div id="discoverLinks">
                <Link to={`${url}/recPage`}>
                    <button id="recommendButton">Recommended songs</button>
                </Link>
                <Link to={`${url}/lb`}>
                    <h2 id="leaderboardLink">&#x1f451; Leaderboard &#x1f451;</h2>
                </Link>
            </div>
            <div id="searchUsersContainer">
                <form onSubmit={(e) => getUsers(e)} id="searchUsersForm">
                    <label id="searchUsersPrompt">Search users</label>
                    <input id="searchUserInput" type="text" value={searchQ} placeholder="Search by username" name="searchUser" onChange={(e) => setSearchQ(e.target.value)}></input>
                    <button id="goSearchUser" type="submit" value="Submit">Search</button>
                </form>
                <div>
                    {userResults && userResults.map((user) => (
                        (user !== curUser) && 
                        <div id="userToFollow">
                            <p id="user">{user}</p> 
                            <FollowButton userToFollow={user} curUser={curUser} handleFollow={handleFollow}></FollowButton> 
                        </div>
                    ))}
                    {showClear && <button onClick={() => clearSearch()} id="clearUserSearchButton">close</button>}
                </div>
            </div>
            <div id="followingContainer">
                <h3 id="followingHeader">Following</h3>
                {following.map((follow, index) => (
                    showFollowing && <p onClick={() => displayPlaylist(follow.name)} id="following">{follow.name}</p>)
                )}
            </div>
            {showPlaylist ? <FriendPlaylist hidePlaylist={hidePlaylist} showPlaylist={showPlaylist} curUser={curUser} friend={selectedFollowing}></FriendPlaylist> :
                <div id="noPlaylistSpacer"></div>
            }
        </div>
    )
}

export default ViewFriends;