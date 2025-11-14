import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import UploadPage from "./pages/UploadPage.jsx";
import DocumentPage from "./pages/DocumentPage.jsx";
import AllDocumentsPage from "./pages/AllDocumentsPage.jsx";

function Navbar() {
  const location = useLocation();

  return (
    <nav
      style={{
        background: "#111",
        color: "#fff",
        padding: "15px 30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #222",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* App name / logo */}
      <Link
        to="/"
        style={{
          color: "#fff",
          textDecoration: "none",
          fontSize: "1.3rem",
          fontWeight: "600",
          letterSpacing: "0.5px",
        }}
      >
        📝 DocAnnotator
      </Link>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link
          to="/"
          style={{
            color: location.pathname === "/" ? "#00aaff" : "#ccc",
            textDecoration: "none",
            fontWeight: "500",
            transition: "0.2s",
          }}
        >
          Upload
        </Link>

        <Link
          to="/documents"
          style={{
            color: location.pathname.startsWith("/documents") ? "#00aaff" : "#ccc",
            textDecoration: "none",
            fontWeight: "500",
            transition: "0.2s",
          }}
        >
          All Documents
        </Link>

        {location.pathname.startsWith("/document/") && (
          <span style={{ color: "#777", fontWeight: "500" }}>Document Page</span>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/document/:id" element={<DocumentPage />} />
        <Route path="/documents" element={<AllDocumentsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
