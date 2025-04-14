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
    imageUrl: "",
  });

  const [genreInput, setGenreInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
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

  const handleGenreAdd = () => {
    const trimmed = genreInput.trim();
    if (trimmed && !formData.genres.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        genres: [...prev.genres, trimmed],
      }));
      setGenreInput("");
    }
  };

  const handleGenreRemove = (tag) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.filter((g) => g !== tag),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
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
    formData.genres.forEach((g) => bookData.append("genres", g));
    if (imageFile) {
      bookData.append("imageUrl", imageFile);
    }

    try {
      const res = await api.post("/book/new", bookData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
          <h1 className="text-primary text-3xl font-bold">
            \ud83d\udcda Add a New Book
          </h1>
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
            <div className="mb-2 flex flex-wrap gap-2">
              {formData.genres.map((tag) => (
                <div
                  key={tag}
                  className="badge badge-neutral cursor-pointer gap-1 px-3 py-1"
                  onClick={() => handleGenreRemove(tag)}
                  title="Click to remove"
                >
                  {tag} \u2715
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Add a genre..."
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleGenreAdd();
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={handleGenreAdd}
              >
                Add
              </button>
            </div>
            <div className="mt-1 text-sm text-gray-400">
              Suggestions: {GENRE_SUGGESTIONS.join(", ")}
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
