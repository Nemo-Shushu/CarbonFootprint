import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Redirect } from "react-router-dom";
import App from './App';
import reportWebVitals from './reportWebVitals';
import RegisterForm from './RegisterForm';
import SignInForm from './SignInForm';
import { Dashboard, TableComponent } from './Dashboard';
import Frontpage from './Frontpage';
import 'bootstrap/dist/css/bootstrap.min.css'
import RequestAdmin from './RequestAdmin';
import { Calculator } from './calculator';
import CalculationBar from './CalculationBar';
import Profile from './Profile';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  //   <Frontpage />
  // </React.StrictMode>
  <BrowserRouter>
      <Routes>
          <Route path="/">
            <Route index element={<Frontpage />}/>
            <Route path="sign-in" element={<SignInForm />}/>
            <Route path="register" element={<RegisterForm />}/>
            <Route path="dashboard" element={<Dashboard />}/>
            <Route path="request-admin" element={<RequestAdmin />}/>
            <Route path="calculator/*" element={<Calculator />}/>
            <Route path="calculationBar" element={<CalculationBar />}/>
            <Route path="profile" element={<Profile />}/>
          </Route>
      </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
