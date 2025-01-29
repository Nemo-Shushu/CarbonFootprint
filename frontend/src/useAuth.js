import { useState, useEffect } from 'react';

export function useAuth() {
    const [csrf, setCsrf] = useState();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        getSession();
    }, []);

    function getCSRF() {
        fetch("http://localhost:8000/api2/csrf/", {
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
        fetch("http://localhost:8000/api2/session/", {
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