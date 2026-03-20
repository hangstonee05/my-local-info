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

export default function Home() {
  const [data, setData] = useState<LocalInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/local-info.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setLoading(false);
      });
  }, []);

  const events = data.filter((item) => item.category === "행사");
  const benefits = data.filter((item) => item.category === "혜택");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-xl font-medium text-orange-500/80 tracking-tight">정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* 배경 장식 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-500/5 blur-[120px] rounded-full"></div>
      </div>

      {/* 1. 상단 헤더 */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-xl">🏠</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter">
                성남 <span className="text-orange-500">LIFE</span>
              </h1>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <Link href="#" className="hover:text-orange-500 transition-colors">행사소식</Link>
            <Link href="#" className="hover:text-orange-500 transition-colors">생활혜택</Link>
            <Link href="#" className="hover:text-orange-500 transition-colors">동네이야기</Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono text-zinc-600 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              LAST UPDATE: {new Date().toLocaleDateString("en-US")}
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 pt-12 pb-24 space-y-24">
        {/* 2. 이번 달 행사/축제 */}
        <section>
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">
                <span className="w-6 h-[2px] bg-orange-500"></span>
                Hot Events
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">이번 달 성남 <span className="italic">Festival</span></h2>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
              총 <span className="text-white font-bold">{events.length}</span>개의 행사
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event.id} item={event} color="orange" />
            ))}
          </div>
        </section>

        {/* 3. 지원금/혜택 정보 */}
        <section className="relative">
          <div className="absolute inset-x-[-24px] inset-y-[-40px] bg-zinc-900/40 rounded-[3rem] -z-10 border border-white/5 shadow-2xl"></div>
          
          <div className="flex items-end justify-between mb-10 px-6 pt-6">
            <div>
              <div className="flex items-center gap-2 text-yellow-500 font-bold text-xs uppercase tracking-widest mb-2">
                <span className="w-6 h-[2px] bg-yellow-500"></span>
                Benefits
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">당신을 위한 <span className="italic">Support</span></h2>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
              총 <span className="text-white font-bold">{benefits.length}</span>개의 혜택
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 pb-6">
            {benefits.map((benefit) => (
              <Card key={benefit.id} item={benefit} color="yellow" />
            ))}
          </div>
        </section>
      </main>

      {/* 4. 하단 푸터 */}
      <footer className="bg-zinc-950 border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <h3 className="text-xl font-black text-white tracking-tighter">성남 LIFE</h3>
            <p className="text-zinc-500 text-sm max-w-xs text-center md:text-left">
              공공데이터포털의 정보를 기반으로 AI가 큐레이션한 성남시 맞춤 생활 정보를 전달합니다.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-3">
              <span className="font-bold text-white mb-2 underline decoration-orange-500 underline-offset-4">Information</span>
              <Link href="#" className="text-zinc-500 hover:text-white transition-colors">About Us</Link>
              <Link href="#" className="text-zinc-500 hover:text-white transition-colors">Privacy Policy</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-bold text-white mb-2 underline decoration-orange-500 underline-offset-4">Source</span>
              <a href="https://data.go.kr" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors underline">공공데이터포털</a>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center text-[10px] text-zinc-700 font-medium tracking-widest uppercase">
          &copy; 2026 Seongnam Life Guide. Engineered with AI.
        </div>
      </footer>
    </div>
  );
}

function Card({ item, color }: { item: LocalInfo; color: "orange" | "yellow" }) {
  const accentColor = color === "orange" ? "text-orange-500" : "text-yellow-500";
  const bgAccent = color === "orange" ? "bg-orange-500/10" : "bg-yellow-500/10";
  const borderAccent = color === "orange" ? "group-hover:border-orange-500/50" : "group-hover:border-yellow-500/50";
  const shadowAccent = color === "orange" ? "hover:shadow-orange-500/10" : "hover:shadow-yellow-500/10";

  return (
    <div className={`group relative bg-zinc-900/50 border border-white/5 rounded-3xl p-7 transition-all duration-500 hover:-translate-y-2 hover:bg-zinc-800/80 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] ${shadowAccent} ${borderAccent} backdrop-blur-sm`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color === "orange" ? "from-orange-500/20" : "from-yellow-500/15"} to-transparent blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
      
      <div className="relative">
        <div className={`inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black tracking-widest mb-6 ${bgAccent} ${accentColor} border border-white/5`}>
          {item.category.toUpperCase()}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors leading-snug">
          {item.name}
        </h3>
        
        <p className="text-zinc-500 text-sm mb-8 leading-relaxed line-clamp-2 min-h-[44px]">
          {item.summary}
        </p>
        
        <div className="space-y-4 mb-8">
          <DetailItem icon="📅" label="기간" value={`${item.startDate} ~ ${item.endDate}`} />
          <DetailItem icon="📍" label="장소" value={item.location} />
          <DetailItem icon="👥" label="대상" value={item.target} />
        </div>
        
        <Link 
          href={`/info/${item.id}`}
          className="group/btn flex items-center justify-center w-full py-3.5 bg-zinc-800 hover:bg-white text-zinc-300 hover:text-black font-bold rounded-2xl transition-all duration-300 text-sm border border-white/5 shadow-lg"
        >
          상세 정보 보기
          <svg className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-base grayscale group-hover:grayscale-0 transition-all duration-500">{icon}</span>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter mb-0.5">{label}</span>
        <span className="text-xs font-medium text-zinc-400 leading-tight">{value}</span>
      </div>
    </div>
  );
}
