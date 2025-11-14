const mongoose = require("mongoose");

const AnnotationSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startOffset: { type: Number, required: true },
  endOffset: { type: Number, required: true },
  exactText: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

AnnotationSchema.index(
  { documentId: 1, userId: 1, startOffset: 1, endOffset: 1 },
  { unique: true }
);

module.exports = mongoose.model("Annotation", AnnotationSchema);
