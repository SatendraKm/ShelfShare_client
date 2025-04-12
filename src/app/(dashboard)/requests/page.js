"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import RequestCard from "@/components/RequestCard";

export default function RequestsPage() {
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
      setSent(sentRes.data.data);
      setReceived(receivedRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTabChange = (tab) => setTab(tab);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold">Your Requests</h2>
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

      <div className="space-y-4">
        {(tab === "received" ? received : sent).map((request) => (
          <RequestCard
            key={request._id}
            data={request}
            isOwner={tab === "received"}
            refresh={fetchRequests}
          />
        ))}
      </div>
    </div>
  );
}
