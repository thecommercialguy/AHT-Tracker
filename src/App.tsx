import { Routes, Route, Outlet } from "react-router";
import '@fontsource-variable/open-sans';
import "@fontsource-variable/open-sans/wght.css"; // Specify axis
import "@fontsource-variable/open-sans/wght-italic.css"; 
// import '@fontsource-variable/open-sans/full-italic.css';  
import Home from "../components/Home";
import Header from "../components/Header";
import './Header.css'
import './App.css'
import './index.css'
import './Landing.css'




export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
