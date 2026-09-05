import { Link, useNavigate } from "react-router";
import { motion } from 'motion/react';
import { auth } from "../src/firebase";
import { signOut } from "firebase/auth";

export function AuthDropdownMenu() {
    const navigate = useNavigate();

    const signOutHandler = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Error signing out');
        }

    }

    return (
        <motion.div
            key="auth"
            className="dropdown-menu-container"
            style={{ transformOrigin: '85% top'}}
            initial={{
                scale: 0, 
                opacity: 0
            }}
            animate={{
                scale: 1, 
                opacity: 1
            }}
            exit={{
                scale: 0, 
                opacity: 0
            }}
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
        >
            <ul className="dropdown-menu">
                <li><Link to="/settings">Account Settings</Link></li>
                <li className="seperator"></li>
                <li><button onClick={signOutHandler}>Sign out</button></li>
            </ul>
        </motion.div>
    );


}

export function DropdownMenu() {


    return (
        <motion.div
            key="anon" 
            className="dropdown-menu-container"
            style={{ transformOrigin: '85% top'}}
            initial={{
                scale: 0, 
                opacity: 0
            }}
            animate={{
                scale: 1, 
                opacity: 1
            }}
            exit={{
                scale: 0, 
                opacity: 0
            }}
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
        >
            <ul className="dropdown-menu">
                <li><Link to="/login">Login</Link></li>
                 <li className="seperator"></li>
                <li><Link to="/signup">Sign up</Link></li>
            </ul>
        </motion.div>
    )


}



