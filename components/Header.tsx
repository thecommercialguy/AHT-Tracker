import { Link } from 'react-router';
import logo from '../src/assets/Loves_logo.png';
import { motion } from 'motion/react';
import { useState } from 'react';
import { DropdownMenu } from './DropDownMenu';


export default function Header() {

    const [menuActive, setMenuActive] = useState<boolean>(false);

    const { user, initializing } = useAuth();

    return (
        <header className="header">
            <nav>
                <Link to='/'>
                    <span className="logo-container">
                        <img className="logo" src={logo}/>
                        <h1 className="logo-text">
                            <span className="logo-text-styled">AHT</span>
                            <span>Tracker</span>
                        </h1>
                    </span>
                </Link>
                <motion.div 
                    className="menu-container"
                    onTap={() => setMenuActive(!menuActive)}
                >
                    <motion.div 
                        className="bar top"
                        animate={{
                            rotate: menuActive ? -45 : 0,
                            y: menuActive ? 10 : 0
                        }}
                    >
                    </motion.div>
                    <motion.div 
                        className="bar middle"
                        animate={{
                            opacity: menuActive ? 0 : 1,
                            scale: menuActive ? .01 : 1
                        }}
                    >
                    </motion.div>
                    <motion.div 
                        className="bar bottom"
                        animate={{
                            rotate: menuActive ? 45 : 0,
                            y: menuActive ? -10 : 0
                        }}
                    >
                    </motion.div>
                    {   
                        menuActive && 
                        user ? <AuthDropDownMenu /> : 
                        <DropdownMenu />
                    }
                </motion.div>
            </nav>
        </header>
    )


}