import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-logo">
                    <Link to="/">E-Shop</Link>
                </div>

                <div className="nav-search">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch}>🔍</button>
                </div>

                <ul className="nav-links">
                    <li><Link to="/" className="nav-link">Home</Link></li>
                    <li><Link to="/cart" className="nav-link cart-link">Cart <span className="cart-badge">{cart.length}</span></Link></li>
                    {user ? (
                        <>
                            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
                            {user.role === 'admin' && <li><Link to="/admin" className="nav-link">Admin</Link></li>}
                            <li><button onClick={logout} className="nav-btn-logout">Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login" className="nav-btn nav-btn-login">Login</Link></li>
                            <li><Link to="/register" className="nav-btn nav-btn-register">Register</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
