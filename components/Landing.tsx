import { Form, Link, useLoaderData, useNavigate } from "react-router";
import logo from "../src/assets/Loves_logo.png";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";
import { easeIn, motion } from "motion/react";

const MotionLink = motion.create(Link);
export default function Landing() { 
    const navigate = useNavigate();
    const {user, initializing} = useAuth();


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
                        whileHover={{
                            background: 'linear-gradient(to bottom, #FF7B00 -50%, #FF0000)',
                            scale: 1.05,
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
                        style={{border: '1px solid white'}}
                        whileTap={{
                            border: '1px solid #FFE600',
                            color: '#FFE600',
                            scale: .97
                        }}
                        whileHover={{
                            // border: ['1px solid ', '1px solid #FF7B00', '1px solid ', '1px solid red'],
                            border: '1px solid #FFE600',
                            color: '#FFE600',
                            scale: 1.03,
                        }}
                        transition={{
                            ease: 'easeIn', 
                            duration: .15, 
                            scale: { duration: .15, ease: 'easeIn'},
                            border: { duration: .5, ease: 'easeInOut'}
                        }} 
                        to={'/login'}>LOGIN</MotionLink>

                    <MotionLink 
                        className="button sign-up"
                        whileTap={{
                            background: 'linear-gradient(to bottom, #FF7B00 -50%, #FF0000)',
                            scale: .97
                        }}
                        whileHover={{
                            background: 'linear-gradient(to bottom, #FF7B00 -50%, #FF0000)',
                            scale: 1.03,
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

