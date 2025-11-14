import React from "react";

export default function Sidebar({ annotations }) {
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div
      style={{
        flex: 1,
        borderLeft: "1px solid #ddd",
        padding: "20px",
        background: "#fafafa",
        overflowY: "auto",
        color: "#000",
      }}
    >
      <h3>Annotations</h3>
      {annotations.length === 0 && <p>No annotations yet</p>}

      {annotations.map((a) => (
        <div
          key={a._id}
          style={{
            background: "#fff",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "10px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <strong>{a.comment}</strong>
          <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
            <em>{a.exactText.slice(0, 60)}...</em>
          </div>
          {a.createdAt && (
            <div
              style={{
                fontSize: 11,
                color: "#777",
                marginTop: 6,
              }}
            >
              🕒 {formatDate(a.createdAt)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
