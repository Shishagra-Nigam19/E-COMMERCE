import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useContext(CartContext);

    if (cart.length === 0) return <div className="cart-container">Your cart is empty</div>;

    return (
        <div className="cart-container">
            <h2>Shopping Cart</h2>
            <div className="cart-items">
                {cart.map(item => (
                    <div key={item.product._id} className="cart-item">
                        <img src={item.product.imageUrl || 'https://via.placeholder.com/50'} alt={item.product.name} />
                        <div className="item-info">
                            <h3>{item.product.name}</h3>
                            <p>${item.product.price}</p>
                        </div>
                        <div className="item-controls">
                            <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.product._id)} className="remove-btn">Remove</button>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <h3>Total: ${getTotal()}</h3>
                <button onClick={clearCart} className="clear-btn">Clear Cart</button>
                <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
            </div>
        </div>
    );
};

export default Cart;
