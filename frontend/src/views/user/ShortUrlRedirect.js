// ShortUrlRedirect.js
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ShortUrlRedirect() {
  const { shortCode } = useParams();
  const { API_BASE_URL } = useAuth();
  useEffect(() => {
    if (shortCode) {
      window.location.replace(`${API_BASE_URL}/${shortCode}`);
    }
  }, [shortCode]);
  return null;
}
