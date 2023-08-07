import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const commentsAdapater = createEntityAdapter({});

const initialState = commentsAdapater.getInitialState({
    info: {
      currPage: 0,
      pageSize: 0,
      totalElements: 0,
      numbersOfPages: 0,
    },
});

export const commentsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getComment: builder.query({
            query: ({ id }) => ({
                url: `/comments/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const comment = { ...responseData, id: responseData._id};
                return comment;
            },
            providesTags: ['Comment']
        }),
        getComments: builder.query({
            query: (args) => {
                const { post, page, size } = args;
                return {
                    url: `/comments`,
                    params: { post, page, size },
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { info, data } = responseData;
                const loadedComments = data.map(comment => {
                    comment.id = comment._id
                    return comment
                });
                return commentsAdapater.setAll({ ...initialState, info }, loadedComments)
            },
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            merge: (currentCache, newItems, { arg }) => {
                if (arg.page > 1) { //Only merge on load more
                    currentCache.ids.filter(e => !newItems.ids.includes(e));
                    currentCache.ids.push(...newItems.ids);
                    currentCache.entities = {...currentCache.entities, ...newItems.entities};
                    currentCache.info = newItems.info;
                    return currentCache;
                }
                return newItems;
            },
            forceRefetch({ currentArg, previousArg }) {
                return ((currentArg !== previousArg))
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Comment', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Comment', id }))
                    ]
                } else return [{ type: 'Comment', id: 'LIST' }]
            }
        }),
        createComment: builder.mutation({
            query: ({ postId, newComment }) => ({
                url: `/comments/${postId}`,
                method: 'POST',
                credentials: 'include',
                body:  {
                    ...newComment,
                }
            }),
            invalidatesTags: [
                { type: 'Comment', id: "LIST" }
            ]
        }),
        deleteComment: builder.mutation({
            query: ({ id }) => ({
                url: `/comments/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Comment', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetCommentQuery,
    useGetCommentsQuery,
    useCreateCommentMutation,
    useDeleteCommentMutation
} = commentsApiSlice

export const selectCommentsResult = commentsApiSlice.endpoints.getComments.select()

const selectCommentsData = createSelector(
    selectCommentsResult,
    commentsResult => commentsResult.data // normalized state object with ids & entities
)

export const {
    selectAll: selectAllComments,
    selectById: selectCommentById,
    selectIds: selectCommentIds,
    selectEntities: selectCommentEntities
} = commentsAdapater.getSelectors(state => selectCommentsData(state) ?? initialState)