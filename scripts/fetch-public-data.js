/**
 * scripts/fetch-public-data.js
 * 매일 1회 실행되어 새로운 공공서비스 정보를 추가하는 스크립트입니다.
 */

const fs = require('fs');
const path = require('path');

async function fetchAndProcessData() {
  const { PUBLIC_DATA_API_KEY, GEMINI_API_KEY } = process.env;
  const LOCAL_INFO_PATH = path.join(__dirname, '../public/data/local-info.json');

  if (!PUBLIC_DATA_API_KEY || !GEMINI_API_KEY) {
    console.error('환경변수 PUBLIC_DATA_API_KEY 또는 GEMINI_API_KEY가 설정되지 않았습니다.');
    return;
  }

  try {
    console.log('공공데이터 수집을 시작합니다...');

    // [1단계] 공공데이터포털 API에서 데이터 가져오기 (매개변수 고정)
    // 혜택/행사 정보 조회를 위해 serviceList 엔드포인트를 사용합니다.
    const publicDataUrl = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON&serviceKey=${PUBLIC_DATA_API_KEY}`;
    
    const publicResponse = await fetch(publicDataUrl);
    if (!publicResponse.ok) {
      throw new Error(`공공데이터 API 호출 실패 (상태 코드: ${publicResponse.status})`);
    }

    const publicJson = await publicResponse.json();
    const items = publicJson.data || [];

    if (items.length === 0) {
      console.log('가져온 데이터가 없습니다.');
      return;
    }

    // "성남" 또는 "경기" 포함 필터링 기능
    const searchKeywords = (item, keyword) => {
      const keys = ['서비스명', '서비스목적요약', '지원대상', '소관기관명'];
      return keys.some(key => (item[key] || '').includes(keyword));
    };

    let filteredItems = items.filter(item => searchKeywords(item, '성남'));
    if (filteredItems.length === 0) {
      console.log('"성남" 관련 정보가 없어 "경기" 관련 정보를 검색합니다.');
      filteredItems = items.filter(item => searchKeywords(item, '경기'));
    }
    if (filteredItems.length === 0) {
      console.log('"성남/경기" 관련 정보가 없어 전체 데이터를 사용합니다.');
      filteredItems = items;
    }

    // [2단계] 기존 데이터와 비교 (중복 제거)
    let existingData = [];
    if (fs.existsSync(LOCAL_INFO_PATH)) {
      try {
        existingData = JSON.parse(fs.readFileSync(LOCAL_INFO_PATH, 'utf8'));
      } catch (e) {
        console.error('기존 데이터 파일을 읽는 중 오류가 발생했습니다. 새 파일로 시작합니다.');
        existingData = [];
      }
    }

    const existingNames = new Set(existingData.map(d => d.name));
    const newItems = filteredItems.filter(item => !existingNames.has(item.서비스명));

    if (newItems.length === 0) {
      console.log('새로운 데이터가 없습니다.');
      return;
    }

    // 새로운 데이터 중 첫 번째 항목 선택
    const rawItem = newItems[0];
    console.log(`새로운 항목 발견: "${rawItem.서비스명}". 가공을 시작합니다.`);

    // [3단계] Gemini AI로 새 항목 가공
    // 사용자가 요청한 gemini-2.5-flash 모델과 v1beta 엔드포인트를 사용합니다.
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const today = new Date().toISOString().split('T')[0];
    const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 '${today}', endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

공공데이터:
${JSON.stringify(rawItem, null, 2)}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API 호출 실패 (상태 코드: ${geminiResponse.status})`);
    }

    const geminiJson = await geminiResponse.json();
    if (!geminiJson.candidates || geminiJson.candidates.length === 0) {
      throw new Error('Gemini로부터 유효한 응답을 받지 못했습니다.');
    }

    let resultText = geminiJson.candidates[0].content.parts[0].text;
    
    // 마크다운 코드 블록 제거 및 순수 JSON 추출
    resultText = resultText.replace(/```json|```/g, '').trim();
    const processedItem = JSON.parse(resultText);

    // [4단계] 기존 데이터에 추가 (id 관리)
    const nextId = existingData.reduce((max, d) => Math.max(max, d.id || 0), 0) + 1;
    processedItem.id = nextId;

    // 최신 데이터를 배열 맨 앞에 배치
    existingData.unshift(processedItem);
    
    fs.writeFileSync(LOCAL_INFO_PATH, JSON.stringify(existingData, null, 2), 'utf8');

    console.log(`추가 성공: "${processedItem.name}" (ID: ${processedItem.id})`);

  } catch (error) {
    console.error('작업 수행 중 오류가 발생했습니다:', error.message);
    // 에러 시 기존 파일을 덮어쓰지 않고 종료합니다.
  }
}

fetchAndProcessData();
