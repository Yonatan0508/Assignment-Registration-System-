import axios from "axios";

const BASE_URL = process.env.BASE_URL;

export async function registerUser(userData) {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userData, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.error(
      "Registration error:",
      error.response && error.response.data
        ? error.response.data
        : error.message
    );
    throw error;
  }
}
