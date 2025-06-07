app.get('/gpt-direct', async (req, res) => {
  const userMessage = req.query.message || '';
  const user = req.query.user || '사용자';

  if (!userMessage) {
    return res.status(400).send("질문 메시지가 없습니다.");
  }

  try {
    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: `${user}와 대화하는 친절한 NPC야.` },
          { role: 'user', content: userMessage }
        ]
      })
    });

    const data = await gptRes.json();
    const reply = data.choices?.[0]?.message?.content ?? 'GPT 응답 오류';
    res.send(reply);
  } catch (err) {
    res.status(500).send("GPT API 호출 실패: " + err.message);
  }
});
