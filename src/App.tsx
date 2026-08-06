import { Routes, Route, Outlet } from "react-router";
import Home from "../components/Home";
import Header from "../components/Header";
import './Header.css'
import './App.css'
import './index.css'




export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
