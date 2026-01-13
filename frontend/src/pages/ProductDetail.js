import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { CartContext } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data.data);
            } catch (error) {
                console.error("Failed to fetch product");
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) return <div>Loading...</div>;

    return (
        <div className="product-detail">
            <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} />
            <div className="details">
                <h2>{product.name}</h2>
                <p className="price">${product.price}</p>
                <p className="desc">{product.description}</p>
                <p>Category: {product.category}</p>
                <p>Stock: {product.stock}</p>
                <button onClick={() => addToCart(product)} className="add-btn">Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductDetail;
