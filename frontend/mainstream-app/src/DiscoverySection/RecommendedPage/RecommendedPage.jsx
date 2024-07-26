import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./RecommendedPage.css";

function RecommendedPage( {curUser} ) {
    const [interactionRecommendedSongs, setInteractionRecommendedSongs] = useState([]);
    const [showInteractionRecommend, setShowInteractionRecommend] = useState(false);
    const [analysisRecommendedSongs, setAnalysisRecommendedSongs] = useState([]);
    const [showAnalysisRecommend, setShowAnalysisRecommend] = useState(false);

    useEffect(() => {
        updateInteractionBasedRecommendations();
        fetchInteractionBasedRecommendations();
        fetchAnalysisBasedRecommendations();
    }, [showInteractionRecommend]);

    /*
    * Update the interaction based songs recommendations for a user using PATCH
    */
    const updateInteractionBasedRecommendations = () => {
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
        .catch(error => {});
    }

    /*
    * Fetches recommended songs for user based on similar user interactions
    */
    const fetchInteractionBasedRecommendations = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/recommended/${curUser}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                return response.json();
            }
        })
        .then(data => {
            setInteractionRecommendedSongs(data);
            setShowInteractionRecommend(true);
        })
        .catch(error => {});
    }

    /*
    * Fetches recommended songs for user based on their analysis
    */
    const fetchAnalysisBasedRecommendations = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/analysisRecommendations/${curUser}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                return response.json();
            }
        })
        .then(data => {
            setAnalysisRecommendedSongs(data);
            setShowAnalysisRecommend(true);
        })
        .catch(error => {});
    }

    return (
      <div id="recommendedContainer">
        <h2>Recommended</h2>
        <Link to='/'>
            <button id="backButton">back</button>
        </Link>
        <div>
            <h2>These are a similar vibe to your playlist</h2>
            {showAnalysisRecommend && analysisRecommendedSongs.map((recommendation) => (
                <div id="songPlayer" dangerouslySetInnerHTML={{ __html: recommendation.player }} />
            ))}
        </div>
        <div>
            <h2>Here's what other users like you are listening to</h2>
            {showInteractionRecommend && interactionRecommendedSongs.map((recommendation) => (
                <div id="songPlayer" dangerouslySetInnerHTML={{ __html: recommendation }} />
            ))}
        </div>
      </div>
    )
  }
  
export default RecommendedPage;