from flask import Flask, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv
import os

# .env 파일에서 API 키 읽어오기
load_dotenv()

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)

@app.route("/gpt", methods=["GET"])
def get_gpt_response():
    # URL에서 쿼리 가져오기 (예: ?q=질문내용)
    question = request.args.get("q", "기본 질문입니다.")

    # GPT에게 질문 보내고 응답 받기
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "귀엽고 친절한 캐릭터처럼 대답해줘."},
            {"role": "user", "content": question}
        ]
    )

    # 응답만 추출해서 JSON으로 반환
    return jsonify({"reply": response.choices[0].message.content.strip()})

# 서버 시작
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)