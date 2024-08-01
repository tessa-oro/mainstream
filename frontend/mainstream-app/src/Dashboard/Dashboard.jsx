import React from 'react';
import { useState } from 'react';
import "./Dashboard.css";
import ViewFriends from '../DiscoverySection/Following/ViewFriends/ViewFriends';
import RecommendedPage from '../DiscoverySection/RecommendedPage/RecommendedPage';
import { Route, Switch, Link, useRouteMatch } from 'react-router-dom';
import Profile from '../ProfileSection/Profile/Profile';

function Dashboard({ curUser, login, handleLogout }) {
    let { path, url } = useRouteMatch();
    const [layout, setLayout] = useState('100-0');

    const expansion = () => {
        setLayout(prevLayout => {
            if (prevLayout === '100-0') return '0-100';
            return '100-0';
        })
    }

    return (
        <>
            <div id="expand" onClick={expansion} style={{position: 'absolute', top: '25px', right: '40px'}}>{layout === '100-0' ?  
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <mask id="mask0_1_96" maskType="alpha" maskUnits="userSpaceOnUse" x="1" y="3" width="34" height="33">
                        <circle cx="18" cy="19.5" r="15" fill="#D9D9D9" stroke="black" strokeWidth="3" />
                    </mask>
                    <g mask="url(#mask0_1_96)">
                        <circle cx="18" cy="15" r="3.75" stroke="black" stroke-width="3"/>
                        <circle cx="18" cy="33.75" r="12.75" stroke="black" stroke-width="3"/>
                    </g>
                    <circle cx="18" cy="18" r="16.5" stroke="black" stroke-width="3"/>
                </svg> : <h2 id="discoverButton">Discover</h2> }</div>
            <div id="dashboard">
                <div style={{ height: '100%', overflow: 'hidden', flexBasis: layout === '0-100' ? '0%' : '100%'}}>
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
                <div style={{ height: '100%', overflow: 'hidden', flexBasis: layout === '0-100' ? '100%' : '0%', position: 'relative'}}>
                    <Profile curUser={curUser} handleLogout={() => handleLogout()}></Profile>
                </div>
            </div>
        </>
    )
}

export default Dashboard;