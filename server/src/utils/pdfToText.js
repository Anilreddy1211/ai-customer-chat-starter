const fs = require('fs');
const pdf = require('pdf-parse');
module.exports = async function(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);
  return data.text;
}
