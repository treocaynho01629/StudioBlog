const Reducer = (state, action) => {
    switch(action.type) {
        case "LOGIN_START":
            return {
                auth: null,
                isLoading: true,
                error: false
            }
            case "LOGIN_SUCCESS":
            return {
                auth: action.payload,
                isLoading: false,
                error: false
            }
            case "LOGIN_FAIL":
            return {
                auth: null,
                isLoading: false,
                error: true
            }
            case "LOGOUT":
            return {
                auth: null,
                isLoading: true,
                error: false
            }
            default:
            return state;
    }
}

export default Reducer;