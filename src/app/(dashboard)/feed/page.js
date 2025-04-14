"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import BookCard from "@/components/BookCard";
import { useDebounce } from "use-debounce";
import { FiSearch, FiRefreshCw } from "react-icons/fi";

const FeedPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalBooks, setTotalBooks] = useState(0);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
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

  useEffect(() => {
    fetchBooks();
  }, [debouncedSearchTerm, selectedGenre, selectedLocation, page]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setPage(1);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedGenre("");
    setSelectedLocation("");
    setPage(1);
  };

  const nextPage = () => {
    if (page * limit < totalBooks) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="dark:bg-base-100 min-h-screen px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-primary mb-2 text-4xl font-bold">📚 Book Feed</h1>
        <p className="text-base-content mb-6 text-sm">
          {totalBooks} book{totalBooks !== 1 && "s"} found
        </p>

        {/* Filters */}
        <div className="bg-base-100 mb-8 flex flex-col items-stretch gap-4 rounded-xl p-4 shadow md:flex-row md:items-end">
          <div className="flex flex-1 items-center gap-2">
            <FiSearch className="text-base-content text-xl" />
            <input
              type="text"
              placeholder="Search by title"
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <select
            className="select select-bordered w-full md:w-48"
            value={selectedGenre}
            onChange={handleGenreChange}
          >
            <option value="">All Genres</option>
            <option value="Self-help">Self-help</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-fiction">Non-fiction</option>
            <option value="Biography">Biography</option>
          </select>

          <select
            className="select select-bordered w-full md:w-48"
            value={selectedLocation}
            onChange={handleLocationChange}
          >
            <option value="">All Locations</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
          </select>

          <button className="btn btn-outline md:btn-sm" onClick={resetFilters}>
            <FiRefreshCw className="mr-2" /> Reset
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : books.length === 0 ? (
          <div className="py-12 text-center text-lg">No books found.</div>
        ) : (
          <>
            {/* Book Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                className="btn btn-outline"
                onClick={prevPage}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-base-content">
                Page <strong>{page}</strong> of {Math.ceil(totalBooks / limit)}
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
    </div>
  );
};

export default FeedPage;
