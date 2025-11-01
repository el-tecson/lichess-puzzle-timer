import { Link, useLocation } from 'react-router-dom'
import Logo from '@/assets/lptimer-logo-wide.svg?react'

export default function Navbar() {
    const location = useLocation();
    const path = location.pathname;

    return (
        <nav className="navbar">
            <Link to="/">
                <Logo className="logo" />
            </Link>
            <div className="links">
                <Link to="/about">
                    <p className={`link ${path === "/about" || path === "/" ? "active" : ""}`}>About</p>
                </Link>
                <Link to="/how-to-use">
                    <p className={`link ${path === "/how-to-use" ? "active" : ""}`}>How to Use</p>
                </Link>
                <Link to="/settings">
                    <p className={`link ${path === "/settings" ? "active" : ""}`}>Settings</p>
                </Link>
            </div>
        </nav>
    )
}