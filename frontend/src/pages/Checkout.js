import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import api from '../api/api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const [createOrder, { isLoading }] = useCreateOrderMutation();

    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    const handleChange = e => setAddress({ ...address, [e.target.name]: e.target.value });

    const getTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
    };

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

        try {
            const res = await loadRazorpayScript();
            if (!res) {
                alert('Razorpay SDK failed to load');
                setLoading(false);
                return;
            }

            // Create Order
            const orderPayload = {
                items: cartItems.map(i => ({
                    product: i._id,
                    quantity: i.qty,
                    price: i.price
                }))
            };
            const { data } = await api.post('/payment/create-order', orderPayload);

            const options = {
                key: data.data.key,
                amount: data.data.amount,
                currency: data.data.currency,
                name: "E-Commerce Store",
                description: "Purchase Transaction",
                order_id: data.data.orderId,
                handler: async function (response) {
                    try {
                        await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        // Complete order using RTK Query
                        const itemsPrice = parseFloat(getTotal());
                        const taxPrice = parseFloat((itemsPrice * 0.15).toFixed(2));
                        const shippingPrice = itemsPrice > 100 ? 0 : 10;
                        const totalPrice = (itemsPrice + taxPrice + shippingPrice).toFixed(2);

                        await createOrder({
                            items: cartItems.map(i => ({
                                product: i._id,
                                quantity: i.qty,
                                price: i.price,
                                name: i.name,
                                imageUrl: i.imageUrl
                            })),
                            shippingAddress: address,
                            paymentMethod: 'Razorpay',
                            taxPrice,
                            shippingPrice,
                            totalPrice,
                        }).unwrap();

                        dispatch(clearCartItems());
                        alert('Order placed successfully!');
                        navigate('/dashboard');
                    } catch (error) {
                        console.error(error);
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: userInfo?.name || '',
                    email: userInfo?.email || ''
                },
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

    if (cartItems.length === 0) {
        return (
            <div className="checkout-container">
                <Message variant="info">Your cart is empty</Message>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            {(isLoading || loading) && <Loader />}
            <form onSubmit={handlePayment} className="shipping-form">
                <h3>Shipping Address</h3>
                <input name="street" placeholder="Street Address" onChange={handleChange} required />
                <input name="city" placeholder="City" onChange={handleChange} required />
                <input name="state" placeholder="State" onChange={handleChange} required />
                <input name="zipCode" placeholder="Zip Code" onChange={handleChange} required />
                <input name="country" placeholder="Country" onChange={handleChange} required />

                <div className="summary">
                    <h3>Order Summary</h3>
                    <p>Items Total: ${getTotal()}</p>
                    <p>Tax (15%): ${(parseFloat(getTotal()) * 0.15).toFixed(2)}</p>
                    <p>Shipping: ${parseFloat(getTotal()) > 100 ? '0.00' : '10.00'}</p>
                    <h3>Total: ${(parseFloat(getTotal()) + parseFloat(getTotal()) * 0.15 + (parseFloat(getTotal()) > 100 ? 0 : 10)).toFixed(2)}</h3>
                    <button type="submit" disabled={loading || isLoading}>
                        {loading || isLoading ? 'Processing...' : 'Pay with Razorpay'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
