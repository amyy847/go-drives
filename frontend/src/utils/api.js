import axios from 'axios';

const API_URL = "http://YOUR_SERVER_IP:5000/api";

export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    return res.data;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, credentials);
    return res.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};
