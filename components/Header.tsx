import { Link } from 'react-router'
import logo from '../src/assets/Loves_logo.png'


export default function Header() {


    return (
        <header className="header">
            <Link to='/'>
                <span className="logo-container">
                    <img className="logo" src={logo}/>
                    <h1 className="logo-text">
                        <span className={"logo-text-styled"}>AHT</span>
                        <span>Tracker</span>
                    </h1>
                </span>
            </Link>
        </header>
    )


}