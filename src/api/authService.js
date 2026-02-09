import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {email, password});
        if(response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    }catch (error) {
        throw error.response.data;
    }
}

