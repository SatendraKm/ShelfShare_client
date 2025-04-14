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
  const otherUser = isOwner ? requesterId : ownerId;

  const handleAction = async (action) => {
    try {
      setLoadingAction(action);
      const urlMap = {
        accept: `/request/${_id}/accept`,
        reject: `/request/${_id}/reject`,
        cancel: `/request/${_id}/cancel`,
      };
      await api.put(urlMap[action]);
      toast.success(`Request ${action}ed successfully`);
      setVisible(false);
      setTimeout(() => refresh(), 300);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoadingAction(null);
      setConfirmAction(null);
    }
  };

  const openConfirm = (action) => setConfirmAction(action);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="card bg-base-100 w-full border p-4 shadow-md"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <Image
              width={80}
              height={120}
              src={bookId.imageUrl}
              alt={bookId.title}
              className="mx-auto h-36 w-24 rounded-md border object-cover sm:mx-0"
            />
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-start justify-between">
                <h3 className="text-lg font-bold">{bookId.title}</h3>
                <span
                  className={`badge ${
                    status === "accepted"
                      ? "badge-success"
                      : status === "rejected"
                        ? "badge-error"
                        : "badge-warning"
                  } text-xs`}
                >
                  {status}
                </span>
              </div>
              <p className="text-sm text-gray-600 italic">by {bookId.author}</p>
              <p className="text-sm">
                Type: <span className="capitalize">{type}</span>
              </p>
              <p className="text-sm">
                With: <span className="font-medium">{otherUser?.fullName}</span>
              </p>

              {status === "pending" && (
                <div className="mt-3 flex flex-wrap gap-2">
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
                      className="btn btn-error btn-sm"
                      disabled={loadingAction !== null}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Confirm Modal */}
          {confirmAction && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="text-lg font-bold capitalize">
                  {confirmAction} this request?
                </h3>
                <p className="py-2">
                  Are you sure you want to{" "}
                  <span className="font-semibold">{confirmAction}</span> the
                  request for{" "}
                  <span className="font-medium">{bookId.title}</span>?
                </p>
                <div className="modal-action">
                  <button
                    onClick={() => handleAction(confirmAction)}
                    className={`btn btn-sm ${
                      ["cancel", "reject"].includes(confirmAction)
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
