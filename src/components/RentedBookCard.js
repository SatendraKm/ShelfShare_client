import { BookOpen, Undo2 } from "lucide-react";
import Link from "next/link";

export default function RentedBookCard({ book, onReturn }) {
  return (
    <div className="card bg-base-100 border shadow-sm transition hover:shadow-md">
      <Link href={`/book/${book._id}`}>
        <div className="card-body space-y-2">
          <h2 className="card-title">{book.title}</h2>
          <p className="text-sm text-gray-600">by {book.author}</p>
          <p className="text-sm text-gray-500">
            Genre: {book.genre} | Location: {book.location}
          </p>
          {book.owner?.fullName && (
            <p className="text-sm">
              Owner: <span className="font-medium">{book.owner.fullName}</span>
            </p>
          )}
          <div className="card-actions mt-2">
            <button
              onClick={() => onReturn(book._id)}
              className="btn btn-sm btn-primary"
            >
              <Undo2 size={16} /> Mark as Returned
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
