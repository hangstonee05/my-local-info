import { getPostData, getSortedPostsData } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const postData = await getPostData(slug);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* 배경 Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-blue-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[25%] h-[25%] bg-purple-500/5 blur-[100px] rounded-full"></div>
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
            <Link href="/" className="hover:text-orange-500 transition-colors">동네이야기</Link>
            <Link href="/blog" className="px-4 py-1.5 bg-white text-black rounded-xl transition-all font-bold border border-white/5 shadow-sm">블로그</Link>
          </nav>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-6 py-20">
        <header className="mb-12">
          <Link href="/blog" className="group/back inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-10 text-sm font-medium">
            <svg className="w-4 h-4 transition-transform group-hover/back:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            목록으로 돌아가기
          </Link>

          <div className="flex items-center gap-2 text-blue-500/80 font-bold text-xs uppercase tracking-widest mb-4">
            <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded">
              {postData.category}
            </span>
            <span className="text-zinc-700 mx-1">•</span>
            <time dateTime={postData.date}>{postData.date}</time>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8 leading-tight">
            {postData.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-10">
            {postData.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-xs text-zinc-500">
                #{tag}
              </span>
            ))}
          </div>

          {/* 구분선 */}
          <div className="w-full h-px bg-white/5" />
        </header>

        <article className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-a:text-blue-400 prose-blockquote:border-blue-500/50 prose-img:rounded-3xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {postData.contentHtml || ''}
          </ReactMarkdown>
        </article>

        {/* 푸터 영역 (선택사항) */}
        <footer className="mt-20 pt-10 border-t border-white/5">
          <div className="bg-zinc-900/40 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-sm text-center">
            <h3 className="text-xl font-bold text-white mb-3">함께 보면 좋은 정보</h3>
            <p className="text-zinc-500 text-sm mb-8">성남시 프로젝트는 시민들의 삶의 질 향상을 위해 다양한 정보를 공유합니다.</p>
            <Link href="/" className="inline-flex items-center justify-center px-8 py-3.5 bg-zinc-800 hover:bg-white text-zinc-300 hover:text-black font-bold rounded-2xl transition-all duration-300 text-sm border border-white/5">
              메인으로 돌아가기
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
