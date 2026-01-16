import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, clearCartItems } from '../slices/cartSlice';
import './Cart.css';

const Cart = () => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const getTotalPrice = () => {
        return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
    };

    const getTotalItems = () => {
        return cartItems.reduce((acc, item) => acc + item.qty, 0);
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-container">
                <h2>Shopping Cart</h2>
                <p>Your cart is empty. <Link to="/">Continue Shopping</Link></p>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2>Shopping Cart</h2>
            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item._id} className="cart-item">
                        <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} />
                        <div className="item-info">
                            <h3>{item.name}</h3>
                            <p>${item.price}</p>
                        </div>
                        <div className="item-controls">
                            <span>Qty: {item.qty}</span>
                        </div>
                        <button onClick={() => removeFromCartHandler(item._id)} className="remove-btn">
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <h3>Subtotal ({getTotalItems()} items): ${getTotalPrice()}</h3>
                <button onClick={() => dispatch(clearCartItems())} className="clear-btn">Clear Cart</button>
                <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
            </div>
        </div>
    );
};

export default Cart;
