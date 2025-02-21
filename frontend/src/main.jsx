import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterForm from './RegisterForm';
import SignInForm from './SignInForm';
import { Dashboard } from './Dashboard';
import Frontpage from './Frontpage';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import RequestAdmin from './RequestAdmin';
import { Calculator } from './calculator';
import Profile from './Profile';
import AdminTool from './AdminTools';
import ManageFactors from './features/ManageFactors/components/ManageFactors';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={<Frontpage />}/>
        <Route path="sign-in" element={<SignInForm />}/>
        <Route path="register" element={<RegisterForm />}/>
        <Route path="dashboard" element={<Dashboard />}/>
        <Route path="request-admin" element={<RequestAdmin />}/>
        <Route path="manage-factors" element={<ManageFactors />}/>
        <Route path="calculator/*" element={<Calculator />}/>
        <Route path="profile" element={<Profile />}/>
        <Route path="admin-tool" element={<AdminTool />}/>
      </Route>
    </Routes>
  </BrowserRouter>
);