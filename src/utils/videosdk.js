import axiosInstance from "../axios"

export const generateToken = async () => {
  try {
    const response = await axiosInstance.get('/auth/v2/generate-token'); // Call the backend route
    return response.data.token; // Extract token from response
  } catch (error) {
    console.error('Failed to generate token:', error);
    throw error;
  }
};
