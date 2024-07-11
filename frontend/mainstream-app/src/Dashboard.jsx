import React from 'react';
import { useState } from 'react';
import "./Dashboard.css";
import ViewFriends from './ViewFriends';
import Profile from './Profile';

function Dashboard( {curUser, login, handleLogout} ) {

    return (
       <>
      <div id="dashboard">
        <ViewFriends curUser={curUser} login={login}></ViewFriends>
        <Profile curUser={curUser} handleLogout={() => handleLogout()}></Profile>
      </div>
      </>
    )
  }
  
  export default Dashboard;