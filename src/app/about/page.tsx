import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* 배경 Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full"></div>
      </div>

      {/* 헤더 */}
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
            <Link href="/" className="hover:text-orange-500 transition-colors">행사소식</Link>
            <Link href="/" className="hover:text-orange-500 transition-colors">생활혜택</Link>
            <Link href="/about" className="px-4 py-1.5 bg-white text-black rounded-xl transition-all font-bold border border-white/5 shadow-sm">소개</Link>
            <Link href="/blog" className="hover:text-orange-500 transition-colors">블로그</Link>
          </nav>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-6 py-20">
        <header className="mb-16">
          <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest mb-3">
            <span className="w-8 h-[2px] bg-orange-500"></span>
            About Seongnam Life
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8">
            서비스 <span className="text-orange-500">소개</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
            성남 LIFE는 지역 주민 여러분의 더 나은 일상을 위해 탄생했습니다.
            복잡한 공공 데이터를 한눈에 확인하고, 필요한 혜택을 놓치지 마세요.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <SectionCard 
            icon="🎯"
            title="운영 목적"
            description="성남시 및 인근 지역의 축제, 행사, 그리고 정부 지원금 정보를 빠르게 전달하여 지역 주민들의 정보 격차를 해소하고 삶의 만족도를 높이는 것이 저희의 목표입니다."
          />
          <SectionCard 
            icon="📊"
            title="데이터 출처"
            description="본 서비스는 '공공데이터포털(data.go.kr)'의 신뢰할 수 있는 공식 데이터를 기반으로 합니다. 정부가 제공하는 공공서비스 목록을 수집하여 가독성 있게 재구성합니다."
          />
          <SectionCard 
            icon="🤖"
            title="콘텐츠 생성 방식"
            description="방대한 공공 데이터를 주민들이 이해하기 쉬운 언어로 번역하기 위해 최신 AI 기술(Gemini)을 활용하고 있습니다. AI는 정보를 요약하고 추천 이유를 정리하는 역할을 수행합니다."
          />
          <SectionCard 
            icon="💡"
            title="주의 사항"
            description="데이터는 매일 업데이트되지만, 기관의 사정에 따라 실시간으로 변동될 수 있습니다. 중요한 신청 건은 반드시 제공된 원문 링크를 통해 최종 확인해 주시기 바랍니다."
          />
        </div>

        <div className="p-12 bg-zinc-900/40 border border-white/5 rounded-[3rem] backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6">성남 LIFE와 함께하세요</h2>
          <p className="text-zinc-500 mb-8 leading-relaxed">
            성남 LIFE는 지속적으로 더 유익한 정보를 담기 위해 진화하고 있습니다. 
            우리 동네의 즐거운 축제 소식부터 나만 몰랐던 정부 지원금 혜택까지, 
            성남 LIFE가 여러분의 든든한 정보 길잡이가 되어 드리겠습니다.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-orange-500 font-bold hover:underline">
            메인 페이지로 이동하기
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}

function SectionCard({ icon, title, description }: { icon: string; title: string, description: string }) {
  return (
    <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-[2rem] hover:bg-zinc-800/40 transition-colors">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
