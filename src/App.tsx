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
import './SnackBar.css'
import { SnackBar, useErrorContext } from "../context/errorContext";




export default function Layout() {
  const navigation = useNavigation();
  const isLoading = navigation.state == "loading";

  const { errorMessage, isActive } = useErrorContext();

  // is active to display snack bar
  // "isActive" can be toggled from the snackbar
  // "message" can be set from child
  // "message" will be displayed by snackbar from context
  // "isActive" can also be managed from snackbar

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
        
      {/* <Outlet /> */}
      {/* <div style={{ opacity: navigation.state === "loading" ? 0.6 : 1 }}>
      </div> */}
        <Outlet />
      
    </>
  );
}


