// import { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const ScrollToTop = () => {
//     const location = useLocation();
//     const navigate = useNavigate();

//     useEffect(() => {
//         const scrollToTop = () => {
//             window.scrollTo(0, 0);
//         };

//         navigate(location.pathname);
//         scrollToTop();

//         return () => {
//             scrollToTop();
//         };
//     }, [location, navigate]);

//     return null;
// };

// export default ScrollToTop;

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const location = useLocation();

    useEffect(() => {
        const scrollToTop = () => {
            window.scrollTo(0, 0);
        };

        scrollToTop();
    }, [location]);

    return null;
};

export default ScrollToTop;