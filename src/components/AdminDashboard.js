import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [show, setShows] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', category: '', artist: '', price: '',
         date: '', time: '', venue: '', posterUrl: '', trailerId: ''
    });

    const fetchShows = async () => {
        try {
            const res = await axios.get('https://housefullbackend.onrender.com/api/admin/get-shows');
            setShows(res.data);
        }catch (error) {
            console.error('Error fetching shows:', error);
        }
    };
 
    useEffect(() => {
        fetchShows();
    }, [])
    

     const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`https://housefullbackend.onrender.com/api/admin/update-show/${editingId}`, formData);
                alert('Show updated successfully!');
            }else {
                await axios.post('https://housefullbackend.onrender.com/api/admin/add-show', formData);
                alert('Show added successfully!');
            }
            setEditingId(null);
            setFormData({
                title: '', category: '', artist: '', price: '',
                date: '', time: '', venue: '', posterUrl: '', trailerId: '',
                videoUrl: ''
            });
            fetchShows();
        } catch (error) {
            console.error(error);
            alert('Error adding/updating show: ' + error.response.data.error);
        }
    }

    //delete 

   const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    const url = `https://housefullbackend.onrender.com/api/admin/delete-show/${id}`;
    console.log("Calling URL:", url); // He console madhe check kar 

    try {
        const response = await axios.delete(url);
        if (response.data.success) {
            alert('Deleted! ');
            fetchShows(); 
        }
    } catch (error) {
        console.error("Error status:", error.response?.status);
        alert("Error: " + (error.response?.data?.error || "Check Console"));
    }
};

 //edit
 const handleEdit = (show) => {
    setEditingId(show._id);
    setFormData(show);
    window.scrollTo(0, 0);
 };

return (
    <div className='admin-container'>
        <h2 className='admin-title'>Add New Live Shows</h2>

        <form onSubmit={handleSubmit} className='admin-form'>
            <input name="title" placeholder='Show Title' onChange={handleChange} value={formData.title} required />

            <select name="category" onChange={handleChange} value={formData.category} required>
                <option value="Comedy">Comedy</option>
                <option value="Singing">Singing</option>
                <option value="Motivation">Motivation</option>
                <option value="Shayri">Shayri</option>
                <option value="Sports">Sports</option>
            </select>

            <input name="artist" placeholder='Artist Name' onChange={handleChange} value={formData.artist} required />
            <input name="price" placeholder='Price' onChange={handleChange} value={formData.price} required />
            <input name="date" type="date" onChange={handleChange} value={formData.date} required />
            <input name="time" type="time" onChange={handleChange} value={formData.time} required />
            <input name="venue" placeholder='Venue' onChange={handleChange} value={formData.venue} required />
            <input name="posterUrl" placeholder='Poster URL' onChange={handleChange} value={formData.posterUrl} required />
            <input name="trailerId" placeholder='YouTube Trailer ID' onChange={handleChange} value={formData.trailerId} required /> 
            <input name="videoUrl" placeholder='YouTube Video URL' onChange={handleChange} value={formData.videoUrl} required />

            <button type='submit' className='publish-btn' style={{ backgroundColor: editingId ? '#f39c12' : '#e50914' }}>
                {editingId ? 'Update show' : 'Publish show'}
            </button>
            {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({});}} className="cancel-btn">Cancel</button>}
        </form>

        <hr style={{ margin: '40px 0' }} />

        
        <h3 style={{ color: 'black'}}> Manage Existing Shows</h3>
        <div style={{ overflowX: 'auto'}}>
        <table className='admin-table'>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {show.map(item => (
                    <tr key={item._id}>
                        <td>{item.title}</td>
                        <td>{item.artist}</td>
                        <td>{item.category}</td>
                        <td>
                            <button onClick={() => handleEdit(item)} className="edit-icon-btn">✏️</button>
                            <button onClick={() => handleDelete(item._id)} className="delete-icon-btn">🗑️</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    </div>
 );

};

export default AdminDashboard;

