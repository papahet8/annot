import React from "react";

export default function ConfirmModal({ show, onClose, onConfirm, message }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#1c1c1c",
          padding: "30px 40px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          textAlign: "center",
          color: "#fff",
          minWidth: "320px",
          animation: "fadeIn 0.2s ease-in",
        }}
      >
        <h3 style={{ marginBottom: "20px", fontWeight: 500 }}>{message}</h3>
        <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
          <button
            onClick={onConfirm}
            style={{
              background: "#ff4d4d",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Delete
          </button>
          <button
            onClick={onClose}
            style={{
              background: "#333",
              color: "#fff",
              border: "1px solid #555",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
