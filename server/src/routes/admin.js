const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfToText = require('../utils/pdfToText');
const CompanyData = require('../models/CompanyData');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'file required' });

    let text = '';
    if (file.mimetype === 'application/pdf') {
      text = await pdfToText(file.path);
    } else {
      const fs = require('fs');
      text = fs.readFileSync(file.path, 'utf8');
    }

    const doc = new CompanyData({ title: file.originalname, content: text.substring(0, 20000) });
    await doc.save();
    res.json({ ok: true, id: doc._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'upload failed' });
  }
});

router.get('/list', async (req, res) => {
  const docs = await CompanyData.find().sort({ uploadedAt: -1 }).limit(50);
  res.json(docs);
});

module.exports = router;
