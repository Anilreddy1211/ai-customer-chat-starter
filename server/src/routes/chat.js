const express = require('express');
const router = express.Router();
const axios = require('axios');
const Conversation = require('../models/Conversation');
const CompanyData = require('../models/CompanyData');

async function findRelevantContext(question) {
  const docs = await CompanyData.find().limit(20);
  const qWords = question.toLowerCase().split(/\W+/).filter(Boolean);
  let best = null; let bestScore = 0;
  for (const d of docs) {
    const text = (d.content || '').toLowerCase();
    let score = 0;
    for (const w of qWords) if (text.includes(w)) score++;
    if (score > bestScore) { bestScore = score; best = d; }
  }
  if (best && bestScore > 0) return best.content;
  return null;
}

router.post('/', async (req, res) => {
  try {
    const { userId = 'guest', message } = req.body;
    if (!message) return res.status(400).json({ error: 'message required' });

    const context = await findRelevantContext(message);

    const systemPrompt = 'You are a helpful customer support assistant. Keep answers concise and friendly.';
    const messages = [
      { role: 'system', content: systemPrompt }
    ];
    if (context) {
      messages.push({ role: 'system', content: `Company data/context:\n${context}` });
    }
    messages.push({ role: 'user', content: message });

    const apiKey = process.env.OPENAI_API_KEY;
    const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 450,
      temperature: 0.2
    }, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    const botReply = resp.data.choices[0].message.content.trim();

    let conv = await Conversation.findOne({ userId });
    if (!conv) conv = new Conversation({ userId, messages: [] });
    conv.messages.push({ sender: 'user', text: message });
    conv.messages.push({ sender: 'bot', text: botReply });
    await conv.save();

    res.json({ reply: botReply });
  } catch (err) {
    console.error(err.response?.data || err.message || err);
    res.status(500).json({ error: 'server error' });
  }
});

router.get('/history/:userId', async (req, res) => {
  const { userId } = req.params;
  const conv = await Conversation.findOne({ userId });
  if (!conv) return res.json({ messages: [] });
  res.json({ messages: conv.messages });
});

module.exports = router;
