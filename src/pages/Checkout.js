import React from 'react';
import axios from 'axios';
import { useNavigate, useLocation, } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Destructure data from location state
    const { movieTitle, showTime, seats, totalAmount, selectedSnacks } = location.state || {};

    // Check if data exists, otherwise show error
    if (!seats) {
        return <div className='error-msg'>No booking data found! Go back to Home.</div>;
    }
    

    const handlePayment = async () => {
        try {
            // LocalStorage madhun user check kara
            const userString = localStorage.getItem("loggedInUser");
            const token = localStorage.getItem("token");

            if (!userString || !token) {
                alert("Please login to proceed with payment!");
                navigate('/login');
                return;
            }

            const loggedInUser = JSON.parse(userString);
            const userEmail = loggedInUser.email;
            const userName = loggedInUser.name;

            if (!userEmail) {
                alert("Email missing! Please login again.");
                return;
            }

            console.log("Processing payment for:", userEmail);

   

            // 2. Create Order on Backend
            const response = await axios.post('https://housefullbackend.onrender.com/api/payment/order', {
                amount: totalAmount 
            });

            const order = response.data.order;

            if (!order || !order.id) {
                alert("Backend kadhun Order ID milali nahi!");
                return;
            }

            // 3. Razorpay Options Configuration
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID, 
                amount: order.amount,
                currency: "INR",
                name: "HouseFull",
                description: `Payment for ${movieTitle}`,
                order_id: order.id,
                handler: async (paymentResponse) => {
                    try {
                        console.log("Verifying Payment & Sending Email to:", userEmail);
                        
                        // 4. Send data to Backend for Verification and Email Triggering
                        const verifyRes = await axios.post('https://housefullbackend.onrender.com/api/payment/verify', {
                            razorpay_order_id: paymentResponse.razorpay_order_id,
                            razorpay_payment_id: paymentResponse.razorpay_payment_id,
                            razorpay_signature: paymentResponse.razorpay_signature,
                            email: userEmail, 
                            movieName: movieTitle,
                            showTime: showTime,
                            seats: seats,
                            totalAmount: totalAmount,
                            snacks: selectedSnacks || []
                        });

                        if (verifyRes.data.success) {
                            alert(`Booking Successful! Email sent to ${userEmail}`);
                            navigate('/success', { 
                                state: { movieTitle, showTime, seats, totalAmount, selectedSnacks } 
                            });
                        }
                    } catch (err) {
                        console.error("Verification Error:", err.response?.data || err.message);
                        alert("Payment successful, but verification failed on server.");
                    }
                },
                prefill: {
                    name: userName,
                    email: userEmail, 
                    contact: "8080567888"
                },
                theme: { color: "#e62e2e" },
                modal: {
                    ondismiss: function() {
                        console.log("Payment window closed by user");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Gateway Error:", error.response?.data || error.message);
            alert("Gateway open jhale nahi. Check backend console.");
        }
    };

    return (
        <div className='checkout-container'>
            <div className='ticket-card'>
                <h1 className='checkout-title'>Booking Summary</h1>
                <div className='summary-details'>
                    <div className="detail-item"><span>Movie:</span> <strong>{movieTitle}</strong></div>
                    <div className="detail-item"><span>Show Time:</span> <strong>{showTime}</strong></div>
                    <div className="detail-item"><span>Seats:</span> <strong>{seats.join(', ')}</strong></div>
                    <hr />
                    <div className="bill-summary">
                        <h3>Order Details</h3>
                        <div className="bill-item">
                            <span>{seats.length} x Tickets</span>
                            <span>₹{seats.length * 250}</span>
                        </div>
                        {selectedSnacks?.map((item, index) => (
                            <div key={index} className="bill-item">
                                <span>{item.name} ({item.size})</span>
                                <span>₹{item.price}</span>
                            </div>
                        ))}
                    </div>
                    <hr />
                    <div className='total-item'>
                        <span>Total Payable:</span>
                        <span className='amount'>₹{totalAmount}</span>
                    </div>
                </div>
                <button className="pay-btn" onClick={handlePayment}>Proceed to Pay ₹{totalAmount}</button>
                <button className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
            </div>
        </div>
    );
};

export default Checkout;

