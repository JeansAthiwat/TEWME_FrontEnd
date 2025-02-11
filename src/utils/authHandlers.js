export const handleLogin = async (email, password, setAccountState) => {
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
    localStorage.setItem('token', data.token);

    // ✅ Set account state based on user role
    setAccountState(data.user.role); // Role should be 'user' or 'admin'
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
