import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./static/sign-in.css";
import { useAuth } from "./useAuth";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function SignInForm() {
  const [error, setError] = useState();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        handleProtect();
      }
    }
  }, [isAuthenticated, loading]);

  const handleProtect = () => {
    navigate("/dashboard");
  };

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleUserNameChange(event) {
    setUserName(event.target.value);
  }

  function isResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }

  async function login() {
    await fetch(`${backendUrl}api/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      credentials: "include",
      body: JSON.stringify({ username: username, password: password }),
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        setUserName("");
        setPassword("");
        setError("");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log(err);
        setError("Wrong username or password");
      });
  }

  async function handleLogin(event) {
    event.preventDefault();
    try {
      await login();
      handleProtect();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="sign-in-wrapper">
      <div className="sign-in-container">
        {/* Left Side - Form */}
        <div className="sign-in-form">
          <h2>Welcome Back</h2>
          <p>Please sign in to continue.</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                name="username"
                className="input-field"
                placeholder="Username"
                value={username}
                onChange={handleUserNameChange}
              />
            </div>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="show-password"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && <p className="warning">{error}</p>}

            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember"> Remember me</label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button className="sign-in-button" type="submit">
              Login
            </button>

            <p className="register-link">
              Don&apos;t have an account? <Link to="/register">Sign up</Link>
            </p>
          </form>
        </div>

        {/* Right Side - Background Image */}
        <div className="sign-in-image">
          <div className="overlay-text">Carbon Footprint Calculator</div>
        </div>
      </div>
    </div>
  );
}

export default SignInForm;
