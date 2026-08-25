import type { RouteObject } from "react-router";
import Layout from "./App";
import Home, { loader } from "../components/Home";
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
      { path: "about", Component: About},
      { path: '*', Component: NotFound },
    ]
  }
];