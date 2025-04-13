import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function RequestCard({ data, isOwner, refresh }) {
  const { user } = useAuth();
  const [loadingAction, setLoadingAction] = useState(null);
  const [visible, setVisible] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);

  const { _id, bookId, status, type, requesterId, ownerId } = data;
  console.log(bookId, "bookId in request card");

  const otherUser = isOwner ? requesterId : ownerId;

  const handleAction = async (action) => {
    try {
      setLoadingAction(action);

      const urlMap = {
        accept: `/request/${_id}/accept`,
        reject: `/request/${_id}/reject`,
        cancel: `/request/${_id}/cancel`,
      };

      const res = await api.put(urlMap[action]);
      console.log(res.data, "response after action");
      toast.success(`Request ${action}ed successfully`);
      setVisible(false);

      setTimeout(() => {
        refresh();
      }, 300);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoadingAction(null);
      setConfirmAction(null);
    }
  };

  const openConfirm = (action) => {
    setConfirmAction(action);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="space-y-2 rounded-lg border bg-white p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-4">
            <Image
              width={16}
              height={24}
              src={bookId.imageUrl}
              alt={bookId.title}
              className="h-24 w-16 rounded border object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{bookId.title}</h3>
              <p className="text-sm text-gray-600">by {bookId.author}</p>
              <p className="mt-1 text-sm">
                Type: <span className="capitalize">{type}</span>
              </p>
              <p className="text-sm">With: {otherUser?.fullName}</p>
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

          {status === "pending" && (
            <div className="mt-2 flex gap-2">
              {isOwner ? (
                <>
                  <button
                    onClick={() => handleAction("accept")}
                    className="btn btn-success btn-sm"
                    disabled={loadingAction !== null}
                  >
                    {loadingAction === "accept" ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      "Accept"
                    )}
                  </button>
                  <button
                    onClick={() => openConfirm("reject")}
                    className="btn btn-error btn-sm"
                    disabled={loadingAction !== null}
                  >
                    Reject
                  </button>
                </>
              ) : (
                <button
                  onClick={() => openConfirm("cancel")}
                  className="btn btn-warning btn-sm"
                  disabled={loadingAction !== null}
                >
                  Cancel
                </button>
              )}
            </div>
          )}

          {confirmAction && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="text-lg font-bold">
                  Confirm{" "}
                  {confirmAction.charAt(0).toUpperCase() +
                    confirmAction.slice(1)}
                </h3>
                <p className="py-2">
                  Are you sure you want to {confirmAction} this request for{" "}
                  <span className="font-semibold">{bookId.title}</span>?
                </p>
                <div className="modal-action">
                  <button
                    onClick={() => handleAction(confirmAction)}
                    className={`btn btn-sm ${
                      confirmAction === "cancel" || confirmAction === "reject"
                        ? "btn-error"
                        : "btn-success"
                    }`}
                  >
                    {loadingAction === confirmAction ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      "Yes"
                    )}
                  </button>
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="btn btn-sm"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
