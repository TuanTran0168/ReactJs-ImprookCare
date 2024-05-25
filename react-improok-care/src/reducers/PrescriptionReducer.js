import cookie from "react-cookies"

const PrescriptionReducer = (currentState, action) => {
    switch (action.type) {
        case "booking":
            return action.payload;
        case "complete":
            cookie.remove("bookingInfo");
            return null;
        default:
            return currentState;
    }
}

export default PrescriptionReducer;