import { useState, useEffect } from 'react'
import './Leaderboard.css'
import { Link } from 'react-router-dom';
import background from '/Users/tessaoro/Desktop/capstone/mainstream/frontend/mainstream-app/assets/lbBg.mp4';

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
        <div id="leaderboardComponent">
            <video autoPlay loop muted>
                <source src={background} type='video/mp4'></source>
            </video>
            <h1 id="lbHeader">&#x1f451; Leaderboard &#x1f451;</h1>
            <div id="lbEntries">
                <Link to='/dashboard'>
                    <button id="lbBack">back</button>
                </Link>
                { leaderboardMap && Object.entries(leaderboardMap).map(([user, score]) => (
                    <div id="lbPlace">
                        <h2 id="lbUser">{user}</h2>
                        <div id="lbScore">
                            <p id="lbScoreVal">{score}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Leaderboard;