const BASE_URL_PYTHON = "http://localhost:5004";
const BASE_URL_NODE = "http://localhost:5010";

/**
 * Borrow a book using a primary Python-based service
 * with a fallback to a Node.js-based service.
 *
 * @param {string} userId - The ID of the user borrowing the book.
 * @param {string} bookId - The ID of the book to borrow.
 * @returns {Promise<object>} - Result with success and data/error details.
 */
export const borrowBook = async (userId, bookId) => {
  try {
    // Attempt primary Python-based borrowing service
    const response = await fetch(`${BASE_URL_PYTHON}/borrow-book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, book_id: bookId }),
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
      } else if (response.status === 409) {
        return { success: false, error: "Book is already borrowed." };
      } else {
        console.error("Primary service error:", error.error);
        throw new Error("Primary service failed.");
      }
    }
  } catch (primaryError) {
    console.warn("Fallback to Node.js service due to:", primaryError.message);

    try {
      // Fallback to Node.js borrowing service
      const fallbackResponse = await fetch(`${BASE_URL_NODE}/borrow-book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, book_id: bookId }),
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
        } else if (fallbackResponse.status === 409) {
          return {
            success: false,
            error: "Book is already borrowed in the fallback service.",
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
        error: "Failed to connect to both borrowing services.",
      };
    }
  }
};
