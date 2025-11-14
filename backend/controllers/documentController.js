const fs = require("fs");
const path = require("path");
const Document = require("../models/Document");
const Annotation = require("../models/Annotation");
const { saveFileLocally } = require("../utils/fileStorage");
const { extractTextFromPDF } = require("../utils/pdfExtractor");
const { io } = require("../server");

const uploadDocument = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "File required" });

    const savedPath = saveFileLocally(file.buffer, file.originalname);

    let textContent = "";
    if (file.mimetype === "application/pdf") {
      textContent = await extractTextFromPDF(file.buffer);
    } else {
      textContent = file.buffer.toString("utf-8");
    }

    const doc = await Document.create({
      title: req.body.title || file.originalname,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      textContent,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      documentId: doc._id,
      filePath: savedPath,
    });
  } catch (err) {
  next(err);
}
};

const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json({
      _id: doc._id,
      title: doc.title,
      textContent: doc.textContent,
      filename: doc.filename,
      mimeType: doc.mimeType,
      size: doc.size,
      createdAt: doc.createdAt,
    });
  } catch (err) {
  next(err);
}
};

const getPaginatedDocuments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortField = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = search
      ? { filename: { $regex: search, $options: "i" } }
      : {};

    const total = await Document.countDocuments(query);
    const documents = await Document.find(query)
      .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("filename originalName mimeType size createdAt");

    res.json({
      documents,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
  next(err);
}
};

const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    const filePath = path.join(__dirname, "..", "uploads", doc.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Annotation.deleteMany({ documentId: id });

    await Document.findByIdAndDelete(id);

    res.json({ success: true, message: "Document and annotations deleted successfully" });
  } catch (err) {
  next(err);
}
};

module.exports = { uploadDocument, getDocumentById, getPaginatedDocuments, deleteDocument };
