import React from 'react';
import { useState } from 'react';
import "./FriendSong.css";


function FriendSong( { player, goToRate, songId } ) {
    const [notRated, setNotRated] = useState(true);


    return (
       <>
       <div id="songBorder">
                <div id="songPlayerFollowing" dangerouslySetInnerHTML={{ __html: player }} />
                {notRated && <button id="rate" onClick={() => {
                    goToRate(songId);
                    setNotRated(false);
                }}>rate song</button>}
        </div>
      </>
    )
  }
  
  export default FriendSong;