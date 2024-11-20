import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./static/sign-in.css";

async function createUser(user) {
  return fetch('http://localhost:8000/api/accounts/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
  .then(response => response.json())
  .then(data => console.log('User created:', data))
  .catch(error => console.error('Error creating user:', error));
}

function RegisterForm() {
  const [user, setUser] = useState({ username: '', password: '', email: '' , institution: '', field: ''});

  const handleSubmit = (event) => {
    event.preventDefault();
    createUser(user)
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  return (
    <div>
    {/* Main Form */}
    <main className="form-signin w-100 m-auto">
        <form onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 fw-normal">Please register</h1>

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
            type="email"
            name="email"
            className="form-control"
            id="floatingInput"
            placeholder="Email"
            onChange={handleChange}
            />
            <label htmlFor="floatingInput">Email</label>
        </div>
        <div className="form-floating">
            <input
            list="institutions"
            name="institution"
            className="form-control"
            id="floatingInput"
            onChange={handleChange}
            />
            <datalist id="institutions">
              <option value="University of Glasgow"/>
              <option value="University of Exeter"/>
              <option value="University of Leeds"/>
            </datalist>
            <label htmlFor="floatingInput">Academic Institution</label>
        </div>
        <div className="form-floating">
            <input
            list="research fields"
            name="field"
            className="form-control"
            id="floatingInput"
            onChange={handleChange}
            />
            <datalist id="research fields">
              <option value="Computing Science"/>
              <option value="Genetics"/>
              <option value="Civil Engineering"/>
            </datalist>
            <label htmlFor="floatingInput">Research Field</label>
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
        <button className="btn btn-success w-100 py-2" type="submit">
            Register
        </button>
        <button className="btn btn-outline-success w-100 py-2 mt-2" type="button">
            Already registered? Go to Sign In
        </button>
        </form>
    </main>
    </div>
  );
}

export default RegisterForm;