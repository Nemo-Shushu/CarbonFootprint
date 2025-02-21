import { useState, useEffect } from 'react';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        getSession();
    }, []);
        
    function getSession() {
        fetch(backendUrl + "api2/session/", {
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.isAuthenticated) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return isAuthenticated;
};