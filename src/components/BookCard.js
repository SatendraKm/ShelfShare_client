"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const BookCard = ({ book }) => {
  // Fallback image in case there is no imageUrl.
  const imageUrl = book.imageUrl || "/default-book.jpg";

  return (
    <div className="card bg-base-100 shadow-md transition hover:shadow-lg">
      <figure className="relative h-48">
        <Image
          src={imageUrl}
          alt={book.title}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="rounded-t object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{book.title}</h2>
        <p className="line-clamp-3 text-sm">{book.description.trim()}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="badge badge-outline">{book.status}</span>
          <Link href={`/book/${book._id}`} className="btn btn-primary btn-xs">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
