import { SquareTerminalIcon } from "lucide-react";

export const handleLogin = async (email, password, setAccountState, setProfilePicture, setEmail) => {
  try {
    const response = await fetch(`http://localhost:39189/auth/login`, { // ✅ Calls backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Store JWT token in local storage
    // ✅ Clear old user data
    localStorage.clear();

    // ✅ Store new user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('email', data.user.email);
    localStorage.setItem('profilePicture', data.user.profilePicture);
    localStorage.setItem('accountState', data.user.role);
    
    // ✅ Set account state based on user role
    // console.dir(data)
    setEmail(data.user.email)
    setProfilePicture(data.user.profilePicture)
    setAccountState(data.user.role); // Role should be 'user' or 'admin'
    console.log(data.user.role)
    // localStorage.setItem("profilePicture", data.user.profilePicture);
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
