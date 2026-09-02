import { Link } from "react-router";
import { motion } from 'motion/react';

export function AuthDropdownMenu() {


    return (
        <motion.div className="dropdown-menu-container">
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
        <motion.div className="dropdown-menu-container">
            <ul className="dropdown-menu">
                <li><Link to="/login">Login</Link></li>
                 <li className="seperator"></li>
                <li><Link to="/signup">Sign up</Link></li>
            </ul>
        </motion.div>
    )


}