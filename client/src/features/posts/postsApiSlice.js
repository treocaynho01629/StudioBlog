import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const postsAdapter = createEntityAdapter({});

const initialState = postsAdapter.getInitialState({
    info: {
      currPage: 0,
      pageSize: 0,
      totalElements: 0,
      numbersOfPages: 0,
    },
});

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPost: builder.query({
            query: ({ slug }) => ({
                url: `/posts/${slug}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const post = { ...responseData, id: responseData._id};
                return post;
            },
            providesTags: ['Post']
        }),
        getPosts: builder.query({
            query: (args) => {
                const { cate, user, tags, page, size } = args;
                return {
                    url: `/posts`,
                    params: { cate, user, tags, page, size },
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { info, data } = responseData;
                const loadedPosts = data.map(post => {
                    post.id = post._id
                    return post
                });
                return postsAdapter.setAll({ ...initialState, info }, loadedPosts)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Post', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Post', id }))
                    ]
                } else return [{ type: 'Post', id: 'LIST' }]
            }
        }),
        validatePost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'PATCH',
                body: { ...initialPost }
            })
        }),
        createPost: builder.mutation({
            query: (newPost) => ({
                url: '/posts',
                method: 'POST',
                credentials: 'include',
                body: newPost,
                formData: true
            }),
            invalidatesTags: [
                { type: 'Post', id: "LIST" }
            ]
        }),
        updatePost: builder.mutation({
            query: ({ id, updatedPost }) => ({
                url: `/posts/${id}`,
                method: 'PUT',
                credentials: 'include',
                body: updatedPost,
                formData: true
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        deletePost: builder.mutation({
            query: ({ id }) => ({
                url: `/posts/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetPostQuery,
    useGetPostsQuery,
    useValidatePostMutation,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation
} = postsApiSlice

export const selectPostsResult = postsApiSlice.endpoints.getPosts.select()

const selectPostsData = createSelector(
    selectPostsResult,
    postsResult => postsResult.data // normalized state object with ids & entities
)

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
    selectEntities: selectPostEntities
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState)