"use client";
import React from "react";
import BookDetailPage from "./BookDetailPage";

export default function BookDetail({ params }) {
  const { id } = React.use(params);

  return <BookDetailPage bookId={id} />;
}
