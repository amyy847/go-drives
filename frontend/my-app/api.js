import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://192.168.100.88:5000/api",
  timeout: 30000, // 30 seconds timeout
});

const API_URL = "http://192.168.100.88:5000/api"; 

export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    return res.data;
  } catch (error) {
    console.error("Register User Error:", error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, credentials);
    return res.data;
  } catch (error) {
    console.error("Login User Error:", error.response?.data || error.message);
    throw error;
  }
};

export const uploadImage = async (imageUri) => {
  try {
    const formData = new FormData();
    formData.append('idPictures', {
      uri: imageUri,
      type: 'image/jpeg', // Change type if necessary (e.g., 'image/png')
      name: 'idPicture.jpg'
    });

    const res = await axios.post(`${API_URL}/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return res.data;
  } catch (error) {
    console.error("Upload Image Error:", error.response?.data || error.message);
    throw error;
  }
};
