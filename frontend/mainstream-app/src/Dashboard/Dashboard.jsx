import React from 'react';
import { useState } from 'react';
import "./Dashboard.css";
import ViewFriends from '../DiscoverySection/Following/ViewFriends/ViewFriends';
import RecommendedPage from '../DiscoverySection/RecommendedPage/RecommendedPage';
import { Route, Switch, Link, useRouteMatch } from 'react-router-dom';
import Profile from '../ProfileSection/Profile/Profile';

function Dashboard({ curUser, login, handleLogout }) {
    let { path, url } = useRouteMatch();

    return (
        <>
            <Link to='/leaderboard'>
                <h2 id="leaderboardLink">Leaderboard</h2>
            </Link>
            <div id="dashboard">
                <Switch>
                    <Route exact path={path}><ViewFriends></ViewFriends></Route>
                    <Route path={`${path}/viewfriends`}>
                        <ViewFriends curUser={curUser} login={login}></ViewFriends>
                    </Route>
                    <Route path={`${path}/recPage`}>
                        <RecommendedPage curUser={curUser}></RecommendedPage>
                    </Route>
                </Switch>
                <Profile curUser={curUser} handleLogout={() => handleLogout()}></Profile>
            </div>
        </>
    )
}

export default Dashboard;