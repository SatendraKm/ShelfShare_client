// components/ExchangedBookCard.js

export default function ExchangedBookCard({ book }) {
  return (
    <div className="rounded-lg border p-4 shadow transition hover:shadow-md">
      <h2 className="mb-2 text-xl font-semibold">{book.title}</h2>
      <p className="mb-1 text-gray-600">Author: {book.author}</p>
      <p className="mb-1 text-gray-600">Genre: {book.genre}</p>
      <p className="text-sm text-gray-500">
        Exchanged with:{" "}
        <span className="font-medium">{book.ownerId?.fullName}</span>
      </p>
    </div>
  );
}
