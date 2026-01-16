import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import './Navbar.css';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-logo">
                    <Link to="/">E-Shop</Link>
                </div>

                <SearchBox />

                <ul className="nav-links">
                    <li><Link to="/" className="nav-link">Home</Link></li>
                    <li>
                        <Link to="/cart" className="nav-link cart-link">
                            Cart <span className="cart-badge">{cartItems.length}</span>
                        </Link>
                    </li>
                    {userInfo ? (
                        <>
                            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
                            {userInfo.isAdmin && <li><Link to="/admin" className="nav-link">Admin</Link></li>}
                            <li><button onClick={logoutHandler} className="nav-btn-logout">Logout</button></li>
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
