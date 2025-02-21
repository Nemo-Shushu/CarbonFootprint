import { useEffect, useState } from "react";

const Profile = () => {
  const [username, setUserName] = useState();
  const [firstName, setFirstName] = useState();
  const [email, setEmail] = useState();
  const [institute, setInstitute] = useState();

  useEffect(() => {
    getSession();
    getName();
  }, []);

  function getSession() {
    fetch("http://localhost:8000/api2/session/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error("Error fetching session:", err);
      });
  }

  const getName = () => {
    fetch("http://localhost:8000/api2/whoami/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserName(data.username);
        setFirstName(data.forename);
        setEmail(data.email);
        setInstitute(data.institute);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  };

  return (
    <div className="bg-grey profile-card card mb-4 p-4" style={{ width: "100%", }}>
      <div className="row align-items-center">
        <div className="col-md-2">
          <img
            src="/images/default-avatar.png"
            alt="User Avatar"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
        </div>
        <div className="col-md-10 text-white">
            <p><strong>Username:</strong> {username || "Loading..."}</p>
            <p><strong>First Name:</strong> {firstName || "Loading..."}</p>
            <p><strong>Email:</strong> {email || "Loading..."}</p>
            <p><strong>Institution:</strong> {institute || "Not provided"}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
