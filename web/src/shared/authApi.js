import axios from "axios";

const BASE_URL =
  "https://registration-server-h4gmcwekhfctaraz.westeurope-01.azurewebsites.net";

export async function registerUser(userData) {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userData, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.error(
      "Registratio23n error:",
      error.response && error.response.data
        ? error.response.data
        : error.message
    );
    throw error;
  }
}
