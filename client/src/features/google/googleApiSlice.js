import { apiSlice } from "../../app/api/apiSlice";

export const googleApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getVideos: builder.query({
            query: ({ amount }) => ({
                url: '/google/videos',
                params: { amount },
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            providesTags: ["Video"]
        }),
        getReviews: builder.query({
            query: () => ({
                url: '/google/reviews',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            providesTags: ["Review"]
        }),
    }),
})

export const {
    useGetVideosQuery,
    useGetReviewsQuery
} = googleApiSlice