const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());              // ✅ CORS 허용
app.use(express.json());      // ✅ JSON 파싱

app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: '❗ 사용자 메시지가 없습니다.' });
  }

  try {
    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '넌 ZEP 세계의 친절한 가이드야.' },
          { role: 'user', content: userMessage }
        ]
      })
    });

    const data = await gptRes.json();
    const reply = data.choices?.[0]?.message?.content ?? 'GPT 응답 오류';
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'GPT API 호출 실패', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ 프록시 서버 실행 중: http://localhost:${PORT}`);
});
