import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { CartContext } from '../context/CartContext';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Welcome to E-Shop</h1>
                    <p className="hero-subtitle">Discover amazing products at unbeatable prices</p>
                    <div className="hero-buttons">
                        <Link to="#products" className="btn-primary">Shop Now</Link>
                        <Link to="/register" className="btn-secondary">Join Today</Link>
                    </div>
                </div>
                <div className="hero-decoration">
                    <div className="floating-shape shape-1"></div>
                    <div className="floating-shape shape-2"></div>
                    <div className="floating-shape shape-3"></div>
                </div>
            </section>

            {/* Products Section */}
            <section className="products-section" id="products">
                <div className="home-container">
                    <h2 className="section-title">Featured Products</h2>
                    <p className="section-subtitle">Browse our collection of premium products</p>

                    <div className="product-grid">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div key={product._id} className="product-card">
                                    <div className="product-image-wrapper">
                                        <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} />
                                        <div className="product-overlay">
                                            <Link to={`/product/${product._id}`} className="quick-view">Quick View</Link>
                                        </div>
                                    </div>
                                    <div className="product-info">
                                        <h3>{product.name}</h3>
                                        <p className="product-category">{product.category}</p>
                                        <div className="product-footer">
                                            <span className="product-price">${product.price}</span>
                                            <button onClick={() => addToCart(product)} className="add-btn">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="loading-state">
                                <p>Loading amazing products...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
