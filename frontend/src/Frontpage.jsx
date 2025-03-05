import { Link } from "react-router-dom";
import "./static/frontpage.css";

function Frontpage() {
  return (
    <main className="front-page">
      <div className="overlay"></div>
      <img 
      src="/images/UniLogo.png"
      alt="university of glagow logo"
      className="logo"
      />
      <div className="text-container">
        <h1>
          University of Glasgow
          <br />
          Carbon Footprint Calculator{" "}
        </h1>
        <p>
          Welcome to the Carbon Footprint Calculator, please register or sign in to get started.
        </p>
        {/* Buttons */}
        <div className="d-grid gap-2 d-sm-flex">
          <Link to="/register">
            <button type="button" className="primary-button">
              Register
            </button>
          </Link>
          <Link to="/sign-in">
            <button type="button" className="secondary-button">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Frontpage;
