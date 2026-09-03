import { Form, Link, useLoaderData, useNavigate } from "react-router";
import logo from "../src/assets/Loves_logo.png";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";

export default function Landing() { 
    const navigate = useNavigate();
    // const {user, initializing} = useAuth();

    // useEffect(() => {
    //     if (user) navigate("/dashboard");

    // }, [user, initializing])
    
    
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
            <Link className="button login" to={'/login'}>LOGIN</Link>
            <Link className="button sign-up" to={'/signup'}>SIGN UP</Link>
        </main>
    ); 
}

