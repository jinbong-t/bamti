// api/gemini-counseling.js

// 1. 프론트엔드에 API 키를 넣으면 개발자 도구에서 노출될 수 있다.
// 2. Gemini API 호출은 Vercel Serverless Function에서 처리한다.
// 3. .env 파일은 GitHub에 올리지 않는다.
// 4. Vercel 배포 시에는 Project Settings의 Environment Variables에 GEMINI_API_KEY를 등록해야 한다.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'POST 요청만 허용됩니다.' });
  }

  const { studentAlias, gradeSummary, learningTraits, teacherConcern } = req.body;

  if (!studentAlias || !gradeSummary || !learningTraits || !teacherConcern) {
    return res.status(400).json({ success: false, error: '필수 데이터가 누락되었습니다.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ success: false, error: 'GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.' });
  }

  const prompt = `당신은 베테랑 교사이자 따뜻한 학생 상담 전문가입니다.
다음 학생의 데이터를 바탕으로 교사가 학생을 이해하고 대화할 수 있도록 돕는 상담 전략을 제안해주세요.

* 학생: ${studentAlias}
* 성적 요약: ${gradeSummary}
* 학습 특성: ${learningTraits}
* 교사 고민: ${teacherConcern}

[Gemini 프롬프트 원칙]
1. 학생을 단정적으로 판단하거나 진단하지 마세요. (예: "의지가 부족하다", "주의력 문제가 있다" 등 단정적 표현 금지)
2. 교사가 학생을 긍정적으로 이해하고 접근할 수 있도록 돕습니다.
3. 다음 형식에 맞춰 답변해주세요.

1. 현재 상황 요약
2. 학생 데이터 기반 해석
3. 상담 접근 전략
4. 교사가 던질 수 있는 질문 3개
5. 피해야 할 말 또는 주의점
6. 다음 수업에서 해볼 수 있는 작은 지원`;

  try {
    // 6. Gemini REST API를 내장 fetch로 호출한다.
    // 7. gemini-2.5-pro 모델을 사용한다.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ success: true, result: text });
  } catch (error) {
    console.error('Gemini API 호출 실패:', error);
    return res.status(500).json({ success: false, error: 'AI 상담 전략을 불러오지 못했습니다. API 키 또는 Vercel 환경 변수를 확인해주세요.' });
  }
}
