/**
 * scripts/generate-blog-post.js
 * 최신 공공서비스 정보를 바탕으로 블로그 포스트를 자동 생성합니다.
 */

const fs = require('fs');
const path = require('path');

async function main() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_PATH = path.join(__dirname, '../public/data/local-info.json');
  const POSTS_DIR = path.join(__dirname, '../src/content/posts/');

  if (!GEMINI_API_KEY) {
    console.error('환경변수 GEMINI_API_KEY가 설정되지 않았습니다.');
    return;
  }

  try {
    // [1단계] 최신 데이터 확인
    if (!fs.existsSync(DATA_PATH)) {
      throw new Error('공공데이터 파일(local-info.json)이 존재하지 않습니다.');
    }

    const localData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    if (!localData || localData.length === 0) {
      console.log('데이터가 비어 있습니다.');
      return;
    }

    // 배열의 마지막 항목을 읽어옵니다 (사용자 명시 지침)
    const targetItem = localData[localData.length - 1];
    const targetName = targetItem.name;

    // 기존 포스트 폴더 확인 및 중복 검사
    if (!fs.existsSync(POSTS_DIR)) {
      fs.mkdirSync(POSTS_DIR, { recursive: true });
    }

    const existingFiles = fs.readdirSync(POSTS_DIR);
    for (const file of existingFiles) {
      if (file.endsWith('.md')) {
        const fileContent = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
        if (fileContent.includes(targetName)) {
          console.log('이미 작성된 글입니다.');
          return;
        }
      }
    }

    // [2단계] Gemini AI로 블로그 글 생성
    // 명시된 엔드포인트를 그대로 사용합니다.
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const today = new Date().toISOString().split('T')[0];
    const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(targetItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: ${today}
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: ${today}-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API 호출 실패 (상태 코드: ${response.status})`);
    }

    const result = await response.json();
    if (!result.candidates || result.candidates.length === 0) {
      throw new Error('Gemini로부터 유효한 응답을 받지 못했습니다.');
    }

    const fullText = result.candidates[0].content.parts[0].text;

    // [3단계] 파일 저장
    const lines = fullText.split('\n');
    let filenameLine = lines.find(line => line.trim().toUpperCase().startsWith('FILENAME:'));
    
    if (!filenameLine) {
      throw new Error('파일명(FILENAME) 정보를 찾을 수 없습니다.');
    }

    let fileName = filenameLine.split(':')[1].trim();
    if (!fileName.endsWith('.md')) {
      fileName += '.md';
    }

    // 본문에서 FILENAME 줄을 제외하고 추출
    let finalPostContent = fullText.replace(filenameLine, '').trim();
    
    // 마크다운 코드 블록 마크업이 포함된 경우 제거
    finalPostContent = finalPostContent.replace(/^```markdown\n|```$/gm, '').trim();

    const savePath = path.join(POSTS_DIR, fileName);
    fs.writeFileSync(savePath, finalPostContent, 'utf8');

    console.log(`블로그 글 생성 완료: ${fileName}`);

  } catch (error) {
    console.error('글 생성 중 오류가 발생했습니다:', error.message);
  }
}

main();
