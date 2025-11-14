import React, { useState } from "react";
import api from "../api/axiosInstance.js";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus(`Selected: ${selectedFile.name}`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setStatus(`Selected: ${droppedFile.name}`);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus("⚠️ Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setStatus("Uploading...");

    try {
      const { data } = await api.post("/documents", formData);
      setStatus("✅ Upload successful! Redirecting...");
      setTimeout(() => navigate(`/document/${data.documentId}`), 500);
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus(`❌ ${err.response?.data?.error || "Upload failed"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 60px)",
        background: "#111",
        color: "#fff",
        padding: "40px 20px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Upload Document
      </h2>

      {/* Drag & Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: "2px dashed gray",
          padding: "80px 20px",
          textAlign: "center",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          background: "#111",
          color: "#ccc",
          transition: "0.2s",
        }}
      >
        <p style={{ marginBottom: "10px", fontSize: "1.1rem" }}>
          Drag & Drop your file here
        </p>
        <p style={{ margin: "10px 0" }}>or</p>

        <label
          style={{
            display: "inline-block",
            background: "#333",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          {file ? "Change File" : "Browse File"}
          <input
            type="file"
            accept=".txt,.pdf"
            onChange={handleFileInput}
            style={{ display: "none" }}
          />
        </label>

        {status && (
          <p
            style={{
              marginTop: "15px",
              fontSize: "0.9rem",
              color:
                status.startsWith("✅")
                  ? "#00ff99"
                  : status.startsWith("⚠️") || status.startsWith("❌")
                  ? "#ff6666"
                  : "#999",
            }}
          >
            {status}
          </p>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          marginTop: "30px",
          background: loading ? "#444" : "#007bff",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {loading ? "Uploading..." : "Upload Document"}
      </button>
    </div>
  );
}
