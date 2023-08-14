import { apiSlice } from "../../app/api/apiSlice";

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
            providesTags: ["Image"]
        }),
        uploadImage: builder.mutation({
            query: (image) => ({
                url: '/images/upload',
                method: 'POST',
                credentials: 'include',
                body: image,
                formData: true
            }),
            invalidatesTags: ["Image"]
        }),
        uploadImages: builder.mutation({
            query: (images) => ({
                url: '/images/upload-multiple',
                method: 'POST',
                credentials: 'include',
                body: images,
                formData: true
            }),
            invalidatesTags: ["Image"]
        }),
        deleteImage: builder.mutation({
            query: (name) => ({
                url: `/images/${name}`,
                method: 'DELETE'
            }),
            invalidatesTags: ["Image"]
        }),
    }),
})

export const {
   useGetImagesQuery,
   useUploadImageMutation,
   useUploadImagesMutation,
   useDeleteImageMutation
} = imagesApiSlice