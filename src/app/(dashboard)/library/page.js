"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import RequestCard from "@/components/RequestCard";
import BookCard from "@/components/BookCard";

export default function LibraryPage() {
  const { user } = useAuth();
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [ownedBooks, setOwnedBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");

  const fetchLibrary = async () => {
    try {
      setLoading(true);

      const [ownedRes, borrowedRes] = await Promise.all([
        api.get("/book/owned/me"),
        api.get("/book/borrowed/me"),
      ]);

      const accepted = reqRes.data.requests.filter(
        (r) => r.status === "accepted" && r.requester._id === user._id,
      );

      setAcceptedRequests(accepted);
      setOwnedBooks(ownedRes.data.data);
      setBorrowedBooks(borrowedRes.data.data);
    } catch (err) {
      console.error("Failed to fetch library", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchLibrary();
  }, [user]);

  const grouped = {
    borrow: acceptedRequests.filter((r) => r.type === "borrow"),
    exchange: acceptedRequests.filter((r) => r.type === "exchange"),
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "requests":
        return (
          <>
            {["borrow", "exchange"].map((type) => (
              <div key={type} className="mb-6">
                <h2 className="mb-2 text-xl font-semibold capitalize">
                  {type}s
                </h2>
                {grouped[type].length === 0 ? (
                  <p className="text-gray-500">No {type}s yet.</p>
                ) : (
                  <div className="grid gap-4">
                    {grouped[type].map((request) => (
                      <RequestCard
                        key={request._id}
                        data={request}
                        isOwner={false}
                        refresh={fetchLibrary}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        );
      case "owned":
        return (
          <div className="grid gap-4">
            {ownedBooks.length === 0 ? (
              <p className="text-gray-500">You haven’t added any books yet.</p>
            ) : (
              ownedBooks.map((book) => <BookCard key={book._id} book={book} />)
            )}
          </div>
        );
      case "borrowed":
        return (
          <div className="grid gap-4">
            {borrowedBooks.length === 0 ? (
              <p className="text-gray-500">
                You haven’t borrowed any books yet.
              </p>
            ) : (
              borrowedBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">My Library</h1>

      {/* Tabs */}
      <div className="mb-6 flex space-x-4">
        {["requests", "owned", "borrowed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded px-4 py-2 transition ${
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <p>Loading...</p> : renderTabContent()}
    </div>
  );
}
