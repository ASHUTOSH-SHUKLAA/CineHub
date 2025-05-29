import axiosClient from "../axios/axios.client";

const ticketApi = {
    createBooking: async (data) => {
        const response = await axiosClient.post("/tickets", data);
        return response;
    },

    getUserBookings: async () => {
        const response = await axiosClient.get("/tickets/my-bookings");
        return response;
    },

    getBookingDetails: async (bookingId) => {
        const response = await axiosClient.get(`/tickets/${bookingId}`);
        return response;
    },

    cancelBooking: async (bookingId) => {
        const response = await axiosClient.patch(`/tickets/${bookingId}/cancel`);
        return response;
    },

    getAvailableSeats: async (movieId, showtime) => {
        const response = await axiosClient.get(`/tickets/available-seats`, {
            params: { movieId, showtime }
        });
        return response;
    }
};

export default ticketApi; 