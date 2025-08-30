// src/AdSlot.js
"use client";
import { useEffect, useRef } from "react";

/**
 * Minimal, safe AdSense slot
 * - Loads pagead script ONCE (tagged with data-adsbygoogle)
 * - Pushes a new ad request on mount
 * - Use ONLY where you want an ad (do NOT put in a layout)
 */
export default function AdSlot({
  client,            // e.g. "ca-pub-4814003097452326"
  slot,              // e.g. "4807389297"
  format = "auto",
  fullWidth = true,
  style = {},
  test = false,
}) {
  const ref = useRef(null);

  useEffect(() => {
    // Ensure loader script exists
    if (!document.querySelector('script[data-adsbygoogle]')) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      s.crossOrigin = "anonymous";
      s.setAttribute("data-adsbygoogle", "1");
      document.head.appendChild(s);
      s.onload = () => {
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
      };
    } else {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
    }
  }, [client, slot]);

  const baseStyle = {
    display: "block",
    minHeight: 250,
    width: "100%",
    ...style,           // <-- FIXED
  };

  return (
    <ins
      ref={ref}
      className="adsbygoogle"
      style={baseStyle}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidth ? "true" : "false"}
      {...(test ? { "data-adtest": "on" } : {})}
    />
  );
}
