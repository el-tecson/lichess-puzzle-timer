import { Link } from 'react-router-dom'
import Logo from '@/assets/lptimer-logo-wide.svg?react'

export default function Navbar() {
    return (
        <nav className="navbar">
            <Link to="/">
                <Logo className="logo" />
            </Link>
            <div className="links">
                <Link to="/about">
                    <p className="link">About</p>
                </Link>
                <Link to="/how-to-use">
                    <p className="link">How to Use</p>
                </Link>
                <Link to="/settings">
                    <p className="link">Settings</p>
                </Link>
            </div>
        </nav>
    )
}