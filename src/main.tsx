import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router'
import Home, { loader } from '../components/Home.tsx'
import Layout from './App.tsx'
import { routes } from './routes.tsx'


const router = createBrowserRouter(routes);




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
