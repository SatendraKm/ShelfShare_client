"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import BookCard from "@/components/BookCard";
import { useDebounce } from "use-debounce";
import { FiSearch, FiRefreshCw } from "react-icons/fi";

const genres = [
  "Fiction",
  "Non-Fiction",
  "Fantasy",
  "Romance",
  "Mystery",
  "Thriller",
  "Science Fiction",
  "Biography",
  "Historical",
  "Self-Help",
  "Horror",
];

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
    <div className="dark:bg-base-100 min-h-screen">
      {/* Sticky Title + Filters */}
      <div className="bg-base-100 border-b-base-300 sticky top-16 z-30 border-b px-4 py-2 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Title + Count */}
          <div>
            <h1 className="text-primary text-xl font-bold sm:text-2xl">
              📚 Book Feed
            </h1>
            <p className="text-base-content text-xs">
              {totalBooks} book{totalBooks !== 1 && "s"} found
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {/* Search by Title */}
            <div className="flex items-center gap-1">
              <FiSearch className="text-base-content xs:inline hidden text-lg" />
              <input
                type="text"
                placeholder="Title"
                className="input input-bordered input-sm xs:w-32 w-28 sm:w-40"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Genre Dropdown */}
            <select
              className="select select-bordered select-sm xs:w-32 w-28 sm:w-36"
              value={selectedGenre}
              onChange={handleGenreChange}
            >
              <option value="">Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>

            {/* Location Search */}
            <div className="flex items-center gap-1">
              <FiSearch className="text-base-content xs:inline hidden text-lg" />
              <input
                type="text"
                placeholder="Location"
                className="input input-bordered input-sm xs:w-28 w-24 sm:w-36"
                value={selectedLocation}
                onChange={handleLocationChange}
              />
            </div>

            {/* Reset Button */}
            <button className="btn btn-sm btn-outline" onClick={resetFilters}>
              <FiRefreshCw className="xs:inline mr-1 hidden" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
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
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                className="btn btn-outline btn-sm"
                onClick={prevPage}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-base-content text-sm">
                Page <strong>{page}</strong> of {Math.ceil(totalBooks / limit)}
              </span>
              <button
                className="btn btn-outline btn-sm"
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
