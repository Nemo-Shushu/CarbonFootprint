import React, { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./static/sign-in.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

async function loginUser(credentials) {
    return fetch(backendUrl.concat('/api/accounts/signin/'), {
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
    const [csrf, setCsrf] = useState();
    const [error, setError] = useState();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const navigate = useNavigate();

    const handleProtect = () => {
        navigate("/dashboard")
    };

    useEffect(() => {
        getSession();
    }, []);

    function getCSRF() {
        fetch(backendUrl.concat("api2/csrf/"), {
          credentials: "include",
        })
        .then((res) => {
          let csrfToken = res.headers.get("X-CSRFToken");
          setCsrf(csrfToken);
          console.log(csrfToken);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    
    function getSession() {
        fetch(backendUrl.concat("api2/session/"), {
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.isAuthenticated) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                getCSRF();
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
    function whoami() {
        fetch(backendUrl.concat("api2/whoami/"), {
            headers: {
            "Content-Type": "application/json",
            },
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("You are logged in as: " + data.username);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value)
    }

    function handleUserNameChange(event) {
        setUserName(event.target.value)
    }

    function isResponseOk(response) {
        if (response.status >= 200 && response.status <= 299) {
            return response.json();
        } else {
            throw Error(response.statusText);
        }
    }
    
    function login(event) {
        event.preventDefault();
        fetch(backendUrl.concat('api2/login/'), {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf,
            },
            credentials: "include",
            body: JSON.stringify({username: username, password: password}),
        })
        .then(isResponseOk)
        .then((data) => {
            console.log(data);
            setIsAuthenticated(true);
            setUserName("");
            setPassword("");
            setError("");
            navigate('/dashboard');
        })
        .catch((err) => {
            console.log(err);
            setError("Wrong username or password");
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        loginUser({ username, password });
        navigate('/dashboard')
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

    return !useAuth() ? (
        <div>
        {/* Main Form */}
        <main className="form-signin w-100 m-auto">
            <form onSubmit={login}>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

            <div className="form-floating">
                <input
                type="text"
                name="username"
                className="form-control"
                id="floatingInput"
                placeholder="Username"
                onChange={handleUserNameChange}
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
                onChange={handlePasswordChange}
                />
                <label htmlFor="floatingPassword">Password</label>
            </div>
            <p className="warning">{error}</p>
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
            <Link to="/register">
                <button className="btn btn-outline-success w-100 py-2 mt-2" type="button">
                    Don't have an account? Go to register
                </button>
            </Link>
            <button className="btn btn-outline-success w-100 py-2 mt-2" type="button">
                Fogot your password?
            </button>
            </form>
        </main>
        </div>
    ) : (
        handleProtect()
    );
};

export default SignInForm;