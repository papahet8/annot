import React, { useState } from "react";

export default function AnnotationModal({ show, onClose, onSubmit, selectedText }) {
  const [comment, setComment] = useState("");

  if (!show) {
    if (comment !== "") setComment("");
    return null;
  }

  const handleAdd = () => {
    if (comment.trim()) onSubmit(comment.trim());
  };

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
          minWidth: "360px",
        }}
      >
        <h3 style={{ marginBottom: 10 }}>Add Annotation</h3>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#bbb",
            marginBottom: "15px",
            wordBreak: "break-word",
            textAlign: "left",
          }}
        >
          <strong>Selected Text:</strong> “{selectedText.slice(0, 100)}”
          {selectedText.length > 100 && "..."}
        </p>

        <textarea
          placeholder="Enter your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
            resize: "none",
            marginBottom: "15px",
          }}
        />

        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <button
            onClick={handleAdd}
            style={{
              background: "#00aaff",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Add
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
