import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./static/frontpage.css";

function Frontpage() {
  return (
    <main>
      <h1 className="visually-hidden">Heroes examples</h1>

      <div className="px-4 py-5 my-5 text-center">
        <h1 className="display-5 fw-bold text-body-emphasis">Carbon Footprint Calculator</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            Welcome to the Carbon Footprint Tool
            <br />
            Register or Login to Get Started
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Link to="/register">
                <button type="button" className="btn btn-success btn-lg px-4 gap-3">
                    Register
                </button>
            </Link>
            <Link to="/sign-in">
                <button type="button" className="btn btn-outline-success btn-lg px-4">
                    Sign In
                </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Frontpage;
