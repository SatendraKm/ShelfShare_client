import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default function OwnedBookCard({ book, onDelete }) {
  return (
    <div className="card bg-base-100 border shadow-sm transition hover:shadow-md">
      <Link href={`/book/${book._id}`}>
        <div className="card-body space-y-2">
          <h3 className="card-title">{book.title}</h3>
          <p className="text-sm text-gray-600">by {book.author}</p>
          <p className="text-sm text-gray-500">Genre: {book.genre}</p>
          <p className="text-sm">
            Status:{" "}
            <span
              className={`badge ${
                book.status === "available" ? "badge-success" : "badge-warning"
              }`}
            >
              {book.status}
            </span>
          </p>

          {book.status !== "exchanged" && (
            <div className="card-actions mt-2 flex gap-2">
              <Link
                href={`/book/${book?._id}/edit`}
                className="btn btn-sm btn-outline btn-info"
              >
                <Pencil size={16} /> Edit
              </Link>
              <button
                onClick={() => onDelete(book)}
                className="btn btn-sm btn-outline btn-error"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
