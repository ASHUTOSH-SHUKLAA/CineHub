const openRazorpayCheckout = (order) => {
  const options = {
    key: import.meta.env.rzp_test_YXr04tDAMTsnbu, //  use it here
    amount: order.amount,
    currency: "INR",
    name: "CineHub",
    description: "Movie Ticket Booking",
    order_id: order.id,
    handler: function (response) {
      alert("Payment successful!");
      // Send response.razorpay_payment_id to backend for verification
    },
    prefill: {
      name: "User Name",
      email: "user@example.com",
      contact: "9999999999",
    },
    theme: {
      color: "#F37254",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
