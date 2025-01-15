const BASE_URL_PYTHON = "http://localhost:5006";
const BASE_URL_NODE = "http://localhost:5009";

/**
 * Adds a rating to a book using a primary Python-based service
 * with a fallback to a Node.js-based service.
 *
 * @param {string} bookId - The ID of the book to rate.
 * @param {number} rating - The rating to assign (1-5).
 * @returns {Promise<object>} - Result with success and data/error details.
 */
export const rateBook = async (bookId, rating) => {
  try {
    // Attempt primary Python-based rating service
    const response = await fetch(`${BASE_URL_PYTHON}/add-rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ book_id: bookId, rating }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const error = await response.json();
      if (response.status === 404) {
        return {
          success: false,
          error: "Book not found in the primary service.",
        };
      } else {
        console.error("Primary service error:", error.error);
        throw new Error("Primary service failed.");
      }
    }
  } catch (primaryError) {
    console.warn("Fallback to Node.js service due to:", primaryError.message);

    try {
      // Fallback to Node.js rating service
      const fallbackResponse = await fetch(`${BASE_URL_NODE}/add-rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_id: bookId, rating }),
      });

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        return { success: true, data: fallbackData };
      } else {
        const fallbackError = await fallbackResponse.json();
        if (fallbackResponse.status === 404) {
          return {
            success: false,
            error: "Book not found in the fallback service.",
          };
        } else {
          console.error("Fallback service error:", fallbackError.error);
          return {
            success: false,
            error: "Internal server error in fallback service.",
          };
        }
      }
    } catch (fallbackError) {
      console.error(
        "Error connecting to fallback service:",
        fallbackError.message
      );
      return {
        success: false,
        error: "Failed to connect to both rating services.",
      };
    }
  }
};
