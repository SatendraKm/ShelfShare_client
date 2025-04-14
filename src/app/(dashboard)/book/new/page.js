"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const GENRE_SUGGESTIONS = [
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

export default function CreateBookPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genres: [],
    location: "",
    description: "",
    bookImage: "" || "/bookcover.png",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
    if (user && user.role !== "owner") {
      toast.error("You do not have permission to create a book.");
      router.push("/");
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenresChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (option) => option.value,
    );
    setFormData((prev) => ({
      ...prev,
      genres: selected,
    }));
  };

  const handleGenreRemove = (genre) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.filter((g) => g !== genre),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        bookImage: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bookData = new FormData();
    bookData.append("title", formData.title);
    bookData.append("author", formData.author);
    bookData.append("location", formData.location);
    bookData.append("description", formData.description);
    formData.genres.forEach((genre) => bookData.append("genres", genre)); // backend expects `genres`
    if (formData.bookImage) {
      bookData.append("bookImage", formData.bookImage);
    }
    console.log(bookData);

    try {
      const res = await api.post("/book/new", bookData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);

      if (res.status === 201) {
        toast.success("Book created successfully!");
        router.push(`/book/${res.data.data._id}`);
      } else {
        toast.error("Failed to create the book.");
      }
    } catch (err) {
      toast.error("Something went wrong while creating the book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-100 text-base-content min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-base-200 mx-auto w-full max-w-2xl rounded-2xl p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-primary text-3xl font-bold">📚 Add a New Book</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Fill in the details and upload a cover image.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="title"
              placeholder="Book Title"
              className="input input-bordered w-full"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="author"
              placeholder="Author Name"
              className="input input-bordered w-full"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          {/* Genre Picker */}
          <div>
            <label className="mb-1 block font-semibold">Genres</label>
            <select
              multiple
              className="select select-bordered h-40 w-full"
              value={formData.genres}
              onChange={handleGenresChange}
            >
              {GENRE_SUGGESTIONS.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-400">
              Hold Ctrl (Windows) or Command (Mac) to select multiple.
            </p>
            {/* Selected genres badges */}
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.genres.map((genre) => (
                <div
                  key={genre}
                  className="badge badge-neutral cursor-pointer gap-1 px-3 py-1"
                  onClick={() => handleGenreRemove(genre)}
                  title="Click to remove"
                >
                  {genre} ✕
                </div>
              ))}
            </div>
          </div>

          <input
            type="text"
            name="location"
            placeholder="Available At (City / Hostel / Location)"
            className="input input-bordered w-full"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Write a brief description of the book..."
            className="textarea textarea-bordered h-28 w-full resize-none"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>

          {/* Image Upload */}
          <div>
            <label className="mb-2 block font-semibold">
              Upload Cover Image
            </label>
            <p className="text-sm text-red-500">
              Image upload is not working on versal
            </p>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-4 flex justify-center">
                <Image
                  src={imagePreview}
                  width={180}
                  height={180}
                  alt="Book cover preview"
                  className="border-base-300 rounded-xl border object-cover shadow-md"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner mr-2"></span>
                  Creating...
                </>
              ) : (
                "Create Book"
              )}
            </button>
            <button
              type="button"
              className="btn btn-ghost w-full sm:w-auto"
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
