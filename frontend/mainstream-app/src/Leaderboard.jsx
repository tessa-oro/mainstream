import React from 'react';
import { useState } from 'react';
import "./Leaderboard.css";
import { Link } from "react-router-dom";

function Leaderboard() {

    return (
      <>
        <h1>Leaderboard</h1>
        <Link to="/">
            <button>Back to dashboard</button>
        </Link>
      </>
    )
  }
  
export default Leaderboard;