"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function CreateBookPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    location: "",
    description: "",
    bookImage: "",
  });
  const [imagePreview, setImagePreview] = useState(null); // For previewing the uploaded image
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Redirect to login if user is not authenticated
    }
    if (user && user.role !== "owner") {
      toast.error("You do not have permission to create a book.");
      router.push("/"); // Redirect to home if user is not admin
    }
  }, [user, router]);

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
      setImagePreview(URL.createObjectURL(file)); // Show preview
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
    for (const key in formData) {
      bookData.append(key, formData[key]);
    }

    try {
      const res = await api.post("/book/new", bookData, {
        headers: {
          "Content-Type": "multipart/form-data", // Make sure the server expects this
        },
      });

      if (res.status === 201) {
        toast.success("Book created successfully!");
        router.push(`/book/${res.data.data._id}`); // Redirect to the book's page
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
    <div className="mx-auto max-w-2xl p-6">
      <h2 className="mb-4 text-2xl font-bold">Add a New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          className="input input-bordered w-full"
          value={formData.genre}
          onChange={handleChange}
          required
        />
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
          className="textarea textarea-bordered w-full"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        {/* Image Upload */}
        <div className="mb-4">
          <input
            type="file"
            disabled
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <Image
                width={32}
                height={32}
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Book"}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
