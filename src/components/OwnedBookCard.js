import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default function OwnedBookCard({ book, onDelete }) {
  return (
    <div className="card bg-base-100 border-base-300 border shadow-sm transition hover:shadow-md">
      <div className="card-body space-y-2">
        <Link href={`/book/${book._id}`}>
          <h3 className="card-title text-base-content">{book.title}</h3>
          <p className="text-base">by {book.author}</p>
          <p className="text-base-content my-2 text-sm">
            Genre: {book.genres.join(", ")}
          </p>
          <p className="text-base-content text-sm">
            Status:{" "}
            <span
              className={`badge ${
                book.status === "available" ? "badge-success" : "badge-warning"
              }`}
            >
              {book.status}
            </span>
          </p>
        </Link>

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
    </div>
  );
}
