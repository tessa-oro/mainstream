import React from 'react';
import { useState } from 'react';
import "./Dashboard.css";
import ViewFriends from '../DiscoverySection/Following/ViewFriends/ViewFriends';
import RecommendedPage from '../DiscoverySection/RecommendedPage/RecommendedPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Profile from '../ProfileSection/Profile/Profile';

function Dashboard({ curUser, login, handleLogout }) {

    return (
        <Router>
            <div id="dashboard">
                <Switch>
                    <Route exact path='/'>
                        <ViewFriends curUser={curUser} login={login}></ViewFriends>
                    </Route>
                    <Route path='/recPage'>
                        <RecommendedPage curUser={curUser}></RecommendedPage>
                    </Route>
                </Switch>
                <Profile curUser={curUser} handleLogout={() => handleLogout()}></Profile>
            </div>
        </Router>
    )
}

export default Dashboard;