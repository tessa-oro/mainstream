import { useState, useEffect } from 'react'
import './Leaderboard.css'
import { Link } from 'react-router-dom';

function Leaderboard({ curUser }) {
    const [leaderboardMap, setLeaderboardMap] = useState({});

    useEffect(() => {
        fetchLeaderboard();
    }, [curUser]);

    /*
    * Get a user's leaderboard
    */
    const fetchLeaderboard = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/leaderboard/${curUser}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                return response.json();
            }
        })
        .then(data => {
            setLeaderboardMap(data);
        })
        .catch(error => {})
    }

    return (
        <div>
            <h1>Leaderboard</h1>
            <Link to='/dashboard'>
                <button>back</button>
            </Link>
            { leaderboardMap && Object.entries(leaderboardMap).map(([user, score]) => (
                <p>{user} score: {score}</p>
            ))}
        </div>
    )
}

export default Leaderboard;