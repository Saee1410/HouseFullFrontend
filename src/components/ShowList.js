import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ShowList.css';


const ShowList = ({searchQuery }) => {

    const [allShows, setAllShows] = useState([]);
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchShows = async () => {
            try {
                const res = await axios.get('https://housefullbackend.onrender.com/api/admin/get-shows');
                setAllShows(res.data);
            } catch (error) {
                console.error("Data fetching error:", error);
            }
        }
        fetchShows();
    }, []);

    const handlePayment = async (show) => {
        try {
            const { data  } = await axios.post('https://housefullbackend.onrender.com/api/payment/order', {
                amount: show.price,
                showId: show._id
        });
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: 'INR',
            name: show.title,
            description: `Booking for ${show.title}`,
            order_id: data.id,
            handler: async function (response) {
                alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
            },
            prefill: {
                name: "User Name",
                email: "user@example.com",
                contact: "8080296179"
            },
            theme: { color: "#e50914" }
        };
         
        const rzp = new window.Razorpay(options);
        rzp.open();
        } catch (err){
            console.error("Payment error:", err);
            alert('Payment failed. Please try again.');
        }
    };

    const displayedShows = allShows.filter(show => {
        const query = searchQuery?.toLowerCase() || "";
       
        if(!query) {
            return ["Comedy", "Singing", "Motivation", "Shayri", "Sports"].includes(show.category);

        }

        return (
            show.title.toLowerCase().includes(query)||
            show.artist.toLowerCase().includes(query)||
            show.category.toLowerCase().includes(query)
            
        );
    });





return (
    <div className="shows-container">
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}> Your Favourites</h1>

        <div className='shows-grid'>
            {displayedShows.length > 0 ? (
            displayedShows.map((item) =>  (
                <div key={item._id} className='show-card'>
                    <img src={item.posterUrl} alt={item.title} className="poster-img" />
                    <div className='show-details'>
                        <span className='show-category'>{item.category}</span>
                        <h3 className='show-title'>{item.title}</h3>
                        <p className='show-info'>{item.artist}</p>
                        <p className='show-info'>📅 {item.venue} </p>
                        <p className='show-info'>🕒 {item.date} at {item.time}</p>
                        <h4 style={{ color: '#333' }}>₹{item.price} onwards</h4>
                    </div>

                    <div className='btn-group'>
                    <button className='book-btn' onClick={() => handlePayment(item)}>Book Now</button>
                    <button className='watch-btn' 
                    onClick={() => {
                        if(item.videoUrl){
                            let videoId = "";

                            if(item.videoUrl.includes('v=')){
                                videoId = item.videoUrl.split('v=')[1].split('&')[0];
                        }else if(item.videoUrl.includes('youtu.be/')){
                                videoId = item.videoUrl.split('youtu.be/')[1];
                        }
                        if(videoId){
                            navigate(`/watch/${videoId}`);
                        }else{
                            alert('Invalid video URL');
                        }
                    }else{
                        alert('Video URL not available for this show');
                    }
                }}
                >
                     Watch Show
                </button>
                    </div>
                </div>
            ))
        ) : (
            <h2 style={{ color: 'white', gridColumn: '1/-1', textAlign: 'center' }}>No shows found for "{searchQuery}"</h2>
        )}
        </div>
    </div>
);

};

export default ShowList;