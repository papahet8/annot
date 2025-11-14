const Annotation = require("../models/Annotation");
const Document = require("../models/Document");
const { io } = require("../server");
const mongoose = require("mongoose");

const addAnnotation = async (req, res) => {
  try {
    const { documentId, startOffset, endOffset, comment } = req.body;

    // ✅ Validate document ID
    const doc = await Document.findById(documentId);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    // ✅ Extract the exact selected text from document content
    const textContent = doc.textContent || "";
    const exactText = textContent.slice(startOffset, endOffset).trim();

    if (!exactText) {
      return res.status(400).json({ error: "Selected text is empty or invalid" });
    }

    // ✅ Always assign a valid dummy ObjectId for now
    const fakeUserId = new mongoose.Types.ObjectId("000000000000000000000000");

    // ✅ Create and save annotation
    const annotation = new Annotation({
      documentId,
      userId: fakeUserId,
      startOffset,
      endOffset,
      exactText,
      comment,
    });

    await annotation.save();

    // ✅ Broadcast via Socket.IO for real-time updates
    const { io } = require("../server");
    io.to(`doc:${documentId}`).emit("annotation:created", annotation);

    res.status(201).json({ success: true, annotation });
  } catch (err) {
  next(err);
}
};


const getAnnotations = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const annotations = await Annotation.find({ documentId }).sort({
      startOffset: 1,
    });
    res.json({ success: true, annotations });
  } catch (err) {
    next(err);
  }
};

module.exports = { addAnnotation, getAnnotations };
