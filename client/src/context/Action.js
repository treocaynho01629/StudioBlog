export const LoginStart = (userCredentials) => ({
    type: "LOGIN_START"
})

export const LoginSuccess = (auth) => ({
    type: "LOGIN_SUCCESS",
    payload: auth,
})

export const LoginFail = () => ({
    type: "LOGIN_FAIL"
})

export const Logout = () => ({
    type: "LOGOUT"
})