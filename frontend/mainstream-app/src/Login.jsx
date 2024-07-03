import React from 'react';
import { useState, useEffect } from 'react';
import "./Login.css"

function Login( {closeLogin, setAppUser} ) {
    const [user, setUser] = useState("");
    const [password, setPassword ] = useState("");
    const [result, setResult] = useState("");

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
                setResult("login success!");
                closeLogin();
            } else {
                setResult("Failed to login. Please double check username and password.");
            }
        })
        .catch(error => {
            setResult("Failed to login. Please double check username and password.");
        });
        setAppUser(user);
    }

    return (
        <>
        <div id="createLogin">
            <div id="loginContent">
                <h3>Login</h3>
                <div id="username">
                    <label>Username: </label>
                    <input type="text" id="usernameInput" name="username" value={user} 
                    onChange={handleChangeUser} required></input>
                </div>
                <div id="password">
                    <label>Password: </label>
                    <input type="text" id="passwordInput" name="password" value={password} 
                    onChange={handleChangePassword} required></input>
                </div>
                <button onClick={handleCreate}>Create account</button>
                <button onClick={handleLogin}>Login</button>
                <div>
                    { result && <p>{result}</p>}
                </div>
            </div>
        </div>
        <div id="overlay"></div>
    </>
    );
}

export default Login;