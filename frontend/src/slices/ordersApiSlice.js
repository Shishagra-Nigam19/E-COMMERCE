import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: '/api/orders',
                method: 'POST',
                body: order,
            }),
            invalidatesTags: ['Order'],
        }),
        getMyOrders: builder.query({
            query: () => '/api/orders/myorders',
            providesTags: ['Order'],
        }),
        getOrderDetails: builder.query({
            query: (id) => `/api/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Order', id }],
        }),
        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `/api/orders/${orderId}/pay`,
                method: 'PUT',
                body: details,
            }),
            invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }],
        }),
        getAllOrders: builder.query({
            query: () => '/api/orders',
            providesTags: ['Order'],
        }),
        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `/api/orders/${orderId}/deliver`,
                method: 'PUT',
            }),
            invalidatesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetAllOrdersQuery,
    useDeliverOrderMutation,
} = ordersApiSlice;
