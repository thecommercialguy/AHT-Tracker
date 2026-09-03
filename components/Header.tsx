import { Link } from 'react-router';
import logo from '../src/assets/Loves_logo.png';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useMemo, useState } from 'react';
import { AuthDropdownMenu, DropdownMenu } from './DropDownMenu';
import { useAuth } from '../context/authContext';


export default function Header() {

    const [menuActive, setMenuActive] = useState<boolean>(false);

    const { user, initializing } = useAuth();


    const Menu = () => {
        
        return user ? <AuthDropdownMenu /> : <DropdownMenu />
    }
    console.log(menuActive)
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
                <motion.button 
                    className="menu-container"
                    onTapStart={() => setMenuActive(!menuActive)}
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
                    <AnimatePresence>
                        {   
                            menuActive && 
                            <Menu />
                        }
                    </AnimatePresence>
                </motion.button>
            </nav>
        </header>
    )


}