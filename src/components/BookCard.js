"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const BookCard = ({ book }) => {
  // Fallback image in case there is no imageUrl.
  const imageUrl = book.imageUrl || "/default-book.jpg";
  const statusColor =
    {
      available: "badge-success",
      borrowed: "badge-warning",
      reserved: "badge-accent",
    }[book.status] || "badge-outline";

  return (
    <div className="card bg-base-100 shadow-md transition hover:shadow-lg">
      <figure className="relative h-48">
        <Image
          src={imageUrl}
          alt={`Cover of ${book.title}`}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="rounded-t object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{book.title}</h2>
        <p className="line-clamp-3 text-sm">
          {book.description?.trim() || "No description provided."}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className={`badge ${statusColor}`}>{book.status}</span>
          <Link
            href={`/book/${book._id}`}
            className="btn btn-primary btn-xs"
            aria-label={`View details for ${book.title}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
