"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const genres_SUGGESTIONS = [
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

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genres: [],
    location: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/book/${id}`);
        const data = res.data.data;

        if (data.ownerId._id !== user?._id) {
          toast.error("You are not authorized to edit this book.");
          return router.push("/feed");
        }

        setBook(data);
        setFormData({
          title: data.title,
          author: data.author,
          genres: Array.isArray(data.genres) ? data.genres : [data.genres],
          location: data.location,
          description: data.description,
          imageUrl: data.imageUrl || "",
        });

        setImagePreview(data.imageUrl || null);
      } catch (err) {
        toast.error("Failed to fetch book data.");
        router.push("/feed");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, router, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();

    body.append("title", formData.title);
    body.append("author", formData.author);
    body.append("location", formData.location);
    body.append("description", formData.description);
    formData.genres.forEach((g) => body.append("genre", g)); // append as "genre" (backend normalizes this)

    if (imageFile) {
      body.append("imageUrl", imageFile);
    }

    try {
      const res = await api.put(`/book/${id}`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success("Book updated successfully!");
        router.push(`/book/${id}`);
      } else {
        toast.error("Update failed.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <h2 className="text-primary text-3xl font-bold">
          Edit: <span className="underline">{book?.title}</span>
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Make changes and click &quot;Save Changes&quot; to update.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-base-100 border-base-300 space-y-6 rounded-xl border p-6 shadow-lg"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="input input-bordered w-full"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            className="input input-bordered w-full"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        {/* Genre picker */}
        <div>
          <label className="mb-1 block font-semibold">Genres</label>
          <select
            multiple
            className="select select-bordered h-40 w-full"
            value={formData.genres}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(
                (option) => option.value,
              );
              setFormData((prev) => ({
                ...prev,
                genres: selected,
              }));
            }}
          >
            {genres_SUGGESTIONS.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-400">
            Hold Ctrl (Windows) or Command (Mac) to select multiple.
          </p>
        </div>

        <input
          type="text"
          name="location"
          placeholder="Location"
          className="input input-bordered w-full"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="textarea textarea-bordered h-32 w-full"
          value={formData.description}
          onChange={handleChange}
          required
        />

        {/* Image section */}
        <div className="space-y-2">
          <label className="text-base-content block font-semibold">
            Book Image
          </label>
          {imagePreview && (
            <Image
              width={200}
              height={200}
              src={imagePreview}
              alt="Preview"
              className="border-base-300 h-48 w-full rounded-lg border object-cover"
            />
          )}
          <p className="text-sm text-red-500">
            Image upload is not working on versal
          </p>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={handleImageChange}
          />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
