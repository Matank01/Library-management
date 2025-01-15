const BASE_URL = "http://localhost:5007";

/**
 * Fetch reports from the service.
 *
 * @returns {Promise<object>} - Result with success and data/error details.
 */
export const fetchReports = async () => {
  try {
    const response = await fetch(`${BASE_URL}/reports`);

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
      error: "Failed to connect to the reports service.",
    };
  }
};
