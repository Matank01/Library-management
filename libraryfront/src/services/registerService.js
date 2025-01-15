export const registerUser = async (username) => {
  try {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || "Registration failed.",
      };
    }
  } catch (err) {
    console.error("Error:", err);
    return { success: false, error: "An error occurred. Please try again." };
  }
};
