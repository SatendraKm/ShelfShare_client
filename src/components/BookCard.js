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
    <div className="card card-compact transform cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
      <Link href={`/book/${book._id}`} className="block">
        <figure className="relative h-72 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={`Cover of ${book.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="transform rounded-t-lg object-contain transition-transform duration-300 ease-in-out hover:scale-110"
          />
        </figure>
        <div className="card-body space-y-3 p-5">
          {/* Title + Status badge in a flex row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="card-title text-2xl font-semibold">{book.title}</h2>
            <span className={`badge ${statusColor} text-sm capitalize`}>
              {book.status}
            </span>
          </div>

          {/* Author */}
          <span className="text-sm italic underline">by {book.author}</span>
          <p>{book.location}</p>
          {/* Description */}
          <p className="line-clamp-3 text-sm">
            {book.description?.trim() || "No description available."}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
