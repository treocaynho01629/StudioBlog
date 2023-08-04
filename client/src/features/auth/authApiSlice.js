import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setAuth } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    const { accessToken } = data
                    dispatch(setAuth({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        signout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'DELETE',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)
                    dispatch(logOut())
                    localStorage.setItem("persist", JSON.stringify(false));
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState()) //Unmount api state
                    }, 1000)
                } catch (err) {
                    console.log(err)
                }
            }
        }),
    })
})

export const {
    useLoginMutation,
    useSignoutMutation,
    useRefreshMutation,
} = authApiSlice 