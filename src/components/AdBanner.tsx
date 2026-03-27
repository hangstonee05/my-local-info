"use client";

import React from 'react';

export default function AdBanner() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  
  // ID가 설정되지 않았거나 기본값인 경우 렌더링하지 않음
  if (!adsenseId || adsenseId === "나중에_입력") {
    return null;
  }

  return (
    <div className="w-full my-12 py-8 border-y border-white/5 bg-zinc-900/20 backdrop-blur-sm overflow-hidden rounded-3xl flex flex-col items-center justify-center">
      <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest mb-4">Advertisement</div>
      
      {/* 실제 애드센스 슬롯 (정적 사이트에서는 클라이언트 사이드에서 작동) */}
      <div className="w-full max-w-[728px] min-h-[90px] bg-white/5 rounded-xl flex items-center justify-center border border-dashed border-white/10 text-zinc-600 text-xs italic">
        Ads by Google (Slot)
      </div>
      
      {/* 
        실제 운영 시에는 아래와 같은 코드가 들어갑니다:
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client={adsenseId}
             data-ad-slot="YOUR_AD_SLOT_ID"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      */}
    </div>
  );
}
