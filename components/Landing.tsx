import { Form, Link, useLoaderData, useNavigate } from "react-router";
import logo from "../src/assets/Loves_logo.png";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";
import { motion } from "motion/react";

const MotionLink = motion.create(Link);
export default function Landing() { 
    const navigate = useNavigate();
    const {user, initializing} = useAuth();

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
            {
                user ? 
                    <MotionLink 
                        className="button sign-up"
                        whileTap={{
                            background: 'linear-gradient(to bottom, #FF7B00 -50%, #FF0000)',
                            scale: .95
                        }}
                        transition={{
                            ease: 'easeIn', 
                            duration: .15
                        }}
                        to={'/dashboard'}>VIEW DASHBOARD</MotionLink>
                : 
            
                <div>
                    <MotionLink 
                        className="button login"
                        whileTap={{
                            border: '1px solid #FFE600',
                            color: '#FFE600',
                            scale: .95
                        }}
                        transition={{
                            ease: 'easeIn', 
                            duration: .15
                        }} 
                        to={'/login'}>LOGIN</MotionLink>

                    <MotionLink 
                        className="button sign-up"
                        whileTap={{
                            background: 'linear-gradient(to bottom, #FF7B00 -50%, #FF0000)',
                            scale: .95
                        }}
                        transition={{
                            ease: 'easeIn', 
                            duration: .15
                        }}
                        to={'/signup'}>SIGN UP</MotionLink>
                </div>
            }
        </main>
    ); 
}

