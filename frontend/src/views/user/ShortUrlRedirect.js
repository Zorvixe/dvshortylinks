// views/user/ShortUrlRedirect.js
"use client";

import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ShortUrlRedirect() {
  const { shortCode } = useParams();

  // API host is for xhr/json; SHORT base is where the interstitial lives
  const SHORT_BASE =
    process.env.REACT_APP_SHORT_BASE_URL ||
    "https://go.dvshortylinks.com"; // sensible default

  useEffect(() => {
    if (shortCode) {
      // Always bounce to the shortlink host that serves the ad interstitial
      window.location.replace(`${SHORT_BASE}/${shortCode}`);
    }
  }, [shortCode, SHORT_BASE]);

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>Loading your link…</h2>
      <p>
        If nothing happens,&nbsp;
        <a href={`${SHORT_BASE}/${shortCode}`}>click here</a>.
      </p>
    </div>
  );
}
