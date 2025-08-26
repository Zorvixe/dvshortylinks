import React from "react";

export default function FooterSmall({ absolute }) {
  return (
    <footer
      className={`${absolute ? "absolute w-full bottom-0 bg-blueGray-800" : "relative"} pb-6`}
    >
      <div className="container mx-auto px-4">
        <hr className="mb-6 border-b border-blueGray-600" />
        <div className="flex flex-wrap items-center justify-center">
          <div className="w-full text-center">
            <p className="text-sm text-blueGray-500 font-semibold py-1">
              © {new Date().getFullYear()}{" "}
              <a
                href="https://www.Dvshortenlinks.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blueGray-300"
              >
                DVShortyLinks
              </a>{" "}
              | Designed by{" "}
              <a
                href="https://www.zorvixetechnologies.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blueGray-300"
              >
                Zorvixe Technologies
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
