const Annotation = require("../models/Annotation");
const Document = require("../models/Document");
const { io } = require("../server");
const mongoose = require("mongoose");

const addAnnotation = async (req, res) => {
  try {
    const { documentId, startOffset, endOffset, comment } = req.body;

    const doc = await Document.findById(documentId);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    const textContent = doc.textContent || "";
    const exactText = textContent.slice(startOffset, endOffset).trim();

    if (!exactText) {
      return res.status(400).json({ error: "Selected text is empty or invalid" });
    }

    const fakeUserId = new mongoose.Types.ObjectId("000000000000000000000000");

    const annotation = new Annotation({
      documentId,
      userId: fakeUserId,
      startOffset,
      endOffset,
      exactText,
      comment,
    });

    await annotation.save();

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
