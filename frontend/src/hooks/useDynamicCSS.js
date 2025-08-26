import { useEffect } from "react";

const useDynamicCSS = () => {
  useEffect(() => {
    // Prevent duplicate link injection
    if (document.querySelector("link[href*='bootstrap.min.css']")) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css";
    link.integrity = "sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr";
    link.crossOrigin = "anonymous";
    link.onload = () => {
      console.log("Bootstrap CSS loaded");
    };
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);
};

export default useDynamicCSS;
