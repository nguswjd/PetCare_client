import {
  saveViewHistoryApi,
  getUserViewHistoryApi,
  type ViewHistoryResponse,
} from "../api/viewHistory";

const LOCAL_STORAGE_KEY = "recent_hospitals";
const MAX_RECENT_COUNT = 10;

export interface RecentHospitalData {
  id: number;
  name: string;
  address: string;
  imageUrl: string;
  operatingStatus: string;
  visitedAt?: string;
}

export const addRecentHospitalUnified = async (
  hospital: RecentHospitalData
) => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      await saveViewHistoryApi(hospital.id, token);
    } catch (error) {
      console.error("서버 히스토리 저장 실패:", error);
    }
  } else {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    let recents: RecentHospitalData[] = stored ? JSON.parse(stored) : [];

    recents = recents.filter((item) => item.id !== hospital.id);

    recents.unshift({
      ...hospital,
      visitedAt: new Date().toISOString(),
    });

    if (recents.length > MAX_RECENT_COUNT) {
      recents = recents.slice(0, MAX_RECENT_COUNT);
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recents));
  }
};

export const getRecentHospitalsUnified = async (): Promise<
  RecentHospitalData[]
> => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const data: ViewHistoryResponse[] = await getUserViewHistoryApi(token);
      return data;
    } catch (error) {
      console.error("서버 히스토리 조회 실패:", error);
      return [];
    }
  } else {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
};
