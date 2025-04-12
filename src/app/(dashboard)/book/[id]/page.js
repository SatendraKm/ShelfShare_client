import BookDetailPage from "./BookDetailPage";

export default async function BookDetail({ params }) {
  const { id } = await params;

  return <BookDetailPage bookId={id} />;
}
