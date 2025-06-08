const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_API_KEY;

// ✅ CORS 옵션 명시적 설정
const corsOptions = {
  origin: '*', // 또는 'https://hongbi-ui.vercel.app'
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

// ✅ CORS 미들웨어 적용
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight OPTIONS 요청 처리

// ✅ JSON 파싱 설정
app.use(express.json());

// ✅ GPT API 프록시 엔드포인트
app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;

  console.log("📥 사용자 메시지 수신:", userMessage);
  console.log("🔑 API 키 존재 여부:", API_KEY ? "✅ 있음" : "❌ 없음");

  if (!userMessage) {
    console.error("❗ 사용자 메시지가 전달되지 않았습니다.");
    return res.status(400).json({ error: '사용자 메시지가 없습니다.' });
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

    console.log("🤖 GPT 응답 데이터:", data);

    const reply = data.choices?.[0]?.message?.content ?? 'GPT 응답 없음';
    res.json({ reply });

  } catch (err) {
    console.error("🔥 GPT API 호출 중 오류 발생:", err);
    res.status(500).json({ error: 'GPT API 호출 실패', detail: err.message });
  }
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 프록시 서버 실행 중: http://localhost:${PORT}`);
});
