import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/api';
import { CartContext } from '../context/CartContext';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const location = useLocation();

    // Hero Slider State
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", // Holiday Sale
        "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", // Tech
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"  // Fashion
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

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

    // Search Filtering
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('search');
        if (query) {
            const lowerQuery = query.toLowerCase();
            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery)
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [location.search, products]);

    const getProductsByCategory = (category) => {
        return products.filter(p => p.category === category);
    };

    const isSearching = new URLSearchParams(location.search).get('search');

    return (
        <div className="home-page">
            {/* Hero Slider - Only show if not searching */}
            {!isSearching && (
                <div className="hero-slider">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`slide ${index === currentSlide ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${slide})` }}
                        >
                            <div className="hero-content">
                                <h1>Big Summer Sale</h1>
                                <p>Up to 50% off on all major brands</p>
                            </div>
                        </div>
                    ))}
                    <div className="hero-overlay"></div>
                </div>
            )}

            <div className="home-container">
                {isSearching ? (
                    /* Search Results View */
                    <div className="search-results-section">
                        <h2>Search Results</h2>
                        <div className="product-grid">
                            {filteredProducts.length > 0 ? filteredProducts.map(product => (
                                <ProductCard key={product._id} product={product} addToCart={addToCart} />
                            )) : <p>No products found.</p>}
                        </div>
                    </div>
                ) : (
                    /* Amazon-Style Category Rows */
                    <>
                        {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'].map(category => {
                            const categoryProducts = getProductsByCategory(category);
                            if (categoryProducts.length === 0) return null;
                            return (
                                <section key={category} className="category-row">
                                    <div className="row-header">
                                        <h2>{category}</h2>
                                        <Link to={`/?search=${category}`} className="see-more">See more</Link>
                                    </div>
                                    <div className="product-slider">
                                        {categoryProducts.map(product => (
                                            <div key={product._id} className="slider-card">
                                                <Link to={`/product/${product._id}`}>
                                                    <img src={product.imageUrl} alt={product.name} />
                                                </Link>
                                                <div className="slider-info">
                                                    <p className="slider-title">{product.name}</p>
                                                    <p className="slider-price">${product.price}</p>
                                                    <button onClick={() => addToCart(product)} className="add-btn-small">Add</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}

                        {/* All Products Grid */}
                        <section className="products-section">
                            <h2 className="section-title">More to Explore</h2>
                            <div className="product-grid">
                                {products.slice(0, 12).map(product => (
                                    <ProductCard key={product._id} product={product} addToCart={addToCart} />
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

const ProductCard = ({ product, addToCart }) => (
    <div className="product-card">
        <div className="product-image-wrapper">
            <img src={product.imageUrl} alt={product.name} />
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
);

export default Home;
