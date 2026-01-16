import React from 'react';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import './UserDashboard.css';

const UserDashboard = () => {
    const { data, isLoading, error } = useGetMyOrdersQuery();
    const orders = data?.data || [];

    return (
        <div className="user-dashboard">
            <h1>My Account</h1>
            <h2>Order History</h2>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="error">{error?.data?.message || error.error}</Message>
            ) : (
                <div className="user-orders">
                    {orders.length === 0 ? (
                        <Message>No orders found.</Message>
                    ) : (
                        orders.map(order => (
                            <div key={order._id} className="order-card">
                                <div className="header">
                                    <span>Order #{order._id.substring(0, 10)}...</span>
                                    <span className={`status ${order.isPaid ? 'paid' : 'pending'}`}>
                                        {order.isPaid ? 'Paid' : 'Pending'}
                                    </span>
                                    {order.isDelivered && (
                                        <span className="status delivered">Delivered</span>
                                    )}
                                </div>
                                <div className="items">
                                    {order.items.map((item, idx) => (
                                        <div key={idx}>
                                            {item.name || item.product?.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    ))}
                                </div>
                                <div className="total">
                                    Total: ${order.totalPrice || order.total}
                                </div>
                                {order.deliveredAt && (
                                    <div className="delivery-info">
                                        Delivered on: {new Date(order.deliveredAt).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
