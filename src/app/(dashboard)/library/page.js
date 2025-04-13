"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import OwnedBookCard from "@/components/OwnedBookCard";
import RentedBookCard from "@/components/RentedBookCard";
import ExchangedBookCard from "@/components/ExchangedBookCard";

export default function LibraryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("owned");
  const [ownedBooks, setOwnedBooks] = useState([]);
  const [rentedBooks, setRentedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [exchangedBooks, setExchangedBooks] = useState([]);

  const handleDeleteBook = (book) => {
    setDeleteTarget(book);
  };
  const [returnTarget, setReturnTarget] = useState(null);

  const confirmReturnBook = async () => {
    if (!returnTarget) return;
    try {
      await api.put(`/book/${returnTarget._id}/mark-returned`);
      toast.success("Book marked as returned");
      fetchRentedBooks();
    } catch (err) {
      console.error("Return failed:", err);
      toast.error("Failed to mark as returned");
    } finally {
      setReturnTarget(null);
    }
  };
  const handleReturnBook = (bookId) => {
    const book = rentedBooks.find((b) => b._id === bookId);
    if (book) {
      setReturnTarget(book);
    }
  };

  // const handleReturnBook = async (bookId) => {
  //   try {
  //     await api.put(`/book/${bookId}/mark-returned`);
  //     toast.success("Book returned successfully");
  //     fetchRentedBooks(); // refresh after return
  //   } catch (err) {
  //     console.error("Return failed:", err);
  //     toast.error("Failed to return book");
  //   }
  // };
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/book/${deleteTarget._id}`);
      toast.success("Book deleted successfully");
      fetchOwnedBooks();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete book");
    } finally {
      setDeleteTarget(null);
    }
  };

  const fetchRentedBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/my-rented-books"); // update this to your actual route
      console.log(res);
      setRentedBooks(res.data.data);
    } catch (err) {
      console.error("Failed to fetch rented books:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnedBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/my-books");
      console.log(res);
      setOwnedBooks(res.data.data);
    } catch (err) {
      console.error("Failed to fetch owned books:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchExchangedBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/my-exchanged-books");
      setExchangedBooks(res.data.data);
    } catch (err) {
      console.error("Failed to fetch exchanged books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    if (user.role === "owner") fetchOwnedBooks();
    fetchRentedBooks();
    fetchExchangedBooks();
  }, [user]);

  const renderTabContent = () => {
    if (activeTab === "owned" && user?.role === "owner") {
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ownedBooks.length === 0 ? (
            <p className="text-gray-500">You haven’t added any books yet.</p>
          ) : (
            ownedBooks.map((book) => (
              <OwnedBookCard
                key={book._id}
                book={book}
                onDelete={handleDeleteBook}
              />
            ))
          )}
        </div>
      );
    }
    if (activeTab === "rented") {
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rentedBooks.length === 0 ? (
            <p className="text-gray-500">You haven’t rented any books yet.</p>
          ) : (
            rentedBooks.map((book) => (
              <RentedBookCard
                key={book._id}
                book={book}
                onReturn={handleReturnBook}
              />
            ))
          )}
        </div>
      );
    }
    if (activeTab === "exchanged") {
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exchangedBooks.length === 0 ? (
            <p className="text-gray-500">
              You haven’t exchanged any books yet.
            </p>
          ) : (
            exchangedBooks.map((book) => (
              <ExchangedBookCard key={book._id} book={book} />
            ))
          )}
        </div>
      );
    }

    return <p className="text-gray-500">Select a tab to view data.</p>;
  };

  const tabs = ["rented", "exchanged"];
  if (user?.role === "owner") tabs.unshift("owned");

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="mb-6 text-3xl font-bold">My Library</h1>

      {/* Tabs */}
      <div className="mb-6 flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded px-4 py-2 capitalize transition ${
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? <p>Loading...</p> : renderTabContent()}
      {deleteTarget && (
        <dialog id="delete_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.title}</strong>?
            </p>
            <div className="modal-action">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-error">
                Delete
              </button>
            </div>
          </div>
        </dialog>
      )}
      {returnTarget && (
        <dialog id="return_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Confirm Return</h3>
            <p className="py-4">
              Are you sure you want to mark{" "}
              <strong>{returnTarget.title}</strong> as returned?
            </p>
            <div className="modal-action">
              <button
                onClick={() => setReturnTarget(null)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button onClick={confirmReturnBook} className="btn btn-primary">
                Return
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
