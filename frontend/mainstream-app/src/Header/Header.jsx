import React from 'react';
import { useState } from 'react';
import "./Header.css";

function Header() {

    return (
        <div id="headerText">
            <svg id="waveLogoDash" xmlns="http://www.w3.org/2000/svg" width="26" height="15" viewBox="0 0 26 15" fill="none">
                    <path d="M2 13C4.37767 13 5.30444 13.0906 6.93022 11.5249C8.556 9.95919 9.86237 7.81222 11.474 6.23444C12.9132 4.82543 14.7846 3.82976 16.5212 3.05174C17.3212 2.69336 18.1529 2.45605 18.9773 2.1943C19.3713 2.06921 19.7028 1.81706 19.2413 2.2161C18.1104 3.19411 17.3495 4.51414 16.9817 6.10365C16.5728 7.87097 16.2836 10.0958 17.5344 11.4663C18.36 12.371 19.4254 12.8587 20.5 13C21.5661 13.1402 22.9428 13.1395 24 12.8614" stroke="#530BAE" stroke-width="3" stroke-linecap="square" stroke-linejoin="round"/>
            </svg>
            <h1 id="mainstreamDashboard">mainstream</h1>
        </div>
    )
}

export default Header;