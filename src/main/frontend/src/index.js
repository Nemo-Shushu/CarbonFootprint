import React from 'react';
import ReactDOM from 'react-dom/client';
import './static/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import RegisterForm from './RegisterForm';
import SignInForm from './SignInForm';
import { Dashboard, TableComponent} from './Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Dashboard />
    <TableComponent />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
