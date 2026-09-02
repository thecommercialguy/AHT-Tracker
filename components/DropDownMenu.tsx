import { Link } from "react-router";
import { motion } from 'motion/react';

export function AuthDropdownMenu() {


    return (
        <motion.div
            key="auth"
            className="dropdown-menu-container"
            style={{ transformOrigin: 'top'}}
            initial={{
                scale: 0, 
                opacity: 0
            }}
            animate={{
                scale: 1, 
                opacity: 1
            }}
            exit={{
                scale: 1, 
                opacity: 1
            }}
        >
            <ul className="dropdown-menu">
                <li><Link to="/settings">Account Setting</Link></li>
                <li className="seperator"></li>
                <li>Sign out</li>
            </ul>
        </motion.div>
    );


}

export function DropdownMenu() {


    return (
        <motion.div
            key="anon" 
            className="dropdown-menu-container"
            style={{ transformOrigin: 'top'}}
            initial={{
                scale: 0, 
                opacity: 0
            }}
            animate={{
                scale: 0, 
                opacity: 0
            }}
            exit={{
                scale: 0, 
                opacity: 0
            }}
        >
            <ul className="dropdown-menu">
                <li><Link to="/login">Login</Link></li>
                 <li className="seperator"></li>
                <li><Link to="/signup">Sign up</Link></li>
            </ul>
        </motion.div>
    )


}



