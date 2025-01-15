const BASE_URL = "http://localhost:5001";

/**
 * Delete a user by ID.
 *
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<object>} - Result with success and data/error details.
 */
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/user_delete/${userId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const error = await response.json();
      return {
        success: false,
        error: error.error || "Unknown error occurred.",
      };
    }
  } catch (error) {
    console.error("Error connecting to the service:", error.message);
    return {
      success: false,
      error: "Failed to connect to the delete user service.",
    };
  }
};
