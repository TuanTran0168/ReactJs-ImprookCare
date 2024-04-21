const WebSocketReducer = (currentState, action) => {
    switch (action.type) {
        case "login":
            return action.payload;
        default:
            return currentState;
    }
}

export default WebSocketReducer;