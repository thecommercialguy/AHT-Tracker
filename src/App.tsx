import { Routes, Route, Outlet } from "react-router";
// import '@fontsource-variable/open-sans/full-italic.css';  
import Home from "../components/Home";
import Header from "../components/Header";
import './Header.css'
import './App.css'
import './index.css'
import './Landing.css'
import './Login.css'
import './SignUp.css'
import './Dropdown.css'




export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
