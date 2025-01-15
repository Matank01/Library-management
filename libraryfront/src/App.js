import React, { useState } from "react";
import Swal from "sweetalert2";

import { registerUser } from "./services/registerService";
import { addBook } from "./services/addBookService";
import { searchBooks } from "./services/searchBookService";
import { rateBook } from "./services/rateBookService";
import { borrowBook } from "./services/borrowBookService";
import { fetchReports } from "./services/reportsService";
import { returnBook } from "./services/returnBookService";
import { deleteUser } from "./services/deleteUserService";

const App = () => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    const result = await registerUser(username);
    if (result.success) {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError(result.error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const { value: userId } = await Swal.fire({
        title: "Delete a User",
        input: "text",
        inputLabel: "User ID",
        inputPlaceholder: "Enter the User ID to delete",
        showCancelButton: true,
        confirmButtonText: "Delete",
        showLoaderOnConfirm: true,
        preConfirm: async (userId) => {
          if (!userId) {
            Swal.showValidationMessage("User ID is required.");
            return;
          }

          const result = await deleteUser(userId);

          if (result.success) {
            Swal.fire("Success", result.data.message, "success");
          } else {
            Swal.fire("Error", result.error, "error");
          }
        },
      });
    } catch (error) {
      Swal.fire("Error", "An error occurred while deleting the user.", "error");
    }
  };
  const handleReturnBook = async () => {
    try {
      const { value: formValues } = await Swal.fire({
        title: "Return a Book",
        html: `
          <input id="swal-input1" class="swal2-input" placeholder="User ID">
          <input id="swal-input2" class="swal2-input" placeholder="Book ID">
        `,
        focusConfirm: false,
        preConfirm: () => {
          const userId = document.getElementById("swal-input1").value;
          const bookId = document.getElementById("swal-input2").value;
          if (!userId || !bookId) {
            Swal.showValidationMessage(
              "Both User ID and Book ID are required."
            );
            return;
          }
          return { userId, bookId };
        },
      });

      if (formValues) {
        const result = await returnBook(formValues.userId, formValues.bookId);

        if (result.success) {
          Swal.fire("Success", "Book returned successfully!", "success");
        } else {
          Swal.fire("Error", result.error, "error");
        }
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "An error occurred while returning the book.",
        "error"
      );
    }
  };
  const handleBorrowBook = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Borrow a Book",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="User ID">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Book ID">',
      focusConfirm: false,
      preConfirm: () => {
        const userId = document.getElementById("swal-input1").value;
        const bookId = document.getElementById("swal-input2").value;
        if (!userId || !bookId) {
          Swal.showValidationMessage("Both User ID and Book ID are required.");
          return;
        }
        return { userId, bookId };
      },
    });

    if (formValues) {
      const { userId, bookId } = formValues;
      const result = await borrowBook(userId, bookId);
      if (result.success) {
        Swal.fire("Success", "Book borrowed successfully!", "success");
      } else {
        Swal.fire("Error", result.error, "error");
      }
    }
  };

  const handleRateBook = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Rate a Book",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Book ID">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Rating (1-5)">',
      focusConfirm: false,
      preConfirm: () => {
        const bookId = document.getElementById("swal-input1").value;
        const rating = parseInt(
          document.getElementById("swal-input2").value,
          10
        );

        if (!bookId || isNaN(rating) || rating < 1 || rating > 5) {
          Swal.showValidationMessage(
            "Both fields are required, and rating must be between 1 and 5."
          );
          return;
        }

        return { bookId, rating };
      },
    });

    if (formValues) {
      const { bookId, rating } = formValues;
      const result = await rateBook(bookId, rating);

      if (result.success) {
        Swal.fire("Success", "Rating added successfully!", "success");
      } else {
        Swal.fire("Error", result.error, "error");
      }
    }
  };

  const handleGenerateReport = async () => {
    try {
      const result = await fetchReports();

      if (result.success) {
        const { total_books, total_borrows, popular_books, average_ratings } =
          result.data;

        Swal.fire({
          title: "Library Report",
          html: `
            <p><strong>Total Books:</strong> ${total_books}</p>
            <p><strong>Total Borrows:</strong> ${total_borrows}</p>
            <h3><strong>Top 5 Popular Books</strong></h3>
            <ul>
              ${popular_books
                .map(
                  (book) =>
                    `<li>${book.title} (${book.total_borrows} borrows)</li>`
                )
                .join("")}
            </ul>
            <h3><strong>Top Rated Books</strong></h3>
            <ul>
              ${average_ratings
                .map(
                  (book) =>
                    `<li>${book.title} (Rating: ${book.average_rating.toFixed(
                      2
                    )})</li>`
                )
                .join("")}
            </ul>
          `,
          icon: "info",
          showConfirmButton: true,
        });
      } else {
        Swal.fire("Error", result.error, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Unable to fetch reports.", "error");
    }
  };

  const handleSearchBooks = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Search for Books",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Title">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Author">' +
        '<input id="swal-input3" class="swal2-input" placeholder="Category">',
      focusConfirm: false,
      preConfirm: () => {
        const title = document.getElementById("swal-input1").value;
        const author = document.getElementById("swal-input2").value;
        const category = document.getElementById("swal-input3").value;
        return { title, author, category };
      },
    });

    if (formValues) {
      const searchParams = {};
      if (formValues.title) searchParams.title = formValues.title;
      if (formValues.author) searchParams.author = formValues.author;
      if (formValues.category) searchParams.category = formValues.category;

      const result = await searchBooks(searchParams);
      if (result.success) {
        const books = result.data.map(
          (book) =>
            `<li>${book.title} by ${book.author} (${book.category})</li>`
        );
        Swal.fire({
          title: "Search Results",
          html: `<ul>${books.join("")}</ul>`,
          icon: "info",
        });
      } else {
        Swal.fire("Error", result.error, "error");
      }
    }
  };
  const handleAddBook = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add a New Book",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Title">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Author">' +
        '<input id="swal-input3" class="swal2-input" placeholder="Category">',
      focusConfirm: false,
      preConfirm: () => {
        const title = document.getElementById("swal-input1").value;
        const author = document.getElementById("swal-input2").value;
        const category = document.getElementById("swal-input3").value;
        if (!title || !author || !category) {
          Swal.showValidationMessage("All fields are required.");
          return;
        }
        const bookDetails = {
          title: title,
          author: author,
          category: category,
        };
        return bookDetails;
      },
    });

    if (formValues) {
      const result = await addBook(formValues);
      if (result.success) {
        Swal.fire("Success", "Book added successfully!", "success");
      } else {
        Swal.fire("Error", result.error, "error");
      }
    }
  };
  return (
    <div className="app min-h-screen bg-gray-900 text-gray-100">
      {!isLoggedIn ? (
        <div className="register-page flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold mb-6 text-white">Register</h1>
          <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
            >
              Register
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      ) : (
        <div className="main-page flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold mb-4 text-white">
            Welcome, {username}!
          </h1>
          <p className="text-gray-400 mb-8">
            You have been successfully registered.
          </p>
          <div className="services w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Available Services
            </h2>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={handleAddBook}
                  className="w-full py-2 rounded bg-[#002395] hover:bg-green-500 text-white font-semibold"
                >
                  Add Book
                </button>
              </li>
              <li>
                <button
                  onClick={handleBorrowBook}
                  className="w-full py-2 rounded bg-[#002395] hover:bg-blue-500 text-white font-semibold"
                >
                  Borrow Book
                </button>
              </li>
              <li>
                <button
                  onClick={handleReturnBook}
                  className="w-full py-2 rounded bg-[#002395] hover:bg-yellow-500 text-white font-semibold"
                >
                  Return Book
                </button>
              </li>
              <li>
                <button
                  onClick={handleRateBook}
                  className="w-full py-2 rounded bg-[#002395] hover:bg-purple-500 text-white font-semibold"
                >
                  Rate Book
                </button>
              </li>
              <li>
                <button
                  onClick={handleSearchBooks}
                  className="w-full py-2 rounded bg-[#002395] hover:bg-pink-500 text-white font-semibold"
                >
                  Search Book
                </button>
              </li>
              <li>
                <button
                  onClick={handleGenerateReport}
                  className="w-full py-2 rounded bg-[#002395] hover:bg-orange-500 text-white font-semibold"
                >
                  Reports
                </button>
              </li>
              <li>
                <button
                  onClick={handleDeleteUser}
                  className="w-full py-2 rounded bg-[#002395] hover:bg-red-500 text-white font-semibold"
                >
                  Delete User
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
