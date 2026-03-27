import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* 배경 장식 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full"></div>
      </div>

      {/* 상단 헤더 추가 */}
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
            <Link href="/about" className="hover:text-orange-500 transition-colors">소개</Link>
            <Link href="/blog" className="px-4 py-1.5 bg-white text-black rounded-xl transition-all font-bold border border-white/5 shadow-sm">블로그</Link>
          </nav>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-6 py-20">
        <header className="mb-16">
          <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest mb-3">
            <span className="w-8 h-[2px] bg-blue-500"></span>
            Insights & Stories
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
            프로젝트 <span className="text-blue-500">블로그</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl leading-relaxed">
            성남시의 유용한 정보와 기술적인 이야기들을 기록합니다.
          </p>
        </header>

        <div className="space-y-12">
          {allPostsData.length > 0 ? (
            allPostsData.map(({ slug, date, title, summary, category, tags }) => (
              <article key={slug} className="group relative">
                <div className="absolute -inset-x-6 -inset-y-4 z-0 scale-95 bg-zinc-900/0 opacity-0 transition group-hover:scale-100 group-hover:bg-zinc-900/50 group-hover:opacity-100 sm:rounded-2xl" />
                <Link href={`/blog/${slug}`}>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 mb-3">
                      <time dateTime={date}>{date}</time>
                      <span className="text-zinc-700">|</span>
                      <span className="text-blue-500/80 uppercase tracking-wider font-bold">{category}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mb-4">
                      {title}
                    </h2>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {summary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] text-zinc-400 font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <div className="py-20 text-center border border-dashed border-zinc-800 rounded-3xl">
              <p className="text-zinc-600">아직 등록된 블로그 글이 없습니다.</p>
              <p className="text-zinc-700 text-sm mt-2">`src/content/posts` 폴더에 마크다운 파일을 추가해 주세요.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
