import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setAuth } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token)  headers.set("Authorization", `Bearer ${token}`);
        return headers
    }
})
 
const baseQueryWithRefresh= async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 403) {
        console.log("Refreshing token");
        const refreshData = await baseQuery("/auth/refresh", api, extraOptions)

        if (refreshData?.data) {
            api.dispatch(setAuth({ ...refreshData.data })) //Reauth
            result = await baseQuery(args, api, extraOptions) //Refetch
        } else {
            if (refreshData?.error?.status === 403) {
                refreshData.error.data.message = "Your login has expired."
            }
            return refreshData
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithRefresh,
    tagTypes: ['Post', 'User', 'Category', 'Comment', 'Video', 'Review', 'Image'],
    endpoints: builder => ({})
})