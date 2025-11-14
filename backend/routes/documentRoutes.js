const express = require("express");
const multer = require("multer");
const { uploadDocument, getDocumentById ,getPaginatedDocuments, deleteDocument } = require("../controllers/documentController");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), uploadDocument);
router.get("/:id", getDocumentById);
router.get("/", getPaginatedDocuments);
router.delete("/:id", deleteDocument);

module.exports = router;
