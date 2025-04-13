"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import RequestCard from "@/components/RequestCard";
import { useAuth } from "@/context/AuthContext";

export default function RequestsPage() {
  const { user } = useAuth();
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [tab, setTab] = useState("received");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const [sentRes, receivedRes] = await Promise.all([
        api.get("/request/sent"),
        api.get("/request/received"),
      ]);
      // Store only pending requests
      console.log(sentRes.data.data, "sent connections");
      console.log(receivedRes.data.data, "received connections");
      setSent(sentRes.data.data.filter((req) => req.status === "pending"));
      setReceived(
        receivedRes.data.data.filter((req) => req.status === "pending"),
      );

      // Auto switch to 'sent' if no received requests (for seekers)
      if (
        receivedRes.data.data.filter((req) => req.status === "pending")
          .length === 0
      ) {
        setTab("sent");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTabChange = (newTab) => setTab(newTab);

  const hasReceived = received.length > 0;

  const filteredRequests = tab === "received" ? received : sent;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold">Pending Requests</h2>

      {/* Show tabs only if user owns books (received requests exist) */}
      {hasReceived && (
        <div className="tabs mb-4">
          <button
            className={`tab tab-bordered ${tab === "received" ? "tab-active" : ""}`}
            onClick={() => handleTabChange("received")}
          >
            Received
          </button>
          <button
            className={`tab tab-bordered ${tab === "sent" ? "tab-active" : ""}`}
            onClick={() => handleTabChange("sent")}
          >
            Sent
          </button>
        </div>
      )}

      {/* Request List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <RequestCard
            key={request._id}
            data={request}
            isOwner={hasReceived && tab === "received"}
            refresh={fetchRequests}
          />
        ))}
      </div>

      {/* No Requests Message */}
      {filteredRequests.length === 0 && (
        <p className="mt-6 text-center text-gray-500">No pending requests.</p>
      )}
    </div>
  );
}
