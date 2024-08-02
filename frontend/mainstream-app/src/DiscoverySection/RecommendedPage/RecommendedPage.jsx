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
                setShowInteractionRecommend(false);
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
                setShowInteractionRecommend(false);
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
                setShowAnalysisRecommend(false);
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data === "An error ocurred while fetching analysis based recommendations.") {
                setShowAnalysisRecommend(false);
            } else {
                setAnalysisRecommendedSongs(data);
                setShowAnalysisRecommend(true);
            }
        })
        .catch(error => {});
    }

    return (
      <div id="recommendedContainer">
        <Link to='/dashboard'>
            <button id="backButton">back</button>
        </Link>
        <div id="vibeMatchContainer">
            <h2>Similar vibe to your playlist</h2>
            <div className="recommendGrid">
                {showAnalysisRecommend && analysisRecommendedSongs &&
                    analysisRecommendedSongs.map((recommendation) => (
                    <div className="recommendSongPlayer" dangerouslySetInnerHTML={{ __html: recommendation.player }} />
                ))}
            </div>
        </div>
        <div id="userMatchContainer">
            <h2>Here's what other users like you are listening to</h2>
            <div className="recommendGrid">
                {showInteractionRecommend && interactionRecommendedSongs &&
                    interactionRecommendedSongs.map((recommendation) => (
                    <div className="recommendSongPlayer" dangerouslySetInnerHTML={{ __html: recommendation }} />
                ))}
            </div>
        </div>
      </div>
    )
  }
  
export default RecommendedPage;