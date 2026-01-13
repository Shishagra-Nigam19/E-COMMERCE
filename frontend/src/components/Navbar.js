import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-logo">
                    <Link to="/">E-Shop</Link>
                </div>

                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/cart">Cart ({cart.length})</Link></li>
                    {user ? (
                        <>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            {user.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
                            <li><button onClick={logout}>Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
