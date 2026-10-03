require('dotenv').config();
const express = require('express');
const path = require('path');
const { Groq } = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3000;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/figures', express.static(path.join(__dirname, 'figures')));

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "openai/gpt-oss-20b", // fast and smart model
      temperature: 0.5,
      max_tokens: 1024,
    });
    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("Groq error:", error);
    res.status(500).json({ error: "Chatbot encountered an error." });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Operation ARIMA running at http://localhost:${PORT}`);
});
