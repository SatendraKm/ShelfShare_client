"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import RequestCard from "@/components/RequestCard";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react"; // Optional: loading icon

export default function RequestsPage() {
  const { user } = useAuth();
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [tab, setTab] = useState("received");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [sentRes, receivedRes] = await Promise.all([
        api.get("/request/sent"),
        api.get("/request/received"),
      ]);
      const pendingSent = sentRes.data.data.filter(
        (req) => req.status === "pending",
      );
      const pendingReceived = receivedRes.data.data.filter(
        (req) => req.status === "pending",
      );

      setSent(pendingSent);
      setReceived(pendingReceived);

      if (pendingReceived.length === 0) {
        setTab("sent");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newTab) => setTab(newTab);
  const hasReceived = received.length > 0;
  const filteredRequests = tab === "received" ? received : sent;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h2 className="text-primary mb-6 text-center text-2xl font-bold">
        Your Pending Book Requests
      </h2>

      {hasReceived && (
        <div className="mb-6 flex justify-center">
          <div className="tabs tabs-boxed bg-base-200">
            <button
              className={`tab ${tab === "received" ? "tab-active" : ""}`}
              onClick={() => handleTabChange("received")}
            >
              Received
            </button>
            <button
              className={`tab ${tab === "sent" ? "tab-active" : ""}`}
              onClick={() => handleTabChange("sent")}
            >
              Sent
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* Requests Grid */}
          {filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request._id}
                  data={request}
                  isOwner={hasReceived && tab === "received"}
                  refresh={fetchRequests}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 text-center text-gray-500">
              <div className="text-lg font-medium">No pending requests</div>
              <p className="text-sm">
                Check back later or try sending a new one!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
