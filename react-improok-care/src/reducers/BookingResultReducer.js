// import cookie from "react-cookies"

const BookingResultReducer = (currentState, action) => {
    switch (action.type) {
        case "booking":
            return action.payload;
        default:
            return currentState;
    }
}

export default BookingResultReducer;