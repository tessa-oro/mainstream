import React from 'react';
import { useState } from 'react';
import "./Dashboard.css";
import ViewFriends from './ViewFriends';
import Profile from './Profile';

function Dashboard() {

    return (
      <div id="dashboard">
        <ViewFriends></ViewFriends>
        <Profile></Profile>
      </div>
    )
  }
  
  export default Dashboard;