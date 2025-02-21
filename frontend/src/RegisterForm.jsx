import React, { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./static/sign-in.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

async function createUser(user) {
  return fetch(backendUrl + 'api/accounts/register/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(errorData => {
        throw errorData;
      });
    }
    return response.json();
  })
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
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };
  useEffect(() => {
    fetch(backendUrl.concat('api2/institutions/'))
      .then(response => {
        if (!response.ok) {
          throw new Error('Fail to get an university lists.');
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
        const errorKeys = Object.keys(err); 
        if (errorKeys.length > 0) {
          const firstKey = errorKeys[0];
          const firstMessage = err[firstKey][0]; 
          setError(firstMessage);
        } else {
          setError("An unknown error occurred.");
        }
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleInstitutionsChange = (event) => {
    const selectedInstitute = event.target.value;
    setUser(prevUser => ({ ...prevUser, institute: selectedInstitute }));
  };

  const handleFieldsChange = (event) => {
    const selectedField = event.target.value;
    setUser(prevUser => ({ ...prevUser, research_field: selectedField }));
  };
  const handleProtect = () => {
    navigate("/sign-in");
  };

  return !useAuth() ? (
    <div>
      {/* Main Form */}
      <main className="form-signin w-100 m-auto">
        <form onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 fw-normal"  data-testid="register-title">Please register</h1>

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
            <select
              name="institute"
              className="form-select form-select-lg mb-3"
              id="floatingInputInstitute"
              value={user.institute}
              onChange={handleInstitutionsChange}
              style={{ fontSize: '12px' }}
            >
              <option value="" disabled>
                Select an institution
              </option>
              {institutions.map((inst, index) => (
                <option key={index} value={inst.name}>
                  {inst.name}
                </option>
              ))}
            </select>
          
            <label htmlFor="floatingInputInstitute">Academic Institution</label>
          </div>

          <div className="form-floating">
            <select
              name="research_field"
              className="form-select form-select-lg mb-3"
              id="floatingInputResearch"
              value={user.research_field} 
              style={{ fontSize: '12px' }}
              onChange={handleFieldsChange}
            >
              <option value="" disabled>
                Select a Research Field
              </option>
              {fields.map((inst, index) => (
                <option key={index} value={inst.name} >
                  {inst.name}
                </option>
              ))}
            </select>
            <label htmlFor="floatingInputResearch">Research Field</label>
          </div>

        <div className="form-floating position-relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            onChange={handleChange}
          />
          <label htmlFor="floatingPassword">Password</label>
          
          <button 
            type="button"
            onClick={toggleShowPassword}
            className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
            style={{ textDecoration: 'none' }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
      </div>

      <div className="form-floating position-relative mt-3">
        <input
          type={showPassword ? "text" : "password"}
          name="password2"
          className="form-control"
          id="floatingPasswordConfirm"
          placeholder="Confirm Password"
          onChange={handleChange}
        />
        <label htmlFor="floatingPasswordConfirm">Confirm Password</label>
        <button 
          type="button"
          onClick={toggleShowPassword}
          className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
          style={{ textDecoration: 'none' }}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
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
