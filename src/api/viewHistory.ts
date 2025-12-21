const BASE_URL = import.meta.env.VITE_API_URL || "http://3.26.101.146:8080";

export interface ViewHistoryResponse {
  id: number;
  name: string;
  address: string;
  imageUrl: string;
  operatingStatus: string;
  visitedAt: string;
}

export const saveViewHistoryApi = async (hospitalId: number, token: string) => {
  if (!hospitalId) {
    throw new Error("hospitalId가 유효하지 않습니다");
  }

  if (!token) {
    throw new Error("토큰이 없습니다");
  }

  const res = await fetch(`${BASE_URL}/api/v1/view-history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ hospitalId }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("서버 응답 에러:", errorText);
    throw new Error(`최근 본 병원 저장 실패: ${res.status} - ${errorText}`);
  }
};

export const getUserViewHistoryApi = async (
  token: string
): Promise<ViewHistoryResponse[]> => {
  const response = await fetch(`${BASE_URL}/api/v1/view-history/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("최근 본 병원 조회 실패");
  }

  return response.json();
};
