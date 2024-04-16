import React from 'react';

const PageNav = ({ pages, selectedPage, handlePageChange }) => {
    return (
        <div className="Page_Nav">
            {pages.map((page) => (
                <button
                    id={`${page}`}
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={page === selectedPage ? 'active' : ''}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

export default PageNav;