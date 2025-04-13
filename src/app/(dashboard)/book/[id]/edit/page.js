"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null); // for preview
  const [imageFile, setImageFile] = useState(null); // actual file
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    location: "",
    description: "",
    imageUrl: "", // will be preserved if no new file is chosen
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/book/${id}`);
        const data = res.data.data;
        console.log(data);

        if (data.ownerId._id !== user?._id) {
          toast.error("You are not authorized to edit this book.");
          return router.push("/feed");
        }

        setBook(data);
        setFormData({
          title: data.title,
          author: data.author,
          genre: data.genre,
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

    // Append text fields
    Object.keys(formData).forEach((key) => {
      body.append(key, formData[key]);
    });

    // Append image file only if changed
    if (imageFile) {
      body.set("imageUrl", imageFile);
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

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h2 className="mb-4 text-2xl font-bold">
        Edit- <span className="underline">{book?.title}</span>
      </h2>
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
        <div className="space-y-2">
          <label className="block font-semibold">Book Image</label>
          {imagePreview && (
            <Image
              width={100}
              height={100}
              src={imagePreview}
              alt="Preview"
              className="h-40 w-full rounded-lg border object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={handleImageChange}
          />
        </div>

        <div className="mt-6 flex justify-between">
          <button type="submit" className="btn btn-primary">
            Save Changes
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
