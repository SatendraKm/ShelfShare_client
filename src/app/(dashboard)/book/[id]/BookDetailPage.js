"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import api from "@/lib/api"; // Adjust the import based on your project structure
import { useAuth } from "@/context/AuthContext"; // Adjust the import based on your project structure

export default function BookDetailPage({ bookId }) {
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth(); // Replace with your actual auth logic
  const currentUser = user;
  const isOwner = currentUser?._id === book?.ownerId;
  const isBorrowed = book?.status === "rented";

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/book/${bookId}`);
        console.log(res);
        setBook(res.data.data);
      } catch (error) {
        console.error("Error fetching book:", error);
        toast.error("Book not found.");
        router.push("/feed");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/book/${bookId}`);
      console.log(res);
      if (res.status === 200) {
        toast.success(res.data.message || "Book deleted successfully.");
        router.push("/feed");
      } else {
        toast.error("Failed to delete book");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (loading || !book) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/feed" className="btn btn-ghost">
          &larr; Back to Feed
        </Link>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <figure className="relative h-64 w-full">
          <Image
            src={book.imageUrl || "/default-book.jpg"}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="rounded-t object-cover"
          />
        </figure>

        <div className="card-body">
          <h2 className="card-title">{book.title}</h2>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Author:</span> {book.author}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Genre:</span> {book.genre}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Location:</span> {book.location}
          </p>
          <p className="mt-4">{book.description}</p>

          <div className="mt-4 flex flex-col gap-2">
            <span className="badge badge-outline w-fit">
              {book.status === "available"
                ? "Available"
                : book.status === "rented"
                  ? "Rented"
                  : "Other"}
            </span>

            {book.owner && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Owner:</span> {book.owner.name} (
                {book.owner.email})
              </p>
            )}

            {isBorrowed && book.borrower && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Borrowed By:</span>{" "}
                {book.borrower.name} ({book.borrower.email})
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            {isOwner ? (
              <>
                <Link
                  href={`/books/${bookId}/edit`}
                  className="btn btn-primary"
                >
                  Edit Book
                </Link>
                <button
                  onClick={() => setShowModal(true)}
                  className="btn btn-error"
                >
                  Delete
                </button>
              </>
            ) : (
              book.status === "available" && (
                <button className="btn btn-success">Request to Borrow</button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Confirm Deletion</h3>
            <p className="py-4">Are you sure you want to delete this book?</p>
            <div className="modal-action">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="btn btn-error">
                Confirm
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
