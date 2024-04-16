const PrescriptionReducer = (currentState, action) => {
    switch (action.type) {
        case "booking":
            return action.payload;
        default:
            return currentState;
    }
}

export default PrescriptionReducer;