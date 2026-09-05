import { Routes, Route, Outlet, useNavigation } from "react-router";
// import '@fontsource-variable/open-sans/full-italic.css';  
import { LoaderCircle } from "lucide-react";
import { motion } from 'motion/react';
import Header from "../components/Header";
import './Header.css'
import './App.css'
import './index.css'
import './Landing.css'
import './Login.css'
import './SignUp.css'
import './Dropdown.css'
import './AccountSettings.css'




export default function Layout() {
  const navigation = useNavigation();
  return (
    <>
      <Header />
        {/* {navigation.state === "loading" &&
          <motion.div
            animate={{rotate: 360}}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              display: "flex",
              alignItems: "center", 
              justifyContent: "center",
              position: "absolute",
              top: 80,
              left: '49%'
            }}
          >
            <LoaderCircle size={32} />
          </motion.div> 
        } */}
        
      <Outlet />
    </>
  );
}
