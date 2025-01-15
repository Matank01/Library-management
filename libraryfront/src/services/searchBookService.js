const BASE_URL_PYTHON = "http://localhost:5003";
const BASE_URL_NODE = "http://localhost:5008";

export const searchBooks = async (searchParams) => {
  const query = new URLSearchParams(searchParams).toString();

  try {
    // Attempt primary Python-based search service
    const response = await fetch(`${BASE_URL_PYTHON}/search?${query}`);
    if (response.ok) {
      const data = await response.json();
      return { success: true, data: data.books };
    } else if (response.status === 404) {
      const error = await response.json();
      return { success: false, error: "No such book exists." };
    } else {
      throw new Error("Primary service failed with status: " + response.status);
    }
  } catch (primaryError) {
    console.error("Primary service error:", primaryError.message);

    try {
      // Fallback to Node.js search service
      const fallbackResponse = await fetch(`${BASE_URL_NODE}/search?${query}`);
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        return { success: true, data: fallbackData.books };
      } else if (fallbackResponse.status === 404) {
        return { success: false, error: "No such book exists." };
      } else {
        throw new Error(
          "Fallback service failed with status: " + fallbackResponse.status
        );
      }
    } catch (fallbackError) {
      console.error("Fallback service error:", fallbackError.message);
      return {
        success: false,
        error: "Failed to connect to both search services.",
      };
    }
  }
};
