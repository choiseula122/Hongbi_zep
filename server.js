const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

const responses = {}; // 사용자별 GPT 응답 저장

app.get('/gpt-ask', async (req, res) => {
  const user = req.query.user;
  const message = req.query.message;

  if (!user || !message) {
    return res.status(400).send("Missing parameters");
  }

  try {
    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "넌 친절한 NPC야." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await gptRes.json();
    const reply = data.choices?.[0]?.message?.content ?? "응답 실패";

    responses[user] = reply;
    res.send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("GPT 오류");
  }
});

app.get('/gpt-reply', (req, res) => {
  const user = req.query.user;
  const reply = responses[user] ?? "아직 준비 중이에요.";
  delete responses[user]; // 1회 응답 후 제거
  res.json({ reply });
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중 http://localhost:${PORT}`);
});
