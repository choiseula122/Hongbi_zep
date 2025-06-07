const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000; // 원하면 포트를 바꿔도 됨

// JSON 형식의 요청 본문을 파싱
app.use(express.json());

const API_KEY = process.env.API_KEY;


app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: '질문 메시지가 없습니다.' });
  }

  try {
    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '넌 ZEP 공간 안의 친절한 NPC야.' },
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
  console.log(`✅ GPT 프록시 서버 실행 중: http://localhost:${PORT}`);
});
