const fs = require("fs");
const path = require("path");

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const saveFileLocally = (buffer, filename) => {
  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

const deleteFileLocally = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = { saveFileLocally, deleteFileLocally };
