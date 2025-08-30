"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function ShortenUrlModal({ onClose }) {
  const { token, API_BASE_URL } = useAuth();
  const dialogRef = useRef(null);

  const [formData, setFormData] = useState({
    url: "",
    alias: "",
    title: "",
    description: "",
  });
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 2500);
  };

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showNotification("Please log in to shorten URLs.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setShortenedUrl(data.shortenedUrl || "");
        setFormData({ url: "", alias: "", title: "", description: "" });
        showNotification("URL shortened successfully!", "success");
      } else {
        showNotification(data.error || "Failed to shorten URL", "error");
      }
    } catch (err) {
      showNotification("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      showNotification("Copied!", "success");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      showNotification("Failed to copy", "error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <i className="fas fa-link"></i>
            </span>
            <div>
              <h3 className="text-lg font-semibold">Create Short URL</h3>
              <p className="text-sm text-gray-500">Shorten here right after login — quick access!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
            title="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Notification */}
          {notification.show && (
            <div
              className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
                notification.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <span className="mr-2">
                <i
                  className={`fas ${
                    notification.type === "success" ? "fa-check-circle" : "fa-exclamation-triangle"
                  }`}
                ></i>
              </span>
              {notification.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="mb-1 block text-sm font-medium text-gray-700">
                Long URL *
              </label>
              <input
                id="url"
                name="url"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={formData.url}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="alias" className="mb-1 block text-sm font-medium text-gray-700">
                  Custom Alias (optional)
                </label>
                <input
                  id="alias"
                  name="alias"
                  placeholder="my-custom-alias"
                  value={formData.alias}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <p className="mt-1 text-xs text-gray-500">Leave empty for auto-generated short code.</p>
              </div>
              <div>
                <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                  Title (optional)
                </label>
                <input
                  id="title"
                  name="title"
                  placeholder="Reference title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Brief description of the link"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Shortening…
                </>
              ) : (
                <>
                  <i className="fas fa-compress-alt"></i>
                  Shorten URL
                </>
              )}
            </button>
          </form>

          {/* Result */}
          {shortenedUrl && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-green-700">
                <i className="fas fa-check-circle"></i>
                <h4 className="font-semibold">URL Shortened Successfully!</h4>
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={shortenedUrl}
                  readOnly
                  className="w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="rounded-lg border border-green-300 bg-white px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="mt-2 text-sm text-green-700">
                Share this link and start earning money from every click!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t px-6 py-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
