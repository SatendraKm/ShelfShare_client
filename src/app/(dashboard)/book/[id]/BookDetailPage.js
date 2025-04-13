"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function BookDetailPage({ bookId }) {
  const router = useRouter();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [myRequest, setMyRequest] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/book/${bookId}`);
        setBook(res.data.data);

        const myPendingRequest = res.data.data.requests.find(
          (req) => req.requesterId._id === user._id && req.status === "pending",
        );
        setMyRequest(myPendingRequest || null);
      } catch (err) {
        toast.error("Failed to load book.");
        router.push("/feed");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId, user]);

  const isOwner = user?._id === book?.ownerId?._id;

  // check if logged-in user has already requested this book
  const hasRequested = book?.requests?.some(
    (req) => req.requesterId?._id === user?._id,
  );

  const handleRequest = async (type) => {
    try {
      setIsRequesting(true);
      const res = await api.post(`/request`, {
        bookId,
        type,
      });

      if (res.status === 201) {
        toast.success(`${type === "rent" ? "Rent" : "Exchange"} request sent!`);
        router.refresh(); // reload the data
      } else {
        toast.error(`Failed to request ${type}.`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error sending request.");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!myRequest) return;
    try {
      setIsRequesting(true);
      const res = await api.put(`/request/${myRequest._id}/cancel`);
      toast.success("Request cancelled successfully.");
      router.refresh();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to cancel request.",
      );
    } finally {
      setIsRequesting(false);
    }
  };

  if (loading || !book) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-4">
        <Link href="/feed" className="btn btn-ghost">
          ← Back to Feed
        </Link>
      </div>

      {/* Book Card */}
      <div className="card bg-base-100 shadow-xl">
        {/* Book Image */}
        <figure className="relative h-64 w-full">
          <Image
            src={book.imageUrl || "/default-book.jpg"}
            alt={book.title}
            fill
            className="rounded-t object-cover"
          />
        </figure>

        {/* Book Details */}
        <div className="card-body">
          <h2 className="card-title text-2xl">{book.title}</h2>
          <p className="text-gray-700">
            <strong>Author:</strong> {book.author}
          </p>
          <p className="text-gray-700">
            <strong>Genre:</strong> {book.genre}
          </p>
          <p className="text-gray-700">
            <strong>Location:</strong> {book.location}
          </p>
          <p className="mt-4 text-sm">{book.description}</p>

          {/* Status */}
          <div className="mt-4">
            <span className="badge badge-outline capitalize">
              {book.status}
            </span>
          </div>

          {/* Owner Info */}
          {book.ownerId && (
            <div className="mt-6 border-t pt-4">
              <p className="mb-2 text-lg font-semibold">Owner Info</p>
              <div className="flex items-center gap-4">
                <Image
                  src={book.ownerId.photoUrl || "/default-avatar.png"}
                  alt={book.ownerId.fullName}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{book.ownerId.fullName}</p>
                  <p className="text-sm text-gray-600">
                    {book.ownerId.emailId}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">
            {isOwner ? (
              <>
                <Link href="/requests" className="btn btn-info">
                  Check Requests
                </Link>
                <Link href="/library" className="btn btn-accent">
                  Go to Your Library
                </Link>
                {book.status !== "exchanged" && (
                  <Link
                    href={`/book/${book._id}/edit`}
                    className="btn btn-warning"
                  >
                    Edit Book
                  </Link>
                )}
              </>
            ) : (
              <>
                {book.status === "available" && !hasRequested && (
                  <>
                    <button
                      onClick={() => handleRequest("rent")}
                      className="btn btn-success"
                      disabled={isRequesting}
                    >
                      Request to Rent
                    </button>
                    <button
                      onClick={() => handleRequest("exchange")}
                      className="btn btn-warning"
                      disabled={isRequesting}
                    >
                      Request to Exchange
                    </button>
                  </>
                )}

                {book.status !== "available" && (
                  <p className="text-info text-sm italic">
                    This book is currently {book.status}.
                  </p>
                )}

                {hasRequested && (
                  <div className="flex flex-col gap-2">
                    <p className="text-info text-sm italic">
                      You’ve already requested this book.
                    </p>

                    {myRequest?.status === "pending" && (
                      <button
                        onClick={handleCancelRequest}
                        className="btn btn-error"
                        disabled={isRequesting}
                      >
                        Cancel Request
                      </button>
                    )}

                    {myRequest?.status !== "pending" && (
                      <p className="text-sm text-gray-600">
                        Request status: {myRequest?.status}
                      </p>
                    )}
                  </div>
                )}

                <Link href="/library" className="btn btn-accent">
                  Go to Your Library
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
