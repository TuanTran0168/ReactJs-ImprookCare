import React from 'react';
import "../styles/PageNavigation.css"

class PageNavigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPage: null
        };
    }
    handlePageChange = (pageNumber) => {
        // TODO: Xử lý sự kiện khi người dùng chuyển trang
        this.setState({ selectedPage: pageNumber });
        console.log(`Chuyển đến trang ${pageNumber}`);
    };

    render() {
        const { totalPages } = this.props;
        const { selectedPage } = this.state;
        const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

        return (
            <div className="Page_Nav">
                {pages.map((page) => (
                    <button id={`${page}`} key={page} onClick={() => this.handlePageChange(page)}
                        className={page === selectedPage ? 'active' : ''}>
                        {page}
                    </button>
                ))}
            </div>
        );
    }
}

export default PageNavigation;