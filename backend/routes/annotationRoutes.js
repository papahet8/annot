const express = require("express");
const { addAnnotation, getAnnotations } = require("../controllers/annotationController");

const router = express.Router();

router.get("/:documentId", getAnnotations);
router.post("/", addAnnotation);

module.exports = router;
