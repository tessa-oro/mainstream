import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./RecommendedPage.css";

function RecommendedPage( {curUser} ) {
    const [recommendedSongs, setRecommendedSongs] = useState([]);
    const [showRecommend, setShowRecommend] = useState(false);

    useEffect(() => {
        updateRecommendedSongs();
        fetchRecommendedSongs();
    }, [showRecommend]);

    /*
    * Update the songs recommended for a user using PATCH
    */
    const updateRecommendedSongs = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/recommended/${curUser}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                return response.json();
            }
        })
        .catch(error => {
        });
    }

    /*
    * Fetches recommended songs for user
    */
    const fetchRecommendedSongs = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/recommended/${curUser}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                return response.json();
            }
        })
        .then(data => {
            setRecommendedSongs(data);
            setShowRecommend(true);
        })
        .catch(error => {
        });
    }

    return (
      <div id="recommendedContainer">
        <h2>Recommended</h2>
        <Link to='/'>
            <button id="backButton">back</button>
        </Link>
        <div>
            {showRecommend && recommendedSongs.map((recommendation) => (
                <div id="songPlayer" dangerouslySetInnerHTML={{ __html: recommendation }} />
            ))}
        </div>
      </div>
    )
  }
  
export default RecommendedPage;