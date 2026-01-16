import React, { useState } from 'react';
import { useGetAllOrdersQuery, useDeliverOrderMutation } from '../slices/ordersApiSlice';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import * as XLSX from 'xlsx';
import api from '../api/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category: '',
        countInStock: '', // Changed from stock
        brand: '',
        description: '',
        imageUrl: ''
    });

    // RTK Query hooks
    const { data: productsData, isLoading: loadingProducts, refetch: refetchProducts } = useGetProductsQuery({});
    const { data: ordersData, isLoading: loadingOrders } = useGetAllOrdersQuery();
    const [createProduct] = useCreateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const [deliverOrder] = useDeliverOrderMutation();

    const products = productsData?.products || [];
    const orders = ordersData?.data || [];

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await createProduct(newProduct).unwrap();
            setNewProduct({ name: '', price: '', category: '', countInStock: '', brand: '', description: '', imageUrl: '' });
            alert('Product added successfully');
        } catch (error) {
            alert(error?.data?.message || 'Failed to add product');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id).unwrap();
                alert('Product deleted successfully');
            } catch (error) {
                alert(error?.data?.message || 'Failed to delete product');
            }
        }
    };

    const handleDeliverOrder = async (orderId) => {
        if (window.confirm('Mark this order as delivered?')) {
            try {
                await deliverOrder(orderId).unwrap();
                alert('Order marked as delivered');
            } catch (error) {
                alert(error?.data?.message || 'Failed to update order');
            }
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);

            // Upload each product
            let successCount = 0;
            for (const item of data) {
                try {
                    await api.post('/products', item);
                    successCount++;
                } catch (err) {
                    console.error("Failed to upload", item.name, err);
                }
            }
            refetchProducts();
            alert(`Bulk upload complete! ${successCount} of ${data.length} products uploaded.`);
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="tabs">
                <button
                    onClick={() => setActiveTab('products')}
                    className={activeTab === 'products' ? 'active' : ''}
                >
                    Products
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={activeTab === 'orders' ? 'active' : ''}
                >
                    Orders
                </button>
            </div>

            {activeTab === 'products' && (
                <div className="product-management">
                    <div className="add-product-form">
                        <h3>Add New Product</h3>
                        <form onSubmit={handleAddProduct}>
                            <input
                                placeholder="Name"
                                value={newProduct.name}
                                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Price"
                                type="number"
                                step="0.01"
                                value={newProduct.price}
                                onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Category"
                                value={newProduct.category}
                                onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Brand"
                                value={newProduct.brand}
                                onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })}
                            />
                            <input
                                placeholder="Stock Count"
                                type="number"
                                value={newProduct.countInStock}
                                onChange={e => setNewProduct({ ...newProduct, countInStock: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={newProduct.description}
                                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                            />
                            <input
                                placeholder="Image URL"
                                value={newProduct.imageUrl}
                                onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                            />
                            <button type="submit">Add Product</button>
                        </form>
                        <div className="bulk-upload">
                            <h3>Bulk Upload (Excel/CSV)</h3>
                            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
                        </div>
                    </div>

                    {loadingProducts ? (
                        <Loader />
                    ) : (
                        <table className="product-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Rating</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p._id}>
                                        <td>{p.name}</td>
                                        <td>${p.price}</td>
                                        <td>{p.category}</td>
                                        <td>{p.countInStock || p.stock}</td>
                                        <td>{p.rating?.toFixed(1) || 'N/A'} ({p.numReviews || 0})</td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(p._id)}
                                                className="delete-btn"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="order-management">
                    {loadingOrders ? (
                        <Loader />
                    ) : orders.length === 0 ? (
                        <Message>No orders found</Message>
                    ) : (
                        orders.map(order => (
                            <div key={order._id} className="order-card">
                                <h3>Order #{order._id.substring(0, 10)}...</h3>
                                <p>User: {order.user?.name} ({order.user?.email})</p>
                                <p>Total: ${order.totalPrice || order.total}</p>
                                <p>Paid: {order.isPaid ? `Yes (${new Date(order.paidAt).toLocaleDateString()})` : 'No'}</p>
                                <p>Delivered: {order.isDelivered ? `Yes (${new Date(order.deliveredAt).toLocaleDateString()})` : 'No'}</p>
                                {order.isPaid && !order.isDelivered && (
                                    <button
                                        onClick={() => handleDeliverOrder(order._id)}
                                        className="deliver-btn"
                                    >
                                        Mark as Delivered
                                    </button>
                                )}
                                <div className="order-items">
                                    <h4>Items:</h4>
                                    {order.items.map((item, idx) => (
                                        <div key={idx}>
                                            {item.name || item.product?.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
