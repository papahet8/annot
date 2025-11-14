import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import api from "../api/axiosInstance";
import DocumentViewer from "../components/DocumentViewer";
import Sidebar from "../components/Sidebar";

const socket = io("http://localhost:4000");

export default function DocumentPage() {
  const { id } = useParams();
  const [documentData, setDocumentData] = useState(null);
  const [annotations, setAnnotations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRes = await api.get(`/documents/${id}`);
        setDocumentData(docRes.data);

        const annRes = await api.get(`/annotations/${id}`);
        setAnnotations(annRes.data.annotations);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();

    socket.emit("joinDoc", id);
    // socket.on("annotation:created", (newAnn) => {
    //   setAnnotations((prev) => [...prev, newAnn]);
    // });
    socket.on("annotation:created", (newAnn) => {
  setAnnotations((prev) => {
    const exists = prev.some((a) => a._id === newAnn._id);
    if (exists) return prev;
    return [...prev, newAnn];
  });
});


    return () => {
      socket.emit("leaveDoc", id);
      socket.off("annotation:created");
    };
  }, [id]);

  if (!documentData) return <h3 style={{ padding: 40 }}>Loading document...</h3>;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 3, overflowY: "auto", padding: "20px" }}>
        <DocumentViewer
          documentData={documentData}
          annotations={annotations}
          setAnnotations={setAnnotations}
        />
      </div>
      <Sidebar annotations={annotations} />
    </div>
  );
}
