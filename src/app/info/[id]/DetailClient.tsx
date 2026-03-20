"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface LocalInfo {
  id: number;
  name: string;
  category: "행사" | "혜택";
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
}

export default function DetailClient({ id }: { id: string }) {
  const [item, setItem] = useState<LocalInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/local-info.json")
      .then((res) => res.json())
      .then((json: LocalInfo[]) => {
        const found = json.find((i) => i.id.toString() === id);
        setItem(found || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-xl font-medium text-orange-500/80 tracking-tight">상세 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] font-sans text-zinc-300">
        <h2 className="text-4xl font-black text-white mb-4">404</h2>
        <p className="mb-8 font-medium">찾으시는 정보가 없거나 이미 종료된 행사입니다.</p>
        <Link href="/" className="px-6 py-2 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-colors">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const isEvent = item.category === "행사";
  const accentColor = isEvent ? "text-orange-500" : "text-yellow-500";
  const bgAccent = isEvent ? "bg-orange-500/10" : "bg-yellow-500/10";
  const borderAccent = isEvent ? "border-orange-500/20" : "border-yellow-500/20";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* 배경 장식 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] ${isEvent ? "bg-orange-500/10" : "bg-yellow-500/5"} blur-[120px] rounded-full`}></div>
      </div>

      {/* 헤더 */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-zinc-800 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-orange-500/50 transition-all">
              <svg className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">목록으로 돌아가기</span>
          </Link>
          <div className="text-xs font-mono text-zinc-600 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            ID: {item.id}
          </div>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-6 py-16">
        {/* 상세 내용 카드 */}
        <article className="bg-zinc-900/40 border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="px-8 pb-12 pt-12 md:px-16 md:pb-20 md:pt-16">
            <div className={`inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black tracking-widest mb-8 ${bgAccent} ${accentColor} border ${borderAccent}`}>
              {item.category.toUpperCase()}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-10 leading-[1.1] tracking-tight">
              {item.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <InfoBlock icon="📅" label="진행 기간" value={`${item.startDate} ~ ${item.endDate}`} />
              <InfoBlock icon="📍" label="진행 장소" value={item.location} />
              <InfoBlock icon="👥" label="참여 대상" value={item.target} />
            </div>

            <div className="space-y-6 mb-20">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                세부 안내 사항
              </h3>
              <p className="text-lg text-zinc-400 leading-relaxed whitespace-pre-wrap font-medium">
                {item.summary}
              </p>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-sm md:text-base text-zinc-500 italic">
                ※ 위 정보는 공공데이터포털 자료를 바탕으로 구성되었습니다. 실제 방문 전 상세 정보를 다시 한번 확인해 주세요.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center py-5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-[1.5rem] shadow-xl shadow-orange-900/40 transition-all duration-300 text-lg hover:-translate-y-1"
              >
                공식 사이트에서 자세히 보기
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <Link 
                href="/"
                className="px-10 flex items-center justify-center py-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-bold rounded-[1.5rem] transition-all duration-300 border border-white/5"
              >
                닫기
              </Link>
            </div>
          </div>
        </article>
      </main>

      <footer className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="text-[10px] text-zinc-700 font-medium tracking-widest uppercase mb-4">
          성남 LIFE &bull; Local Information Guide
        </div>
      </footer>
    </div>
  );
}

function InfoBlock({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex flex-col gap-2">
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-bold text-white leading-snug">{value}</span>
    </div>
  );
}
