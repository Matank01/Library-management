const BASE_URL = "http://localhost:5005";

/**
 * Return a borrowed book.
 *
 * @param {string} userId - The ID of the user returning the book.
 * @param {string} bookId - The ID of the book to return.
 * @returns {Promise<object>} - Result with success and data/error details.
 */
export const returnBook = async (userId, bookId) => {
  try {
    const response = await fetch(`${BASE_URL}/return-book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, book_id: bookId }),
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
      error: "Failed to connect to the return book service.",
    };
  }
};
