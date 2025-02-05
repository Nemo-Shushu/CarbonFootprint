import React, { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./static/sign-in.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

async function createUser(user) {
  return fetch(backendUrl.concat('api/accounts/register/'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    return data;
  })
  .catch(error => {
    console.error('Error:', error);
    throw error;
  });
}

function RegisterForm() {
  const [user, setUser] = useState({ 
    username: '', 
    first_name: '', 
    last_name: '', 
    password: '', 
    password2: '', 
    email: '', 
    institute: '', 
    research_field: ''
  });
  const [error, setError] = useState();
  const [institutions, setInstitutions] = useState([]);
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  const handleInstitutionsChange = (event) => {
    let eventValue = event.target.value;
    setInstitutions(eventValue);
};

  useEffect(() => {
    fetch(backendUrl.concat('api2/institutions/'))
      .then(response => {
        if (!response.ok) {
          throw new Error('Fail to get an unveristy lists.');
        }
        return response.json();
      })
      .then(data => {
        setInstitutions(data);
      })
      .catch(err => {
        console.error('Error fetching institutions:', err);
      });
  }, []);

  useEffect(() => {
    fetch(backendUrl.concat('api2/fields/'))
      .then(response => {
        if (!response.ok) {
          throw new Error('Fail to get a field lists.');
        }
        return response.json();
      })
      .then(data => {
        setFields(data);
      })
      .catch(err => {
        console.error('Error fetching fields:', err);
      });
  }, []);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    createUser(user)
      .then((data) => {
        console.log('User created:', data);
        setError("");
        navigate('/sign-in');
      })
      .catch(err => {
        console.error('Error creating user:', err);
        setError(err.message);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleProtect = () => {
    navigate("/sign-in");
  };

  return !useAuth() ? (
    <div>
      {/* Main Form */}
      <main className="form-signin w-100 m-auto">
        <form onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 fw-normal">Please register</h1>

          <div className="form-floating">
            <input
              type="email"
              name="email"
              className="form-control"
              id="floatingInputEmail"
              placeholder="Email"
              onChange={handleChange}
            />
            <label htmlFor="floatingInputEmail">Email</label>
          </div>

          <div className="form-floating">
            <input
              type="text"
              name="username"
              className="form-control"
              id="floatingInputUsername"
              placeholder="Username"
              onChange={handleChange}
            />
            <label htmlFor="floatingInputUsername">Username</label>
          </div>

          <div className="form-floating">
            <input
              type="text"
              name="first_name"
              className="form-control"
              id="floatingInputFirstName"
              placeholder="First Name"
              onChange={handleChange}
            />
            <label htmlFor="floatingInputFirstName">First Name</label>
          </div>

          <div className="form-floating">
            <input
              type="text"
              name="last_name"
              className="form-control"
              id="floatingInputLastName"
              placeholder="Last Name"
              onChange={handleChange}
            />
            <label htmlFor="floatingInputLastName">Last Name</label>
          </div>

          <div className="form-floating">
            <input
              list="institutions"
              name="institute"
              className="form-control"
              id="floatingInputInstitute"
              onChange={handleChange}
            />

          <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" onChange={handleInstitutionsChange}>
            {institutions.map((inst, index) => (
                <option key={index} value={inst.name} />
              ))}
          </select>
          
            <label htmlFor="floatingInputInstitute">Academic Institution</label>
          </div>

          <div className="form-floating">
            <input
              list="research-fields"
              name="research_field"
              className="form-control"
              id="floatingInputResearch"
              onChange={handleChange}
            />
            <datalist id="research-fields">
            {fields.map((inst, index) => (
                <option key={index} value={inst.name} />
              ))}
            </datalist>
            <label htmlFor="floatingInputResearch">Research Field</label>
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

          <div className="form-floating">
            <input
              type="password"
              name="password2"
              className="form-control"
              id="floatingPasswordConfirm"
              placeholder="Confirm Password"
              onChange={handleChange}
            />
            <label htmlFor="floatingPasswordConfirm">Confirm Password</label>
          </div>

          <p className="warning">{error}</p>

          <button className="btn btn-success w-100 py-2" type="submit">
            Register
          </button>

          <Link to="/sign-in">
            <button className="btn btn-outline-success w-100 py-2 mt-2" type="button">
              Already registered? Go to Sign In
            </button>
          </Link>
        </form>
      </main>
    </div>
  ) : (
    handleProtect()
  );
}

export default RegisterForm;
