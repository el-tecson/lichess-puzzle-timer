import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/assets/lptimer-logo-wide.svg?react';
import MenuIcon from '@/assets/menu.svg?react';
import {
    Sidebar,
    Menu,
    MenuItem,
} from 'react-pro-sidebar';

export default function Navbar() {
    const location = useLocation();
    const path = location.pathname;
    const [toggled, setToggled] = useState(false);

    return (
        <nav className="navbar">
            <Link to="/">
                <Logo className="logo" />
            </Link>
            <div className="links">
                <Link to="/about">
                    <p className={`link ${path === '/about' || path === '/' ? 'active' : ''}`}>
                        About
                    </p>
                </Link>
                <Link to="/how-to-use">
                    <p className={`link ${path === '/how-to-use' ? 'active' : ''}`}>How to Use</p>
                </Link>
                <Link to="/settings">
                    <p className={`link ${path === '/settings' ? 'active' : ''}`}>Settings</p>
                </Link>
                <Link to="https://ko-fi.com/emmanuelleutecson" target="_blank" rel="noopener noreferrer">
                    <p className={`link support-link ${path === '/settings' ? 'active' : ''}`}>
                        Support
                    </p>
                </Link>
            </div>
            <button
                className="mobile-navbar-btn"
                onClick={() => setToggled(!toggled)}
                style={{
                    display: 'none',
                }}
            >
                <MenuIcon className="menu-icon" />
            </button>

            <Sidebar
                className="mobile-navbar" 
                toggled={toggled}
                breakPoint="md"
                style={{ display: 'none' }}
                onBackdropClick={() => setToggled(false)}
            >
                <Menu className="menu">
                    <MenuItem className="menu-item">
                        <Link to="/about">
                            <p className={`link ${path === '/about' || path === '/' ? 'active' : ''}`}>
                                About
                            </p>
                        </Link>
                    </MenuItem>
                    <MenuItem className="menu-item">
                        <Link to="/how-to-use">
                            <p className={`link ${path === '/how-to-use' ? 'active' : ''}`}>How to Use</p>
                        </Link>
                    </MenuItem>
                    <MenuItem className="menu-item">
                        <Link to="/settings">
                            <p className={`link ${path === '/settings' ? 'active' : ''}`}>Settings</p>
                        </Link>
                    </MenuItem>
                    <MenuItem className="menu-item">
                        <Link to="https://ko-fi.com/emmanuelleutecson" target="_blank" rel="noopener noreferrer">
                            <p className={`link support-link ${path === '/settings' ? 'active' : ''}`}>Support</p>
                        </Link>
                    </MenuItem>
                </Menu>
            </Sidebar>
        </nav>
    );
}
