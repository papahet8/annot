# Collaborative Document Annotation System  

A full-stack **MERN application** that allows multiple users to upload, view, and collaboratively annotate text or PDF documents with real-time sync and performance-optimized rendering.

## Features

- **Document Upload & Storage** – Upload `.txt` or `.pdf` files via drag-and-drop or browse.  
- **Annotation System** – Select any text range, add comments, and view them instantly.  
- **Annotation Modal UI** – Clean modal input instead of prompt boxes for better UX.  
- **Real-Time Collaboration** – New annotations broadcast instantly via **Socket.IO**.  
- **All Documents Page** – Paginated, searchable, and sortable document list with delete confirmation modal.  
- **Text Highlight Rendering** – Efficient merging of overlapping and nested highlights.  
- **Performance-Oriented** – Handles large documents and 1000+ annotations without UI lag.  
- **Clean Architecture** – Modular backend + reusable React components.



## Architecture Overview

**Tech Stack:**  
- **Frontend:** React (Vite) + Axios + Socket.IO Client  
- **Backend:** Node.js + Express + MongoDB (Mongoose) + Socket.IO  
- **Storage:** Local filesystem (`/uploads`)  
- **PDF Parsing:** `pdf-parse` 



## Backend Design

### **Document Schema**

{
  filename: String,
  mimeType: String,
  size: Number,
  textContent: String, 
  createdAt: Date
}
Text from PDFs or .txt files is extracted and stored for fast retrieval.

Files are stored locally in /uploads for simplicity.

Indexed by createdAt for efficient pagination & sorting.

Annotation Schema
{
  documentId: ObjectId,
  userId: ObjectId, 
  startOffset: Number,
  endOffset: Number,
  exactText: String,
  comment: String,
  createdAt: Date
}
startOffset and endOffset precisely mark the text range.

Duplicate prevention: same user + same range is not re-created.

Merged overlapping annotations on render for stable highlighting.

 Performance Optimizations
Frontend
Highlight merging: combines overlapping or adjacent annotations into one render node to prevent flickering or double highlights.

React memoization: minimal re-rendering during new annotation addition.

Pagination API: retrieves only limited documents per page with search and sort.

Backend
Efficient MongoDB queries with .skip() and .limit() for pagination.

Index-friendly fields (createdAt, filename, _id) used in queries.

Selective storage: Only extracted text is stored, not the full binary.

Socket.IO rooms: Only broadcast to users viewing the same document.

Common response used throughout the project 

Global error handler middleware used

** Edge Case Handling
Duplicate annotation by same user-	Prevented in controller logic
Overlapping annotations-	Merged on render, preserving all comments
Invalid text range-	Validation checks ensure range exists in document
Large document upload-	Parsed asynchronously, frontend renders progressively
Deleting a document-	Deletes its file, DB entry, and all related annotations
Empty selection-	Ignored gracefully (no modal triggered)
Disconnected socket clients	-Reconnects without data loss

**Pagination API Example
Endpoint: GET /api/documents

Query Params:

page (default: 1)

limit (default: 5)

search (Debouncing added for API not to hit on every key press)

sortField (default: createdAt)

sortOrder (asc/desc)


** Installation & Setup
Backend

cd backend
npm install
npm run dev
MongoDB should be running locally (mongodb://127.0.0.1:27017/annotations) // important

Server runs on http://localhost:4000

Frontend

cd frontend
npm install
npm run dev
App runs on http://localhost:5173