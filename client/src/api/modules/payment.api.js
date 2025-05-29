import axiosClient from '../axios/axios.client';

const paymentApi = {
    createPaymentIntent: async (data) => {
        const response = await axiosClient.post('/payments/create-intent', data);
        return response;
    },

    confirmPayment: async (data) => {
        const response = await axiosClient.post('/payments/confirm', data);
        return response;
    }
};

export default paymentApi; 