import { Link, useNavigate } from "react-router";
import { motion, type TargetAndTransition } from 'motion/react';
import { auth } from "../src/firebase";
import { signOut } from "firebase/auth";

interface DropDownProps {
    toggleMenu: () => void;
}

const menuWhileHover = {
    backgroundColor: '#262626'
} as TargetAndTransition;
const menuWhileTap = {
    backgroundColor: '#1A1A1A'
} as TargetAndTransition;

export function AuthDropdownMenu({toggleMenu}: DropDownProps) {
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
            className="dropdown-menu-container-auth"
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
            onClick={toggleMenu}
        >
            <ul className="dropdown-menu">
                <motion.li
                    whileHover={menuWhileHover}
                    whileTap={menuWhileTap}
                ><Link to="/dashboard">Dashboard</Link></motion.li>
                <li className="seperator"></li>
                <motion.li
                    whileHover={menuWhileHover}
                    whileTap={menuWhileTap}
                ><Link to="/call-records">Call Record</Link></motion.li>
                <li className="seperator"></li>
                <motion.li
                    whileHover={menuWhileHover}
                    whileTap={menuWhileTap}
                ><Link to="/settings">Account Settings</Link></motion.li>
                <li className="seperator"></li>
                <motion.li
                    whileHover={menuWhileHover}
                    whileTap={menuWhileTap}
                ><button onClick={signOutHandler}>Sign out</button></motion.li>
            </ul>
        </motion.div>
    );


}

export function DropdownMenu({toggleMenu}: DropDownProps) {


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
            onClick={toggleMenu}
        >
            <ul className="dropdown-menu">
                <motion.li
                    whileHover={{
                        backgroundColor: '#262626'
                    }}
                    whileTap={menuWhileTap}
                ><Link to="/login">Login</Link></motion.li>
                 <li className="seperator"></li>
                <motion.li
                    whileHover={menuWhileHover}
                    whileTap={menuWhileTap}
                ><Link to="/signup">Sign up</Link></motion.li>
            </ul>
        </motion.div>
    )


}



