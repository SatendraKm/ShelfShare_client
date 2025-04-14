import { BookOpen, Undo2 } from "lucide-react";
import Link from "next/link";

export default function RentedBookCard({ book, onReturn }) {
  return (
    <div className="card bg-base-100 border-base-300 border shadow-sm transition hover:shadow-md">
      <div className="card-body space-y-2">
        <Link href={`/book/${book._id}`}>
          <h2 className="card-title text-base-content">{book.title}</h2>
          <p className="text-neutral text-sm">by {book.author}</p>
          <p className="text-neutral-content text-sm">
            Genre: {book.genres.join(", ")} | Location: {book.location}
          </p>
          {book.owner?.fullName && (
            <p className="text-base-content text-sm">
              Owner: <span className="font-medium">{book.owner.fullName}</span>
            </p>
          )}
        </Link>
        <div className="card-actions mt-2">
          <button
            onClick={() => onReturn(book._id)}
            className="btn btn-sm btn-primary"
          >
            <Undo2 size={16} /> Mark as Returned
          </button>
        </div>
      </div>
    </div>
  );
}
