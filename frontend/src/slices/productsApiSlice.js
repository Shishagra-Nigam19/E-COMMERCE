import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ keyword = '', page = 1 }) => ({
                url: `/api/products`,
                params: { keyword, page },
            }),
            providesTags: ['Product'],
            keepUnusedDataFor: 5,
        }),
        getProductDetails: builder.query({
            query: (productId) => `/api/products/${productId}`,
            providesTags: (result, error, productId) => [{ type: 'Product', id: productId }],
        }),
        createProduct: builder.mutation({
            query: (product) => ({
                url: '/api/products',
                method: 'POST',
                body: product,
            }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation({
            query: ({ id, ...product }) => ({
                url: `/api/products/${id}`,
                method: 'PUT',
                body: product,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/api/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),
        createReview: builder.mutation({
            query: ({ productId, rating, comment }) => ({
                url: `/api/products/${productId}/reviews`,
                method: 'POST',
                body: { rating, comment },
            }),
            invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
        }),
        getTopProducts: builder.query({
            query: () => '/api/products/top',
            providesTags: ['Product'],
            keepUnusedDataFor: 5,
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useCreateReviewMutation,
    useGetTopProductsQuery,
} = productsApiSlice;
