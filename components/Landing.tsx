import { useLoaderData } from "react-router";
import logo from "../src/assets/Loves_logo.png";

export default function Landing() { 
    const data = useLoaderData();  // Difference between destructuring and just using the response
    
    // useEffect(() => {
    //     if (revalidator.state !== "idle") return;
    //     const timeoutId = setTimeout(() => {
    //         revalidator.revalidate()
    //         console.log("effect ran, state:", revalidator.state);
    //     }, INTERVAL);
        
    //     return () => clearTimeout(timeoutId)
    // }, [revalidator.state])

    return (
        <main className="landing-container">
            <h1>STAY ON TRACK</h1>
            <img src={logo}/>
            <button className="button login"></button>
            <button className="button sign-up"></button>
        </main>
    ); 
}
