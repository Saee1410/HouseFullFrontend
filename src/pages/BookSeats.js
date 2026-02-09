import React, { useState, useEffect } from 'react';
import {  useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookSeat.css';

const BookSeats = () => {
  const { id, time } = useParams();
  const navigate = useNavigate();
  

  const [dbShow, setDbShow] = useState(null);
  const [movieTitle, setMovieTitle] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showSnacksModal, setShowSnacksModal] = useState(false);
  const [selectedSnacks, setSelectedSnacks] = useState([]);
 const [selectedSizes, setSelectedSizes] = useState({}); 

 // 1. Toggle Snack Function (He missing hote)
  const toggleSnack = (snack) => {
    const isAlreadyAdded = selectedSnacks.find(s => s.id === snack.id);
    if (isAlreadyAdded) {
      setSelectedSnacks(selectedSnacks.filter(s => s.id !== snack.id));
      // Size reset kara jar snack kadhla tar
      const newSizes = { ...selectedSizes };
      delete newSizes[snack.id];
      setSelectedSizes(newSizes);
    } else {
      setSelectedSnacks([...selectedSnacks, snack]);
      // Default size 'X' set kara
      if (snack.sizes) {
        setSelectedSizes(prev => ({ ...prev, [snack.id]: "X" }));
      }
    }
  };

  // 2. Corrected handleSizeChange
  const handleSizeChange = (e, snackId, sizeLabel) => {
    e.stopPropagation(); // Card cha click thambva
    setSelectedSizes(prev => ({ ...prev, [snackId]: sizeLabel }));
  };

  // 3. Helper Function to get Final Price (Checkout sathi sudha upyogi)
  const getSnackPrice = (snack) => {
    if (snack.sizes) {
      const selectedSizeLabel = selectedSizes[snack.id] || "X";
      const sizeObj = snack.sizes.find(s => s.label === selectedSizeLabel);
      return snack.basePrice + (sizeObj ? sizeObj.extra : 0);
    }
    return snack.price;
  };



  const snacksMenu = [
    {
       id: 1,
    name: "Popcorn",
    basePrice: 150,
    sizes: [
      { label: "X", extra: 0 },
      { label: "XL", extra: 50 },
      { label: "XXL", extra: 100 }
    ],
    icon: "🍿"
  },
    { id: 2, name: "Cold Coffee", price: 120, icon: "🧋" },
    { id: 3, name: "Coke & Nachos Combo", price: 250, icon: "🍱" }
  ];


  
  useEffect(() => {
    const fetchShow = async () => {
      if (!id || id === 'undefined') return;
      try {
        const url = `http://housefullbackend.onrender.com/api/movies/get-show/${id}/${encodeURIComponent(time)}`;
        const res = await axios.get(url);
        setDbShow(res.data);
      } catch (err) {
        console.error(" Fetch error:", err.message);
        alert("Failed to load seats.");
      } finally {
        setLoading(false);
      }
    };
    fetchShow();
  }, [id, time]);

  useEffect(() => {
    const fetchMovieTitle = async () => {
      if (!id || id === 'undefined') return;
      try {
        const movieRes = await axios.get(`http://housefullbackend.onrender.com/api/movies/details/${id}`);
        setMovieTitle(movieRes.data?.title || '');
      } catch (err) {
        console.warn("Movie title fetch failed.");
      }
    };
    fetchMovieTitle();
  }, [id]);

  const handleSeatClick = (seatNumber, isBooked) => {
    if (isBooked) return;
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleOpenSnacks = () => {
    if (selectedSeats.length === 0) return alert("Please select at least one seat!");
    setShowSnacksModal(true);
  };

  const handleConfirmBooking = async () => {
  try {
    if (!dbShow?._id) return alert("Show info missing!");
    setBookingLoading(true);

    const response = await axios.post('http://housefullbackend.onrender.com/api/movies/confirm-booking', {
      showId: dbShow._id,
      selectedSeats: selectedSeats,
    });

    if (response.data.success) {
      const ticketTotal = selectedSeats.length * (dbShow?.ticketPrice || 250);

      // --- NAVIN LOGIC: Items details sobat pathva ---
      const snacksWithDetails = selectedSnacks.map(snack => ({
        name: snack.name,
        size: selectedSizes[snack.id] || (snack.sizes ? "X" : "Standard"),
        price: getSnackPrice(snack) // He function aapan pahile banavle hote
      }));

      const snacksTotal = snacksWithDetails.reduce((acc, s) => acc + s.price, 0);

      navigate('/checkout', {
        state: {
          seats: selectedSeats,
          totalAmount: ticketTotal + snacksTotal,
          selectedSnacks: selectedSnacks.map(snack => ({
            name: snack.name,
            size: selectedSizes[snack.id] || "Standard",
            price: snack.price + (selectedSizes[snack.id] === "XXL" ? 100: 0)
          })),
        
          showId: dbShow._id,
          movieTitle: movieTitle || "Movie",
          showTime: time,
          
        }
      });
    }
  } catch (err) {
    alert(" Booking failed.");
  } finally {
    setBookingLoading(false);
  }
};


  if (loading) return <h1 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading Seats...</h1>;

  return (
    <div className='booking-container'>
      <div className='screen-info'>
        <h2>Select Your Seats</h2>
        <p>{movieTitle} | {time}</p>
      </div>

      <div className="cinema-screen">
        <div className="screen-curve"></div>
        <span>SCREEN THIS WAY</span>
      </div>

      <div className="seats-grid">
        {dbShow?.seats ? (
          <div className="grid-layout">
            {dbShow.seats.map((seat) => (
              <div
                key={seat.seatNumber}
                className={`seat ${seat.isBooked ? 'occupied' : ''} ${selectedSeats.includes(seat.seatNumber) ? 'selected' : ''}`}
                onClick={() => handleSeatClick(seat.seatNumber, seat.isBooked)}
              >
                <small>{seat.seatNumber}</small>
              </div>
            ))}
          </div>
        ) : <p>No seats available</p>}
      </div>

      <div className='legend'>
        <div className="item"><div className="seat"></div> Available</div>
        <div className="item"><div className="seat selected"></div> Selected</div>
        <div className="item"><div className="seat occupied"></div> Occupied</div>
      </div>

      <div className='booking-summary-card'>
        <div className='price-details'>
          <p className="summary-text">Seats: <span>{selectedSeats.join(', ') || 'None'}</span></p>
          <h3 className="total-amount">Ticket: ₹{selectedSeats.length * (dbShow?.ticketPrice || 250)}</h3>
        </div>

        <button
          className="confirm-btn-large"
          disabled={selectedSeats.length === 0 || bookingLoading}
          onClick={handleOpenSnacks}
        >
          {bookingLoading ? "Processing..." : `Book ${selectedSeats.length} Tickets`}
        </button>
      </div>

      {/* --- SNACKS MODAL --- */}
      {showSnacksModal && (
        <div className="modal-overlay">
          <div className="snacks-modal">
            <div className="modal-header">
              <h2>🍕 Add Snacks?</h2>
              <button className="close-x" onClick={() => setShowSnacksModal(false)}>&times;</button>
            </div>

            <div className="snacks-list">
  {snacksMenu.map(snack => {
    const isAdded = selectedSnacks.find(s => s.id === snack.id);
    return (
      <div 
        key={snack.id} 
        className={`snack-card ${isAdded ? 'active' : ''}`} 
        onClick={() => toggleSnack(snack)} // Card click event
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <span className="snack-icon">{snack.icon}</span>
        <div className="snack-info">
          <h4>{snack.name}</h4>
          <p>₹{getSnackPrice(snack)}</p>
          
          {/* Size buttons fakt select kelya-var dakhva */}
          {snack.sizes && isAdded && (
            <div className="size-selector" style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
              {snack.sizes.map(sz => (
                <button 
                  key={sz.label}
                  className={`size-btn ${selectedSizes[snack.id] === sz.label ? 'active' : ''}`}
                  onClick={(e) => handleSizeChange(e, snack.id, sz.label)} // Size click
                  style={{ 
                    zIndex: 10, // Button la var aananyasathi
                    padding: '5px 10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc'
                  }}
                >
                  {sz.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="snack-add-btn">{isAdded ? '✓' : '+'}</button>
      </div>
    );
  })}
</div>

            <div className="modal-footer">
              <div className="modal-total">
                <p>Total: ₹{(selectedSeats.length * (dbShow?.ticketPrice || 250)) + selectedSnacks.reduce((acc, s) => acc + s.price, 0)}</p>
              </div>
              <button className="final-pay-btn" onClick={handleConfirmBooking}>
                {bookingLoading ? "Confirming..." : "Confirm & Pay"}
              </button>

              <button className='skip-btn' onClick={handleConfirmBooking} >
                No Thanks, Proceed to Pay
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSeats;



