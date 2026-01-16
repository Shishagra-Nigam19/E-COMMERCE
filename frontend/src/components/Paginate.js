import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Paginate.css';

const Paginate = ({ pages, page, keyword = '' }) => {
    const navigate = useNavigate();

    const handlePageClick = (x) => {
        if (keyword) {
            navigate(`/?keyword=${keyword}&page=${x}`);
        } else {
            navigate(`/?page=${x}`);
        }
    };

    return (
        pages > 1 && (
            <div className="pagination">
                {[...Array(pages).keys()].map((x) => (
                    <button
                        key={x + 1}
                        className={`page-btn ${page === x + 1 ? 'active' : ''}`}
                        onClick={() => handlePageClick(x + 1)}
                    >
                        {x + 1}
                    </button>
                ))}
            </div>
        )
    );
};

export default Paginate;
