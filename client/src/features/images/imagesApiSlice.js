import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const imagesAdapter = createEntityAdapter({});
const imagesSelector = imagesAdapter.getSelectors();
const imagesInitialState = imagesAdapter.getInitialState({
    info: {
      currPage: 0,
      pageSize: 0,
      totalElements: 0,
      numbersOfPages: 0,
    },
});

export const imagesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getImages: builder.query({
            query: (args) => {
                const { page, size } = args;
                return {
                    url: '/images',
                    params: { page, size },
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: (responseData) => {
                const { info, data } = responseData;
                return imagesAdapter.setAll({ ...imagesInitialState, info }, data);
            },
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            merge: (currentCache, newItems) => {
                currentCache.info = newItems.info;
                imagesAdapter.addMany(
                    currentCache, imagesSelector.selectAll(newItems)
                )
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return (currentArg?.page !== previousArg?.page)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Image', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Image', id }))
                    ]
                } else return [{ type: 'Image', id: 'LIST' }]
            }
        }),
        uploadImage: builder.mutation({
            query: (image) => ({
                url: '/images/upload',
                method: 'POST',
                credentials: 'include',
                body: image,
                formData: true
            }),
            invalidatesTags: [
                { type: 'Image', id: "LIST" }
            ]
        }),
        uploadImages: builder.mutation({
            query: (images) => ({
                url: '/images/upload-multiple',
                method: 'POST',
                credentials: 'include',
                body: images,
                formData: true
            }),
            invalidatesTags: [
                { type: 'Image', id: "LIST" }
            ]
        }),
        deleteImage: builder.mutation({
            query: ({ name }) => ({
                url: `/images/${name}`,
                method: 'DELETE'
            }),
            async onQueryStarted({ id, ...searchParams }, { dispatch, queryFulfilled  }) {
                try {
                    await queryFulfilled
                    dispatch(imagesApiSlice.util.updateQueryData("getImages", searchParams, (draft) => {
                        imagesAdapter.removeOne(draft, id)
                    }))
                } catch {
                }
            }
        }),
    }),
})

export const {
   useGetImagesQuery,
   useUploadImageMutation,
   useUploadImagesMutation,
   useDeleteImageMutation
} = imagesApiSlice

export const selectImagesResult = imagesApiSlice.endpoints.getImages.select()

const selectImagesData = createSelector(
    selectImagesResult,
    imagesResult => imagesResult.data
)

export const {
    selectAll: selectAllImages,
    selectById: selectImageById,
    selectIds: selectImageIds,
    selectEntities: selectImageEntities
} = imagesAdapter.getSelectors(state => selectImagesData(state) ?? imagesInitialState)

export {
    imagesSelector,
    imagesAdapter,
    imagesInitialState
}