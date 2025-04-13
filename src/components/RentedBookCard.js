import React from "react";

export default function RentedBookCard({ book, onReturn }) {
  return (
    <div className="rounded-lg border p-4 shadow transition hover:shadow-md">
      <h2 className="text-lg font-semibold">{book.title}</h2>
      <p className="text-gray-600">by {book.author}</p>
      <p className="mt-1 text-sm text-gray-500">
        Genre: {book.genre} | Location: {book.location}
      </p>

      {book.owner?.fullName && (
        <p className="mt-2 text-sm text-gray-500">
          Owner: {book.owner.fullName}
        </p>
      )}

      <button
        onClick={() => onReturn(book._id)}
        className="btn btn-sm btn-primary mt-4"
      >
        Mark as Returned
      </button>
    </div>
  );
}
