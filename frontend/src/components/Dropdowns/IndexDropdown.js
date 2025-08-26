import React from "react";
import { Link } from "react-router-dom";

const IndexDropdown = () => {
  
  return (
    <>
      <Link
        className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
       to="/admin/dashboard"
      >
        Dashboard
      </Link>
    </>
  );
};

export default IndexDropdown;
