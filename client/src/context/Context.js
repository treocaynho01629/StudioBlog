import { createContext, useReducer } from "react"
import Reducer from "./Reducer"
import { useEffect } from "react";

const INITIAL_STATE = {
    auth: JSON.parse(localStorage.getItem("auth")) || null,
    isLoading: false,
    error: false
}

export const Context = createContext(INITIAL_STATE);

export const ContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

    useEffect(() => {
        localStorage.setItem("auth", JSON.stringify(state.auth));
    }, [state.auth]);

    return (
        <Context.Provider value={{
            auth: state.auth,
            isLoading: state.isLoading,
            error: state.error,
            dispatch
        }}>
            {children}
        </Context.Provider>
    )
}