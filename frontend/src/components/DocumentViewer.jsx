import React, { useEffect, useRef, useState } from "react";
import api from "../api/axiosInstance";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import AnnotationModal from "../components/AnnotationModal";

// tell pdf.js where its worker lives
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function DocumentViewer({ documentData, annotations, setAnnotations }) {
  const pdfContainer = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  // render the PDF pages
  const renderPDF = async (doc) => {
    try {
      const url = `http://localhost:4000/uploads/${doc.filename}`;
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;

      const container = pdfContainer.current;
      container.innerHTML = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        container.appendChild(canvas);
        await page.render({ canvasContext: context, viewport }).promise;
      }
    } catch (err) {
      console.error("PDF render error:", err);
    }
  };

  useEffect(() => {
    if (documentData.mimeType === "application/pdf") renderPDF(documentData);
  }, [documentData]);

  // ✅ helper to merge overlapping highlights
  const renderWithHighlights = (text, anns) => {
    if (!anns || anns.length === 0) return text;

    const sorted = [...anns].sort((a, b) => a.startOffset - b.startOffset);
    const merged = [];

    for (const ann of sorted) {
      if (
        merged.length > 0 &&
        ann.startOffset <= merged[merged.length - 1].endOffset
      ) {
        merged[merged.length - 1].endOffset = Math.max(
          merged[merged.length - 1].endOffset,
          ann.endOffset
        );
        merged[merged.length - 1].comment += ` | ${ann.comment}`;
      } else {
        merged.push({ ...ann });
      }
    }

    const parts = [];
    let lastIndex = 0;

    merged.forEach((ann, i) => {
      if (ann.startOffset > lastIndex) {
        parts.push(text.slice(lastIndex, ann.startOffset));
      }

      parts.push(
        <span
          key={ann._id || i}
          title={ann.comment}
          style={{
            backgroundColor: "rgba(255, 230, 120, 0.6)",
            borderRadius: "3px",
            padding: "0 2px",
          }}
        >
          {text.slice(ann.startOffset, ann.endOffset)}
        </span>
      );

      lastIndex = ann.endOffset;
    });

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  // ✅ handle text selection (open modal)
  const handleSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const text = selection.toString().trim();
    if (!text) return;

    setSelectedText(text);
    setShowModal(true);
  };

  // ✅ handle adding annotation from modal
  const handleAddAnnotation = async (comment) => {
    const fullText = documentData.textContent;
    const startOffset = fullText.indexOf(selectedText);
    const endOffset = startOffset + selectedText.length;

    if (startOffset === -1) {
      alert("Selection could not be matched to the document text.");
      setShowModal(false);
      return;
    }

    try {
      const { data } = await api.post("/annotations", {
        documentId: documentData._id,
        startOffset,
        endOffset,
        comment,
      });

      setAnnotations((prev) => {
        const exists = prev.some((a) => a._id === data.annotation._id);
        return exists ? prev : [...prev, data.annotation];
      });
    } catch (err) {
      alert(err.response?.data?.error || "Annotation failed");
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div>
      {documentData.mimeType === "application/pdf" ? (
        <div ref={pdfContainer}></div>
      ) : (
        <div
          onMouseUp={handleSelection}
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: "1.6",
            cursor: "text",
            background: "#fefefe",
            padding: "20px",
            borderRadius: "6px",
            color: "#000",
          }}
        >
          {renderWithHighlights(documentData.textContent, annotations)}
        </div>
      )}

      {/* ✅ Modal for adding annotation */}
      <AnnotationModal
        show={showModal}
        selectedText={selectedText}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddAnnotation}
      />
    </div>
  );
}
