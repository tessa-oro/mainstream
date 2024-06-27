import React from 'react';
import "./Login.css"

function Login() {
    return (
        <>
        <div id="createLogin">
            <div id="loginContent">
                <h3>Login</h3>
                <form onSubmit={(e) => {createBoard(e)}}>
                    <div id="username">
                        <label>Username:</label>
                        <input type="text" id="usernameInput" name="username" required></input>
                    </div>
                    <div id="password">
                        <label>Password:</label>
                        <input type="text" id="passwordInput" name="password" required></input>
                    </div>
                </form>
                <p id="close" >enter</p>
            </div>
        </div>
        <div id="overlay"></div>
    </>
    );
}

export default Login;