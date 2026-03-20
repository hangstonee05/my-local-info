import DetailClient from "./DetailClient";

// Static export를 위해 모든 가능한 ID를 미리 정의합니다.
export async function generateStaticParams() {
  // 실제 빌드 시점에는 서버 환경에서 파일을 읽어야 하므로 
  // 여기서는 단순히 현재 샘플 데이터의 ID 범위(1~5)를 반환합니다.
  return [
    { id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }
  ];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DetailClient id={id} />;
}
