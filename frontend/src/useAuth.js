import { useState, useEffect } from 'react';

let backendUrl = "http://localhost:8000/";
backendUrl = "https://sh14main-django2-1.onrender.com/";

export function useAuth() {
    const [csrf, setCsrf] = useState();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        getSession();
    }, []);

    function getCSRF() {
        fetch(backendUrl.concat("api2/csrf/"), {
          credentials: "include",
        })
        .then((res) => {
          let csrfToken = res.headers.get("X-CSRFToken");
          setCsrf(csrfToken);
          console.log(csrfToken);
        })
        .catch((err) => {
          console.log(err);
        });
    }
        
    function getSession() {
        fetch(backendUrl.concat("api2/session/"), {
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.isAuthenticated) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            getCSRF();
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return isAuthenticated;
};