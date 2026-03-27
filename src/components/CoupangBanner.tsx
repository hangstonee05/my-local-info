"use client";

import React from 'react';

export default function CoupangBanner() {
  const coupangId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID;
  
  // ID가 설정되지 않았거나 기본값인 경우 렌더링하지 않음
  if (!coupangId || coupangId === "나중에_입력") {
    return null;
  }

  return (
    <div className="w-full my-8 p-6 bg-zinc-900/10 border border-white/5 rounded-3xl overflow-hidden relative group">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">Recommended Products</div>
        <div className="w-full max-w-[680px] h-[120px] bg-white/5 rounded-2xl flex items-center justify-center border border-dashed border-white/10 text-zinc-600 text-xs italic">
          Coupang Partners Banner Area (ID: {coupangId})
        </div>
        <p className="text-[10px] text-zinc-600 leading-tight">
          "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."
        </p>
      </div>
      
      {/* 
        실제 쿠팡 파트너스 태그 예시:
        <iframe src={`https://link.coupang.com/a/${coupangId}`} width="100%" height="120" frameborder="0" scrolling="no" referrerpolicy="unsafe-url"></iframe>
      */}
    </div>
  );
}
