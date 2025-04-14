import { Repeat } from "lucide-react";
import Link from "next/link";

export default function ExchangedBookCard({ book }) {
  return (
    <div className="card bg-base-100 border shadow-sm transition hover:shadow-md">
      <Link href={`book/${book._id}`}>
        <div className="card-body space-y-2">
          <h2 className="card-title">{book.title}</h2>
          <p className="text-sm text-gray-600">by {book.author}</p>
          <p className="text-sm text-gray-500">Genre: {book.genre}</p>
          <div className="text-sm text-gray-500">
            Exchanged with:{" "}
            <span className="font-medium">{book.ownerId?.fullName}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
            <Repeat size={14} /> Completed Exchange
          </div>
        </div>
      </Link>
    </div>
  );
}
