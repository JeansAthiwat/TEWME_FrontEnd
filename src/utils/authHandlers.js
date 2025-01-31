import { mockLoginAPI } from '../api/auth'; // Import the mock API

export const handleLogin = async (email, password, setAccountState) => {
  try {
    const response = await mockLoginAPI(email, password);
    if (response.success) {
      setAccountState(response.role); // Set 'user' or 'admin' based on API response
    } else {
      alert("Login failed! Check credentials.");
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
};
