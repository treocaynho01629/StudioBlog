import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const commentsAdapter = createEntityAdapter({});
const commentsSelector = commentsAdapter.getSelectors();
const commentsInitialState = commentsAdapter.getInitialState({
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
            providesTags: (result, error, id) => [{ type: 'Comment', id }]
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
                return commentsAdapter.setAll({ ...commentsInitialState, info }, loadedComments)
            },
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return `${endpointName}-${queryArgs?.post}`
            },
            merge: (currentCache, newItems) => {
                currentCache.info = newItems.info;
                commentsAdapter.addMany(
                    currentCache, commentsSelector.selectAll(newItems)
                )
            },
            forceRefetch({ currentArg, previousArg }) {
                return (currentArg?.page !== previousArg?.page)
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
            async onQueryStarted({ id, ...searchParams }, { dispatch, queryFulfilled  }) {
                try {
                    const { data: deleted } = await queryFulfilled
                    const patchResult = dispatch(commentsApiSlice.util.updateQueryData("getComments", searchParams, (draft) => {
                        commentsAdapter.removeOne(draft, id)
                    }))
                } catch {
                }
            }
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
} = commentsAdapter.getSelectors(state => selectCommentsData(state) ?? commentsInitialState)

export {
    commentsSelector,
    commentsAdapter,
    commentsInitialState
}