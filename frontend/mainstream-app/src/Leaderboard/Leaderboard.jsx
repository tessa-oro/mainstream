import { useState } from 'react'
import './Leaderboard.css'
import { Link } from 'react-router-dom';

function Leaderboard() {

    return (
        <div>
            <h1>Leaderboard</h1>
            <Link to='/'>
                <button>back</button>
            </Link>
        </div>
    )
}

export default Leaderboard;