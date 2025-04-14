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

  useEffect(() => {
    if (!user) return;
    fetchBook();
  }, [bookId, user]);

  const isOwner = user?._id === book?.ownerId?._id;

  const hasRequested = book?.requests?.some(
    (req) => req.requesterId?._id === user?._id,
  );

  const handleRequest = async (type) => {
    try {
      setIsRequesting(true);
      const res = await api.post(`/request`, { bookId, type });

      if (res.status === 201) {
        toast.success(`${type === "rent" ? "Rent" : "Exchange"} request sent!`);
        await fetchBook();
      } else {
        toast.error(`Failed to request ${type}.`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error sending request.");
    } finally {
      setIsRequesting(false);
      router.refresh();
    }
  };

  const handleCancelRequest = async () => {
    if (!myRequest) return;
    try {
      setIsRequesting(true);
      await api.put(`/request/${myRequest._id}/cancel`);
      toast.success("Request cancelled successfully.");
      await fetchBook();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to cancel request.",
      );
    } finally {
      setIsRequesting(false);
      router.refresh();
    }
  };

  if (loading || !book) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="text-base-content container mx-auto max-w-7xl px-4 py-8">
      {/* Back to Feed */}
      <div className="mb-6">
        <Link href="/feed" className="btn btn-md btn-outline text-lg">
          Back to Feed
        </Link>
      </div>

      {/* Book Detail Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Book Image */}
          <div className="relative h-80 w-full lg:h-full">
            <Image
              src={book.imageUrl || "/default-book.jpg"}
              alt={book.title}
              fill
              className="rounded-t-lg object-cover lg:rounded-l-lg lg:rounded-tr-none"
            />
          </div>

          {/* Right: Book Info */}
          <div className="card-body flex flex-col gap-4 p-6">
            <div>
              <h2 className="text-2xl font-bold">{book.title}</h2>
              <p className="mt-1 text-base">{book.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>Genre:</strong> {book.genre}
              </p>
              <p>
                <strong>Location:</strong> {book.location}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="badge badge-outline capitalize">
                  {book.status}
                </span>
              </p>
            </div>

            {/* Owner Info */}
            {book.ownerId && (
              <div className="border-base-300 mt-4 border-t pt-4 dark:border-gray-700">
                <p className="mb-2 text-base font-semibold">Owner</p>
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
                    <p className="text-sm font-normal">
                      {book.ownerId.emailId}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              {isOwner ? (
                <>
                  <Link
                    href="/requests"
                    className="btn btn-info btn-outline w-full sm:w-auto"
                  >
                    Check Requests
                  </Link>
                  <Link
                    href="/library"
                    className="btn btn-accent btn-outline w-full sm:w-auto"
                  >
                    Go to Your Library
                  </Link>
                  {book.status !== "exchanged" && (
                    <Link
                      href={`/book/${book._id}/edit`}
                      className="btn btn-warning btn-outline w-full sm:w-auto"
                    >
                      Edit Book
                    </Link>
                  )}
                </>
              ) : (
                <>
                  {book.status === "available" && !hasRequested ? (
                    <>
                      <button
                        onClick={() => handleRequest("rent")}
                        className="btn btn-success btn-outline w-full sm:w-auto"
                        disabled={isRequesting}
                      >
                        Request to Rent
                      </button>
                      <button
                        onClick={() => handleRequest("exchange")}
                        className="btn btn-warning btn-outline w-full sm:w-auto"
                        disabled={isRequesting}
                      >
                        Request to Exchange
                      </button>
                    </>
                  ) : (
                    <p className="text-info text-sm italic">
                      This book is currently {book.status}.
                    </p>
                  )}

                  {hasRequested && (
                    <div className="flex w-full flex-col gap-2">
                      <p className="text-info text-sm italic">
                        You&apos;ve already requested this book.
                      </p>

                      {myRequest?.status === "pending" ? (
                        <button
                          onClick={handleCancelRequest}
                          className="btn btn-error btn-outline w-full sm:w-auto"
                          disabled={isRequesting}
                        >
                          Cancel Request
                        </button>
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Request status: {myRequest?.status}
                        </p>
                      )}
                    </div>
                  )}

                  <Link
                    href="/library"
                    className="btn btn-outline w-full sm:w-auto"
                  >
                    Go to Your Library
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
