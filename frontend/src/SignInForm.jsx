import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "./useAuth";
import "./static/sign-in.css";

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
    await fetch(backendUrl + "api2/login/", {
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
    <div>
      {/* Main Form */}
      <main className="form-signin w-100 m-auto">
        <form onSubmit={handleLogin}>
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
          <div className="form-floating position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              onChange={handlePasswordChange}
            />
            <label htmlFor="floatingPassword">Password</label>

            <button
              type="button"
              onClick={toggleShowPassword}
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
              style={{ textDecoration: "none" }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
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
            <button
              className="btn btn-outline-success w-100 py-2 mt-2"
              type="button"
            >
              Don&apos;t have an account? Go to register
            </button>
          </Link>
          <button
            className="btn btn-outline-success w-100 py-2 mt-2"
            type="button"
          >
            Fogot your password?
          </button>
        </form>
      </main>
    </div>
  );
}

export default SignInForm;
