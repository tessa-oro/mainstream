import React from 'react';
import { useState, useEffect } from 'react';
import "./Login.css"

function Login( {closeLogin} ) {
    const [user, setUser] = useState("");
    const [password, setPassword ] = useState("");
    const [result, setResult] = useState("");

    useEffect(() => {

    }, [user])

    const handleChangeUser = (e) => {
        setUser(e.target.value);
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
                user,
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
            console.log(response)
            if (response.ok) {
                setResult("login success!");
                closeLogin();
            } else {
                setResult("failed to login");
            }
        })
        .catch(error => {
            setResult("failed to login");
        });
    }

    return (
        <>
        <div id="createLogin">
            <div id="loginContent">
                <h3>Login</h3>
                <div id="username">
                    <label>Username:</label>
                    <input type="text" id="usernameInput" name="username" value={user} 
                    onChange={handleChangeUser} required></input>
                </div>
                <div id="password">
                    <label>Password:</label>
                    <input type="text" id="passwordInput" name="password" value={password} 
                    onChange={handleChangePassword} required></input>
                </div>
                <button onClick={handleCreate}>Create Account</button>
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