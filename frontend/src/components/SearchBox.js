import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBox.css';

const SearchBox = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/?keyword=${keyword}`);
        } else {
            navigate('/');
        }
    };

    return (
        <form onSubmit={submitHandler} className="search-box">
            <input
                type="text"
                name="keyword"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search products..."
                className="search-input"
                value={keyword}
            />
            <button type="submit" className="search-btn">
                <i className="fas fa-search"></i>
            </button>
        </form>
    );
};

export default SearchBox;
