import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./static/sign-in.css";

async function loginUser(credentials) {
    return fetch('http://localhost:8080/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

function SignInForm() {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = (event) => {
        event.preventDefault();
        loginUser({ username, password });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name == "username"){
            setUserName(value);
        }
        else if (name == "password"){
            setPassword(value);
        }
    };

    return (
        <div>
        {/* Main Form */}
        <main className="form-signin w-100 m-auto">
            <form onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

            <div className="form-floating">
                <input
                type="text"
                name="username"
                className="form-control"
                id="floatingInput"
                placeholder="Username"
                onChange={handleChange}
                />
                <label htmlFor="floatingInput">Username</label>
            </div>
            <div className="form-floating">
                <input
                type="password"
                name="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                onChange={handleChange}
                />
                <label htmlFor="floatingPassword">Password</label>
            </div>

            <div className="form-check text-start my-3">
                <input
                className="form-check-input"
                type="checkbox"
                value="remember-me"
                id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                Remember me
                </label>
            </div>
            <button className="btn btn-success w-100 py-2" type="submit">
                Sign in
            </button>
            <button className="btn btn-outline-success w-100 py-2 mt-2" type="button">
                Don't have an account? Go to register
            </button>
            <button className="btn btn-outline-success w-100 py-2 mt-2" type="button">
                Fogot your password?
            </button>
            </form>
        </main>
        </div>
    );
};

export default SignInForm;