// src/views/AdRedirect.jsx (or wherever this page lives)
"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdSlot from "../../AdSlot"; // or "AdSlot" if you configured an alias

const ADS_CLIENT = process.env.REACT_APP_ADSENSE_CLIENT; // e.g. "ca-pub-4814003097452326"
const ADS_SLOT   = process.env.REACT_APP_ADSENSE_SLOT;   // e.g. "4807389297"
const ADS_TEST   = process.env.REACT_APP_ADSENSE_TEST === "true"; // optional

export default function AdRedirect() {
  const { slug } = useParams();
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate(`/final-redirect/${slug}`);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [slug, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: 48, padding: "0 16px" }}>
      <h2 style={{ marginBottom: 12 }}>Hold on! We’re getting your link ready</h2>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          width: "100%",
          maxWidth: 360,
          margin: "20px auto",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          background: "#fff",
        }}
      >
        {/* Show the ad only on this page */}
        {ADS_CLIENT && ADS_SLOT ? (
          <AdSlot client={ADS_CLIENT} slot={ADS_SLOT} test={ADS_TEST} />
        ) : (
          <p style={{ color: "#6b7280", margin: 0 }}>
            Ad is not configured. Set REACT_APP_ADSENSE_CLIENT and REACT_APP_ADSENSE_SLOT.
          </p>
        )}
      </div>

      <p style={{ fontSize: 20, marginTop: 16 }}>
        Redirecting in <strong>{countdown}</strong> seconds…
      </p>
    </div>
  );
}
