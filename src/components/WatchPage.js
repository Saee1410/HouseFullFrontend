import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const WatchPage = () => {
    const { videoId } = useParams();
    const navigate = useNavigate();

  return (
    <div style={{backgroundColor: '#111', height: '100vh', padding: '20px', color: 'white', textAlign: 'center'}}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer' }}>
                Go Back
            </button>

            <h1>Enjoy the Time.</h1>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px'}}>
                <iframe
                    width="80%"
                    heigth="600px"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>

                    </iframe>
           
            </div>
          
              
    </div>
  )
}

export default WatchPage