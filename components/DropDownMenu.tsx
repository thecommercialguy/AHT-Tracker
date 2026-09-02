

export function AuthDropdownMenu() {


    return (
        <div className="dropdown-menu-container">
            <ul className="dropdown-menu">
                <li><Link to="/settings">Account Setting</Link></li>
                <li className="seperator"></li>
                <li>Sign out</li>
            </ul>
        </div>
    );


}

export function DropdownMenu() {


    return (
        <div className="dropdown-menu-container">
            <ul className="dropdown-menu">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign up</Link></li>
            </ul>
        </div>
    )


}