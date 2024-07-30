import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import "./ViewFriends.css";
import FollowModal from "../FollowModal/FollowModal";
import FriendPlaylist from "../FriendPlaylist/FriendPlaylist";
import FollowButton from '../FollowButton/FollowButton';

function ViewFriends({ curUser, login }) {
    const [following, setFollowing] = useState([]);
    const [userResults, setUserResults] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userToFollow, setUserToFollow] = useState("");
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [selectedFollowing, setSelectedFollowing] = useState("");
    const [showFollowing, setShowFollowing] = useState(false);
    const [showClear, setShowClear] = useState(false);
    const [searchQ, setSearchQ] = useState("");
    const [changeFollow, setChangeFollow] = useState(false);
    let { url } = useRouteMatch();

    useEffect(() => {
        fetchFollowing();
    }, [login, showModal, curUser, changeFollow]);

    useEffect(() => {
        clearSearch();
    }, [curUser]);

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
    * Opens and closes modal to follow a user
    */
    const followModal = (user) => {
        setUserToFollow(user);
        // setShowModal(!showModal);
    }

    /*
    * Display playlist of the selected user
    */
    const displayPlaylist = (name) => {
        setSelectedFollowing(name);
        setShowPlaylist(true);
    }

    /*
    * Clear search users input and results
    */
    const clearSearch = () => {
        setShowClear(false);
        setUserResults([]);
        setSearchQ("");
    }

    const handleFollow = () => {
        setChangeFollow(!changeFollow);
    }

    return (
        <div id="viewFriendsContainer">
            <h2 id="discoverHeader">Discover</h2>
            <Link to={`${url}/recPage`}>
                <button id="recommendButton">Song recommendations</button>
            </Link>
            <div id="searchUsersContainer">
                <form onSubmit={(e) => getUsers(e)} id="searchUsersForm">
                    <label id="searchUsersPrompt">Search users to follow: </label>
                    <input type="text" value={searchQ} placeholder="Search by username" name="searchUser" onChange={(e) => setSearchQ(e.target.value)}></input>
                </form>
                {showModal && <FollowModal closeModal={() => followModal()} userToFollow={userToFollow} curUser={curUser} />}
                <div>
                    {userResults && userResults.map((user) => (
                        (user !== curUser) && 
                        <div id="userToFollow">
                            <p onClick={() => followModal(user)} id="user">{user}</p> 
                            <FollowButton userToFollow={user} curUser={curUser} handleFollow={handleFollow}></FollowButton> 
                        </div>
                    ))}
                    {showClear && <button onClick={() => clearSearch()} id="clearUserSearchButton">cancel</button>}
                </div>
            </div>
            <div id="followingContainer">
                <h3 id="followingHeader">Following</h3>
                {following.map((follow, index) => (
                    showFollowing && <p onClick={() => displayPlaylist(follow.name)} id="following">{follow.name}</p>)
                )}
            </div>
            {showPlaylist && <FriendPlaylist showPlaylist={showPlaylist} curUser={curUser} friend={selectedFollowing}></FriendPlaylist>}
        </div>
    )
}

export default ViewFriends;