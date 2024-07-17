import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import "./RecommendedPage.css";

function RecommendedPage() {

    return (
      <>
        <p>Recommended</p>
        <Link to='/'>
            <button>back</button>
        </Link>
      </>
    )
  }
  
export default RecommendedPage;