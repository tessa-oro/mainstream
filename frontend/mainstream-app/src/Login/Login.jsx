import React from 'react';
import { useState, useEffect } from 'react';
import "./Login.css"

function Login({ closeLogin, setAppUser }) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
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
                    closeLogin();
                    setAppUser(user);
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
                <div id="loginContent">
                <h1 id="welcome">Welcome to mainstream.</h1>
                    <h2 id="loginTitle">Get started</h2>
                    <div class="loginInput">
                        <label>Username: </label>
                        <input type="text" className="formInput" name="username" value={user}
                            onChange={handleChangeUser} required></input>
                    </div>
                    <div class="loginInput">
                        <label>Password: </label>
                        <input type="text" className="formInput" name="password" value={password}
                            onChange={handleChangePassword} required></input>
                    </div>
                    <div id="loginSubmit">
                        <button onClick={handleLogin} class="formSubmit">Login</button>
                        <p id="or">or</p>
                        <button onClick={handleCreate} class="formSubmit">Create account</button>
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