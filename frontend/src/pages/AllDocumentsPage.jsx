import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

export default function AllDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
const [selectedDoc, setSelectedDoc] = useState(null);
const [debouncedSearch, setDebouncedSearch] = useState(""); 

  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to first page after search
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchDocuments();
  }, [page, limit, sortField, sortOrder, debouncedSearch]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search: debouncedSearch,
        sortField,
        sortOrder,
      };



      const { data } = await api.get("/documents", { params });
      setDocuments(data.documents);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageSizeChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

const handleDelete = async () => {
  if (!selectedDoc) return;
  try {
    await api.delete(`/documents/${selectedDoc._id}`);
    setShowModal(false);
    setSelectedDoc(null);
    fetchDocuments(); // refresh list
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

  return (
    <div
      style={{
        background: "#111",
        color: "#fff",
        minHeight: "calc(100vh - 60px)",
        padding: "80px",
      }}
    >
      <h2 style={{ marginBottom: 20 }}>All Documents</h2>

      {/* 🔍 Search + Filters */}
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 15,
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={handleSearch}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
            width: "250px",
          }}
        />

        

        {/* Page size selector */}
        <select
          value={limit}
          onChange={handlePageSizeChange}
          style={selectStyle}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size} 
            </option>
          ))}
        </select>
      </div>

      {/* 📄 Table */}
      {loading ? (
        <p>Loading...</p>
      ) : documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#1a1a1a",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "#222" }}>
              {[
                { label: "Name", field: "filename" },
                { label: "Type", field: "mimeType" },
                { label: "Size", field: "size" },
                { label: "Uploaded", field: "createdAt" },
              ].map((col) => (
                <th
                  key={col.field}
                  onClick={() => handleSort(col.field)}
                  style={{
                    cursor: "pointer",
                    padding: "12px 16px",
                    textAlign: "left",
                    color: sortField === col.field ? "#00aaff" : "#ccc",
                  }}
                >
                  {col.label}
                  {sortField === col.field &&
                    (sortOrder === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
              <th style={{ padding: "12px 16px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id} style={{ borderBottom: "1px solid #333" }}>
  <td style={tdStyle}>{doc.filename}</td>
  <td style={tdStyle}>
    {doc.mimeType === "application/pdf" ? "PDF" : "Text"}
  </td>
  <td style={tdStyle}>{(doc.size / 1024).toFixed(1)} KB</td>
  <td style={tdStyle}>
    {new Date(doc.createdAt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    })}
  </td>
  <td style={tdStyle}>
    <button
      onClick={() => navigate(`/document/${doc._id}`)}
      style={viewButton}
    >
      View
    </button>
    <button
  onClick={() => {
    setSelectedDoc(doc);
    setShowModal(true);
  }}
  style={deleteButton}
>
  Delete
</button>
  </td>
</tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 📄 Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            marginTop: 25,
          }}
        >
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            style={navButton}
          >
            « First
          </button>
          <button
            onClick={() => setPage(page - 1)}
            disabled={!pagination.hasPrev}
            style={navButton}
          >
            ‹ Prev
          </button>
          <span style={{ color: "#ccc" }}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!pagination.hasNext}
            style={navButton}
          >
            Next ›
          </button>
          <button
            onClick={() => setPage(pagination.totalPages)}
            disabled={page === pagination.totalPages}
            style={navButton}
          >
            Last »
          </button>
        </div>
      )}
      <ConfirmModal
  show={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={handleDelete}
  message={`Are you sure you want to delete "${selectedDoc?.filename}"?`}
/>
    </div>
  );
}

// Styles
const tdStyle = {
  padding: "12px 16px",
  color: "#ccc",
};

const selectStyle = {
  padding: "8px 10px",
  background: "#222",
  border: "1px solid #444",
  color: "#fff",
  borderRadius: "6px",
  cursor: "pointer",
};

const viewButton = {
  background: "#00aaff",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "0.2s",
};

const navButton = {
  background: "#222",
  color: "#fff",
  border: "1px solid #444",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer",
};

const deleteButton = {
  background: "#ff4d4d",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  marginLeft: "8px",
  transition: "0.2s",
};