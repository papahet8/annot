const pdfParse = require("pdf-parse");

const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF parse error:", error);
    throw error;
  }
};

module.exports = { extractTextFromPDF };
