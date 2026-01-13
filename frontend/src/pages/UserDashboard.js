import React, { useState, useEffect } from 'react';
import api from '../api/api';
import './UserDashboard.css';

const UserDashboard = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const { data } = await api.get('/orders/my-orders');
            setOrders(data.data);
        };
        fetchOrders();
    }, []);

    return (
        <div className="user-dashboard">
            <h1>My Acount</h1>
            <h2>Order History</h2>
            <div className="user-orders">
                {orders.length === 0 ? <p>No orders found.</p> : (
                    orders.map(order => (
                        <div key={order._id} className="order-card">
                            <div className="header">
                                <span>Order #{order._id}</span>
                                <span className={`status ${order.paymentStatus}`}>{order.paymentStatus}</span>
                            </div>
                            <div className="items">
                                {order.items.map((item, idx) => (
                                    <div key={idx}>
                                        {item.product?.name} x {item.quantity} - ${item.price * item.quantity}
                                    </div>
                                ))}
                            </div>
                            <div className="total"> Total: ${order.total} </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
