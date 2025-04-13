import Link from "next/link";

export default function OwnedBookCard({ book, onDelete }) {
  return (
    <div className="rounded-xl border p-4 shadow-md transition hover:shadow-lg">
      <h3 className="text-lg font-semibold">{book.title}</h3>
      <p className="text-sm text-gray-600">by {book.author}</p>
      <p className="text-sm text-gray-500">Genre: {book.genre}</p>
      <p className="mt-1 text-sm">
        Status:{" "}
        <span
          className={`font-medium ${
            book.status === "available" ? "text-green-600" : "text-yellow-600"
          }`}
        >
          {book.status}
        </span>
      </p>

      {book.status !== "exchanged" && (
        <div className="mt-4 flex space-x-2">
          <Link
            href={`book/${book?._id}/edit`}
            className="flex items-center gap-1 rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(book)}
            className="flex items-center gap-1 rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
