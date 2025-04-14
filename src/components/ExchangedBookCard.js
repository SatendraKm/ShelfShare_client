import { Repeat } from "lucide-react";
import Link from "next/link";

export default function ExchangedBookCard({ book }) {
  return (
    <div className="card bg-base-100 border-base-300 border shadow-sm transition hover:shadow-md">
      <Link href={`book/${book._id}`}>
        <div className="card-body space-y-2">
          <h2 className="card-title text-base-content">{book.title}</h2>
          <p className="text-neutral text-sm">by {book.author}</p>
          <p className="text-neutral-content text-sm">
            Genre: {book.genres.join(", ")}
          </p>
          <div className="text-neutral-content text-sm">
            Exchanged with:{" "}
            <span className="text-base-content font-medium">
              {book.ownerId?.fullName}
            </span>
          </div>
          <div className="text-muted mt-2 flex items-center gap-1 text-xs">
            <Repeat size={14} /> Completed Exchange
          </div>
        </div>
      </Link>
    </div>
  );
}
