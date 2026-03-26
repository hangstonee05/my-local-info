import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  contentHtml?: string;
}

export function getSortedPostsData(): PostData[] {
  // src/content/posts 폴더가 없으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      // 날짜 처리 (Date 객체인 경우 YYYY-MM-DD 문자열로 변환)
      let dateValue = matterResult.data.date;
      if (dateValue instanceof Date) {
        dateValue = dateValue.toISOString().split('T')[0];
      }

      return {
        slug,
        title: matterResult.data.title || 'No Title',
        date: dateValue || '',
        summary: matterResult.data.summary || '',
        category: matterResult.data.category || 'Uncategorized',
        tags: matterResult.data.tags || [],
      } as PostData;
    });

  // 날짜순으로 정렬 (최신순)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  // 날짜 처리
  let dateValue = matterResult.data.date;
  if (dateValue instanceof Date) {
    dateValue = dateValue.toISOString().split('T')[0];
  }

  return {
    slug,
    title: matterResult.data.title || 'No Title',
    date: dateValue || '',
    summary: matterResult.data.summary || '',
    category: matterResult.data.category || 'Uncategorized',
    tags: matterResult.data.tags || [],
    contentHtml: matterResult.content,
  };
}
