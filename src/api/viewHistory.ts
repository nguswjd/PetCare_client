const BASE_URL = "";

export interface ViewHistoryResponse {
  id: number;
  name: string;
  address: string;
  imageUrl: string;
  operatingStatus: string;
  visitedAt: string;
}

export const saveViewHistoryApi = async (hospitalId: number, token: string) => {
  const response = await fetch(`${BASE_URL}/api/v1/view-history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ hospitalId }),
  });

  if (!response.ok) {
    throw new Error("최근 본 병원 저장 실패");
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
