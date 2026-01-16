import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Rating from '../components/Rating';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const { data: productData, isLoading, error, refetch } = useGetProductDetailsQuery(id);
    const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation();

    const product = productData?.data;

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, qty: 1 }));
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        try {
            await createReview({ productId: id, rating, comment }).unwrap();
            refetch();
            setRating(0);
            setComment('');
            alert('Review submitted successfully!');
        } catch (err) {
            alert(err?.data?.message || 'Failed to submit review');
        }
    };

    if (isLoading) return <Loader />;
    if (error) return <Message variant="error">{error?.data?.message || error.error}</Message>;

    return (
        <div className="product-detail">
            <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} />
            <div className="details">
                <h2>{product.name}</h2>
                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                <p className="price">${product.price}</p>
                <p className="desc">{product.description}</p>
                <p>Category: {product.category}</p>
                <p>Brand: {product.brand || 'N/A'}</p>
                <p>Stock: {product.countInStock > 0 ? `${product.countInStock} available` : 'Out of Stock'}</p>
                <button
                    onClick={handleAddToCart}
                    className="add-btn"
                    disabled={product.countInStock === 0}
                >
                    {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
                <h3>Reviews</h3>
                {product.reviews && product.reviews.length === 0 && <Message>No reviews yet</Message>}
                <div className="reviews-list">
                    {product.reviews && product.reviews.map((review) => (
                        <div key={review._id} className="review">
                            <strong>{review.name}</strong>
                            <Rating value={review.rating} />
                            <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                            <p>{review.comment}</p>
                        </div>
                    ))}
                </div>

                {/* Write Review Form */}
                <div className="write-review">
                    <h4>Write a Review</h4>
                    {loadingReview && <Loader />}
                    <form onSubmit={submitReviewHandler}>
                        <div>
                            <label>Rating</label>
                            <select value={rating} onChange={(e) => setRating(e.target.value)} required>
                                <option value="">Select...</option>
                                <option value="1">1 - Poor</option>
                                <option value="2">2 - Fair</option>
                                <option value="3">3 - Good</option>
                                <option value="4">4 - Very Good</option>
                                <option value="5">5 - Excellent</option>
                            </select>
                        </div>
                        <div>
                            <label>Comment</label>
                            <textarea
                                rows="3"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" disabled={loadingReview}>
                            Submit Review
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
