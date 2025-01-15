const addBook = async (bookDetails) => {
  try {
    const response = await fetch("http://localhost:5002/add_book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookDetails),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add book");
    }

    return { success: true, data: await response.json() };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export { addBook };
