import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Rating from '../components/Rating';
import './Home.css';

const Home = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    const page = Number(searchParams.get('page')) || 1;

    // Fetch products with pagination and search
    const { data, isLoading, error } = useGetProductsQuery({ keyword, page });

    // Hero Slider State
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleAddToCart = (product) => {
        dispatch(addToCart({ ...product, qty: 1 }));
    };

    const getProductsByCategory = (category) => {
        if (!data?.products) return [];
        return data.products.filter(p => p.category === category);
    };

    return (
        <div className="home-page">
            {/* Hero Slider - Only show if not searching */}
            {!keyword && (
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
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="error">{error?.data?.message || error.error}</Message>
                ) : (
                    <>
                        {keyword ? (
                            /* Search Results View */
                            <div className="search-results-section">
                                <h2>Search Results for "{keyword}"</h2>
                                <div className="product-grid">
                                    {data.products && data.products.length > 0 ? (
                                        data.products.map(product => (
                                            <ProductCard
                                                key={product._id}
                                                product={product}
                                                addToCart={handleAddToCart}
                                            />
                                        ))
                                    ) : (
                                        <p>No products found.</p>
                                    )}
                                </div>
                                <Paginate pages={data.pages} page={data.page} keyword={keyword} />
                            </div>
                        ) : (
                            /* Category Rows */
                            <>
                                {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'].map(category => {
                                    const categoryProducts = getProductsByCategory(category);
                                    if (categoryProducts.length === 0) return null;
                                    return (
                                        <section key={category} className="category-row">
                                            <div className="row-header">
                                                <h2>{category}</h2>
                                                <Link to={`/?keyword=${category}`} className="see-more">See more</Link>
                                            </div>
                                            <div className="product-slider">
                                                {categoryProducts.slice(0, 5).map(product => (
                                                    <div key={product._id} className="slider-card">
                                                        <Link to={`/product/${product._id}`}>
                                                            <img src={product.imageUrl} alt={product.name} />
                                                        </Link>
                                                        <div className="slider-info">
                                                            <p className="slider-title">{product.name}</p>
                                                            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                                                            <p className="slider-price">${product.price}</p>
                                                            <button onClick={() => handleAddToCart(product)} className="add-btn-small">Add</button>
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
                                        {data.products && data.products.slice(0, 12).map(product => (
                                            <ProductCard
                                                key={product._id}
                                                product={product}
                                                addToCart={handleAddToCart}
                                            />
                                        ))}
                                    </div>
                                    <Paginate pages={data.pages} page={data.page} />
                                </section>
                            </>
                        )}
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
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            <div className="product-footer">
                <span className="product-price">${product.price}</span>
                <button onClick={() => addToCart(product)} className="add-btn">Add to Cart</button>
            </div>
        </div>
    </div>
);

export default Home;
