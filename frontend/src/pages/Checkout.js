import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import './Checkout.css';

const Checkout = () => {
    const { cart, getTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: '' });

    const handleChange = e => setAddress({ ...address, [e.target.name]: e.target.value });

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simple Razorpay integration
        try {
            const res = await loadRazorpayScript();
            if (!res) {
                alert('Razorpay SDK failed to load');
                setLoading(false);
                return;
            }

            // Create Order
            const orderPayload = {
                items: cart.map(i => ({ product: i.product._id, quantity: i.quantity }))
            };
            const { data } = await api.post('/payment/create-order', orderPayload);

            const options = {
                key: data.data.key,
                amount: data.data.amount,
                currency: data.data.currency,
                name: "E-Store",
                description: "Test Transaction",
                order_id: data.data.orderId,
                handler: async function (response) {
                    try {
                        await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        // Complete order
                        await api.post('/payment/complete-order', {
                            items: cart.map(i => ({ product: i.product._id, quantity: i.quantity })),
                            shippingAddress: address,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id
                        });

                        clearCart();
                        alert('Order successful!');
                        navigate('/');
                    } catch (error) {
                        alert('Payment verification failed');
                    }
                },
                prefill: { name: user.name, email: user.email },
                theme: { color: "#3399cc" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            alert('Checkout failed');
        }
        setLoading(false);
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <form onSubmit={handlePayment} className="shipping-form">
                <input name="street" placeholder="Street" onChange={handleChange} required />
                <input name="city" placeholder="City" onChange={handleChange} required />
                <input name="state" placeholder="State" onChange={handleChange} required />
                <input name="zipCode" placeholder="Zip Code" onChange={handleChange} required />
                <input name="country" placeholder="Country" onChange={handleChange} required />

                <div className="summary">
                    <h3>Total: ${getTotal()}</h3>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Processing...' : 'Pay with Razorpay'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
