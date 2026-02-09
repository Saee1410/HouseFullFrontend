// GoogleSuccess.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode lagel

const GoogleSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);
            
            // Token madhun data kadha ani 'loggedInUser' madhe save kara
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded token:", decoded);
                // Backend kadhun profile data milvnyasathi ek call dya kiva 
                // jar token madhech name/email asel tar ithech set kara
                localStorage.setItem("loggedInUser", JSON.stringify({
                    email: decoded.email, // Check kara tujhya token madhe email aahe ka
                    name: decoded.name
                }));
            } catch (err) {
                console.error("Token decode error", err);
            }

            navigate('/');
        }
    }, [navigate]);

    return <h3>Logging in with Google...</h3>;
};

export default GoogleSuccess;