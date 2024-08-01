import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import "./Login.css"

function Login({ closeLogin, setAppUser }) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState("");
    const history = useHistory();

    useEffect(() => {

    }, [user])

    /*
    * Updates current username
    */
    const handleChangeUser = (e) => {
        setUser(e.target.value);
    }

    /*
    * Updates current password
    */
    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

    /*
    * Creates an account with current user and password. Tells user if username is taken.
    */
    const handleCreate = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/create`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user,
                    password,
                }),
            })
            .then(response => {
                if (response.ok) {
                    handleLogin();
                } else {
                    setResult("faled to create.");
                }
            })
            .catch(error => {
                setResult("Username taken.");
            });
    }

    /*
    * Logs user in with inputted username and password.
    */
    const handleLogin = async () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/login`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user,
                    password,
                }),
            })
            .then(response => {
                if (response.ok) {
                    closeLogin();
                    setAppUser(user);
                    history.push('/dashboard');
                } else {
                    setResult("Failed to login. Please double check username and password.");
                }
            })
            .catch(error => {
                setResult("Failed to login. Please double check username and password.");
            });
    }

    return (
        <>
            <div id="createLogin">
                <div id="loginHeader">
                    <svg id="waveLogoHeader" xmlns="http://www.w3.org/2000/svg" width="26" height="15" viewBox="0 0 26 15" fill="none">
                        <path d="M2 13C4.37767 13 5.30444 13.0906 6.93022 11.5249C8.556 9.95919 9.86237 7.81222 11.474 6.23444C12.9132 4.82543 14.7846 3.82976 16.5212 3.05174C17.3212 2.69336 18.1529 2.45605 18.9773 2.1943C19.3713 2.06921 19.7028 1.81706 19.2413 2.2161C18.1104 3.19411 17.3495 4.51414 16.9817 6.10365C16.5728 7.87097 16.2836 10.0958 17.5344 11.4663C18.36 12.371 19.4254 12.8587 20.5 13C21.5661 13.1402 22.9428 13.1395 24 12.8614" stroke="#530BAE" stroke-width="3" stroke-linecap="square" stroke-linejoin="round"/>
                    </svg>
                    <p id="mainstream">mainstream</p>
                </div>
                <div id="loginContent">
                    <svg id="waveLogoMain" xmlns="http://www.w3.org/2000/svg" width="26" height="15" viewBox="0 0 26 15" fill="none">
                        <path d="M2 13C4.37767 13 5.30444 13.0906 6.93022 11.5249C8.556 9.95919 9.86237 7.81222 11.474 6.23444C12.9132 4.82543 14.7846 3.82976 16.5212 3.05174C17.3212 2.69336 18.1529 2.45605 18.9773 2.1943C19.3713 2.06921 19.7028 1.81706 19.2413 2.2161C18.1104 3.19411 17.3495 4.51414 16.9817 6.10365C16.5728 7.87097 16.2836 10.0958 17.5344 11.4663C18.36 12.371 19.4254 12.8587 20.5 13C21.5661 13.1402 22.9428 13.1395 24 12.8614" stroke="#530BAE" stroke-width="3" stroke-linecap="square" stroke-linejoin="round"/>
                    </svg>
                    <h2 id="loginTitle">Join the stream</h2>
                    <div id="loginInput">
                        <input type="text" placeholder="Username" id="formInput" name="username" value={user}
                            onChange={handleChangeUser} required></input>
                    </div>
                    <div id="loginInput">
                        <input type="text" placeholder="Password" id="formInput" name="password" value={password}
                            onChange={handleChangePassword} required></input>
                    </div>
                    <div id="loginSubmit">
                        <button onClick={handleLogin} id="formSubmit">Login</button>
                        <button onClick={handleCreate} id="formSubmit">Create account</button>
                    </div>
                    <div>
                        {result && <p>{result}</p>}
                    </div>
                </div>
            </div>
            <div id="overlay"></div>
        </>
    );
}

export default Login;