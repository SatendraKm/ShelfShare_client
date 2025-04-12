"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import BookCard from "@/components/BookCard";

const FeedPage = () => {
  // States for books and loading indicator
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // States for pagination
  const [page, setPage] = useState(1);
  const limit = 10; // You can adjust limit if needed
  const [totalBooks, setTotalBooks] = useState(0);

  // Function to fetch books with current filters and pagination
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
      };

      // If search term is provided, send it as `title` in the query
      if (searchTerm) params.title = searchTerm;
      if (selectedGenre) params.genre = selectedGenre;
      if (selectedLocation) params.location = selectedLocation;

      const res = await api.get("/book", { params });
      setBooks(res.data.data);
      setTotalBooks(res.data.total);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  // Fetch books on component mount and whenever filters/page change
  useEffect(() => {
    fetchBooks();
  }, [searchTerm, selectedGenre, selectedLocation, page]);

  // Handlers for filters and pagination
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset page when filter changes
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setPage(1); // Reset page when filter changes
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    setPage(1); // Reset page when filter changes
  };

  const nextPage = () => {
    if (page * limit < totalBooks) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Book Feed</h1>

      {/* Filter Controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search books"
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {/* Genre Dropdown */}
        <select
          className="select select-bordered w-full"
          value={selectedGenre}
          onChange={handleGenreChange}
        >
          <option value="">All Genres</option>
          <option value="Self-help">Self-help</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-fiction">Non-fiction</option>
          <option value="Biography">Biography</option>
          {/* Add more genres as needed */}
        </select>

        {/* Location Dropdown */}
        <select
          className="select select-bordered w-full"
          value={selectedLocation}
          onChange={handleLocationChange}
        >
          <option value="">All Locations</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          {/* Add more locations as needed */}
        </select>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-xl">Loading feed...</p>
        </div>
      ) : books.length === 0 ? (
        <p className="text-center text-xl">No books found.</p>
      ) : (
        <>
          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              className="btn btn-outline"
              onClick={prevPage}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {Math.ceil(totalBooks / limit)}
            </span>
            <button
              className="btn btn-outline"
              onClick={nextPage}
              disabled={page * limit >= totalBooks}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FeedPage;
