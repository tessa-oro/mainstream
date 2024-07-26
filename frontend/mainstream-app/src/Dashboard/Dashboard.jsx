import React from 'react';
import { useState } from 'react';
import "./Dashboard.css";
import ViewFriends from '../DiscoverySection/Following/ViewFriends/ViewFriends';
import RecommendedPage from '../DiscoverySection/RecommendedPage/RecommendedPage';
import { Route, Switch, Link, useRouteMatch } from 'react-router-dom';
import Profile from '../ProfileSection/Profile/Profile';

function Dashboard({ curUser, login, handleLogout }) {
    let { path, url } = useRouteMatch();
    const [layout, setLayout] = useState('50-50');

    const expansion = () => {
        setLayout(prevLayout => {
            if (prevLayout === '75-25') return '50-50';
            if (prevLayout === '50-50') return '25-75';
            return '75-25'; 
        })
    }

    return (
        <>
            <Link to='/leaderboard'>
                <h2 id="leaderboardLink">Leaderboard</h2>
            </Link>
            <div id="dashboard">
                <div style={{ flexBasis: layout === '75-25' ? '75%' : layout === '50-50' ? '50%' : '25%'}}>
                    <Switch>
                        <Route exact path={path}><ViewFriends curUser={curUser}></ViewFriends></Route>
                        <Route path={`${path}/viewfriends`}>
                            <ViewFriends curUser={curUser} login={login}></ViewFriends>
                        </Route>
                        <Route path={`${path}/recPage`}>
                            <RecommendedPage curUser={curUser}></RecommendedPage>
                        </Route>
                    </Switch>
                </div>
                <div style={{ flexBasis: layout === '75-25' ? '25%' : layout === '50-50' ? '50%' : '75%', position: 'relative'}}>
                    <Profile curUser={curUser} handleLogout={() => handleLogout()}></Profile>
                    <button id="expand" onClick={expansion} style={{position: 'absolute', top: 0, left: 0}}>{layout === '75-25' || layout === '50-50' ?  '‹' : '›' }</button>
                </div>
            </div>
        </>
    )
}

export default Dashboard;