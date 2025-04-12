import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function RequestCard({ data, isOwner, refresh }) {
  const { user } = useAuth();

  const { _id, book, status, type, requester, owner } = data;

  const otherUser = isOwner ? requester : owner;

  const handleAction = async (action) => {
    try {
      let url = "";
      if (action === "accept") url = `/request/${_id}/accept`;
      else if (action === "reject") url = `/request/${_id}/reject`;
      else if (action === "cancel") url = `/request/${_id}/cancel`;

      await api.patch(url);
      toast.success(`Request ${action}`);
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-2 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{book?.title}</h3>
          <p className="text-sm text-gray-600">by {book?.author}</p>
          <p className="mt-1 text-sm">
            Type: <span className="capitalize">{type}</span>
          </p>
          <p className="text-sm">With: {otherUser?.name}</p>
          <p
            className={`text-sm font-medium ${
              status === "accepted"
                ? "text-green-600"
                : status === "rejected"
                  ? "text-red-500"
                  : "text-yellow-500"
            }`}
          >
            Status: {status}
          </p>
        </div>
      </div>

      {/* Buttons */}
      {status === "pending" && (
        <div className="mt-2 flex gap-2">
          {isOwner ? (
            <>
              <button
                onClick={() => handleAction("accept")}
                className="btn btn-success btn-sm"
              >
                Accept
              </button>
              <button
                onClick={() => handleAction("reject")}
                className="btn btn-error btn-sm"
              >
                Reject
              </button>
            </>
          ) : (
            <button
              onClick={() => handleAction("cancel")}
              className="btn btn-warning btn-sm"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}
