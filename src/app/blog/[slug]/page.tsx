import { Metadata } from 'next';
import { getPostData, getSortedPostsData } from '@/lib/posts';
import MarkdownIt from 'markdown-it';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import AdBanner from '@/components/AdBanner';
import CoupangBanner from '@/components/CoupangBanner';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const postData = await getPostData(slug);
  
  return {
    title: `${postData.title} | 성남 LIFE 블로그`,
    description: postData.summary,
    openGraph: {
      title: postData.title,
      description: postData.summary,
      type: 'article',
      publishedTime: postData.date,
      authors: ['성남 LIFE'],
      tags: postData.tags,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const postData = await getPostData(slug);
  
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  });
  
  const contentHtml = md.render(postData.contentHtml || '');

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
            <Link href="/about" className="hover:text-orange-500 transition-colors">소개</Link>
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

          {/* 구분선 및 업데이트 정보 */}
          <div className="flex items-center justify-between mb-8 group/info">
            <div className="w-full h-px bg-white/5 group-hover/info:bg-blue-500/20 transition-colors" />
            <div className="shrink-0 ml-4 text-[10px] font-mono text-zinc-600 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
              최종 업데이트: {postData.date}
            </div>
          </div>
        </header>

        <article 
          className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-a:text-blue-400 prose-blockquote:border-blue-500/50 prose-img:rounded-3xl mb-16"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* AI 안내 및 원문 출처 강화 (E-E-A-T) */}
        <section className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8 mb-16 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-blue-400/10 transition-colors duration-700"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl">🤖</span>
              <h3 className="text-lg font-bold text-white">AI 생성 정보 안내</h3>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8">
              이 글은 공공데이터포털(<a href="http://data.go.kr/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">data.go.kr</a>)의 수집된 정보를 바탕으로 AI(Gemini)가 작성 및 요약하였습니다. 
              최신 정보와 정확한 내용은 반드시 아래 원문 링크를 통해 다시 한번 확인해 주시기 바랍니다.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Information Source</div>
                  <div className="text-sm font-bold text-zinc-300">공공데이터포털 공식 서비스 정보</div>
                </div>
              </div>
              
              <Link 
                href={(() => {
                  const localInfoPath = path.join(process.cwd(), 'public/data/local-info.json');
                  if (fs.existsSync(localInfoPath)) {
                    const localInfo = JSON.parse(fs.readFileSync(localInfoPath, 'utf8'));
                    const matchedItem = localInfo.find((item: any) => postData.title.includes(item.name));
                    return matchedItem ? matchedItem.link : "https://www.data.go.kr/";
                  }
                  return "https://www.data.go.kr/";
                })()}
                target="_blank"
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-black rounded-xl transition-all text-center"
              >
                원문 링크 확인하기
              </Link>
            </div>
          </div>
        </section>

        {/* 광고 배너 배치 */}
        <AdBanner />
        <CoupangBanner />

        {/* 구조화 데이터 (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": postData.title,
              "description": postData.summary,
              "datePublished": postData.date,
              "author": {
                "@type": "Organization",
                "name": "성남 LIFE"
              },
              "publisher": {
                "@type": "Organization",
                "name": "성남 LIFE"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "홈",
                  "item": "https://my-local-info-eya.pages.dev"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "블로그",
                  "item": "https://my-local-info-eya.pages.dev/blog"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": postData.title,
                  "item": `https://my-local-info-eya.pages.dev/blog/${postData.slug}`
                }
              ]
            })
          }}
        />

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
