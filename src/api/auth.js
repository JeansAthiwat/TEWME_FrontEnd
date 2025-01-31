export const mockLoginAPI = async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === "user@email.com" && password === "user") {
          resolve({ success: true, role: "user" }); // User role
        } else if (email === "admin@email.com" && password === "admin") {
          resolve({ success: true, role: "admin" }); // Admin role
        } else {
          resolve({ success: false }); // Failed login
        }
      }, 1000);
    });
  };
  