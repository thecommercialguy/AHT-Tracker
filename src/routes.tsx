import type { RouteObject } from "react-router";
import Layout from "./App";
import Home, { loader } from "../components/Home";
import Login, { loginLoader } from "../components/Login";
import SignUp, { signUpAction, signUpLoader } from "../components/SignUp";
import Landing from "../components/Landing"

function About() { return <h1>About</h1>; }
function NotFound() { return <h1>NotFound</h1>; }

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home, loader: loader },
      { path: "landing", Component: Landing },
      { path: "login", Component: Login, loader: loginLoader},
      { path: "signup", Component: SignUp, loader: signUpLoader, action: signUpAction},
      { path: "about", Component: About},
      { path: '*', Component: NotFound },
    ]
  }
];