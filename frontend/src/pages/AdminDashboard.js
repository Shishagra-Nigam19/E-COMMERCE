import React, { useState, useEffect } from 'react';
import api from '../api/api';
import * as XLSX from 'xlsx';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', stock: '', description: '', imageUrl: '' });
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchProducts = async () => {
        const { data } = await api.get('/products');
        setProducts(data.data);
    };

    const fetchOrders = async () => {
        const { data } = await api.get('/orders');
        setOrders(data.data);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', newProduct);
            fetchProducts();
            setNewProduct({ name: '', price: '', category: '', stock: '', description: '', imageUrl: '' });
            alert('Product added');
        } catch (error) {
            alert('Failed to add product');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await api.delete(`/products/${id}`);
            fetchProducts();
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
            for (const item of data) {
                try {
                    await api.post('/products', item);
                } catch (err) {
                    console.error("Failed to upload", item.name);
                }
            }
            fetchProducts();
            alert('Bulk upload complete');
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="tabs">
                <button onClick={() => setActiveTab('products')} className={activeTab === 'products' ? 'active' : ''}>Products</button>
                <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>Orders</button>
            </div>

            {activeTab === 'products' && (
                <div className="product-management">
                    <div className="add-product-form">
                        <h3>Add New Product</h3>
                        <form onSubmit={handleAddProduct}>
                            <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
                            <input placeholder="Price" type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
                            <input placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} required />
                            <input placeholder="Stock" type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} required />
                            <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                            <input placeholder="Image URL" value={newProduct.imageUrl} onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })} />
                            <button type="submit">Add Product</button>
                        </form>
                        <div className="bulk-upload">
                            <h3>Bulk Upload (Excel/CSV)</h3>
                            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
                        </div>
                    </div>

                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p._id}>
                                    <td>{p.name}</td>
                                    <td>${p.price}</td>
                                    <td>{p.category}</td>
                                    <td>{p.stock}</td>
                                    <td>
                                        <button onClick={() => handleDelete(p._id)} className="delete-btn">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="order-management">
                    {orders.map(order => (
                        <div key={order._id} className="order-card">
                            <h3>Order #{order._id}</h3>
                            <p>User: {order.user?.name} ({order.user?.email})</p>
                            <p>Total: ${order.total}</p>
                            <p>Status: {order.paymentStatus}</p>
                            <div className="order-items">
                                {order.items.map((item, idx) => (
                                    <div key={idx}>
                                        {item.product?.name} x {item.quantity}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
