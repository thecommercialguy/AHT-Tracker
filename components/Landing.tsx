import { Form, useLoaderData, useNavigate } from "react-router";
import logo from "../src/assets/Loves_logo.png";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";

export default function Landing() { 
    const data = useLoaderData();  // Difference between destructuring and just using the response
    const navigate = useNavigate();
    const {user, initializing} = useAuth();

    useEffect(() => {
        if (!user) navigate("/login");

    }, [user, initializing])
    
    
    // useEffect(() => {
    //     if (revalidator.state !== "idle") return;
    //     const timeoutId = setTimeout(() => {
    //         revalidator.revalidate()
    //         console.log("effect ran, state:", revalidator.state);
    //     }, INTERVAL);
        
    //     return () => clearTimeout(timeoutId)
    // }, [revalidator.state])

    return (
        <main className="landing-container">
            <h1 className="landing-text">STAY ON TRACK</h1>
            <img className="landing-logo"src={logo}/>
            <button className="button login">LOGIN</button>
            <button className="button sign-up">SIGN UP</button>
        </main>
    ); 
}

