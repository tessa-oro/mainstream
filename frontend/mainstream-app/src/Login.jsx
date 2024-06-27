import React from 'react';
import { useState } from 'react';
import _ from 'lodash';
import "./Login.css"

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword ] = useState("");
    const [result, setResult] = useState("");

    const handleChangeUser = (e) => {
        setUsername(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleCreate = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/create`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        })
        .then(response => {
            console.log(response)
            if (response.ok) {
                setResult("create success!");
            } else {
                setResult("failed to create account");
            }
        })
        .catch(error => {
            setResult("failed to create!");
        });
    }

    return (
        <>
        <div id="createLogin">
            <div id="loginContent">
                <h3>Login</h3>
                <div id="username">
                    <label>Username:</label>
                    <input type="text" id="usernameInput" name="username" value={username} 
                    onChange={handleChangeUser} required></input>
                </div>
                <div id="password">
                    <label>Password:</label>
                    <input type="text" id="passwordInput" name="password" value={password} 
                    onChange={handleChangePassword} required></input>
                </div>
                <button onClick={handleCreate}>Create Account</button>
                {/* <button onClick={handleLogin}>Login</button> */}
                <div>
                    { result && <p>{result}</p>}
                </div>
                <p id="close" >enter</p>
            </div>
        </div>
        <div id="overlay"></div>
    </>
    );
}

export default Login;