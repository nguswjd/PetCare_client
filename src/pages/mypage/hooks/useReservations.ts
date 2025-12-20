import { useState, useEffect } from "react";

interface Reservation {
  id: number;
  userId: number;
  hospitalId: number;
  hospitalName: string;
  reserverName: string;
  animalType: string;
  breed: string;
  age: number;
  weight: number;
  department: string;
  reservationDate: string;
  reservationTime: string;
  status: string;
  createdAt: string;
}

interface HospitalInfo {
  id: number;
  name: string;
  address: string;
  imageUrl: string;
  operatingStatus: string;
}

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [hospitalsInfo, setHospitalsInfo] = useState<{
    [key: number]: HospitalInfo;
  }>({});
  const [animalTypeMap, setAnimalTypeMap] = useState<{ [key: string]: string }>(
    {}
  );
  const [breedMap, setBreedMap] = useState<{ [key: string]: string }>({});
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchHospitalInfo = async (hospitalIds: number[]) => {
    const token = localStorage.getItem("token");
    if (!token) return {};

    const hospitalPromises = hospitalIds.map((id: number) =>
      fetch(`/api/v1/hospital/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json())
    );

    const hospitalsData = await Promise.all(hospitalPromises);
    const newHospitalsMap: { [key: number]: HospitalInfo } = {};
    hospitalsData.forEach((hospital, index) => {
      const id = hospitalIds[index];
      if (hospital) {
        newHospitalsMap[id] = {
          id: id,
          name: hospital.name,
          address: hospital.address,
          imageUrl: hospital.imageUrl,
          operatingStatus: hospital.operatingStatus,
        };
      }
    });
    return newHospitalsMap;
  };

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/v1/reservations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("예약 목록 불러오기 실패");

      const data = await res.json();
      const activeReservations = data.filter(
        (r: Reservation) => r.status === "PENDING" || r.status === "CONFIRMED"
      );
      setReservations(activeReservations);

      const hospitalIds = Array.from(
        new Set(activeReservations.map((r: Reservation) => r.hospitalId))
      ) as number[];

      const updatedHospitalsMap = await fetchHospitalInfo(hospitalIds);
      setHospitalsInfo(updatedHospitalsMap);

      const allAnimalTypes = new Set(
        activeReservations.map((r: Reservation) => r.animalType)
      );
      const breedPromises = Array.from(allAnimalTypes).map((type: any) =>
        fetch(`/api/v1/breeds/${type}`).then((res) => res.json())
      );

      const breedsData = await Promise.all(breedPromises);
      const breedMapping: { [key: string]: string } = {};
      breedsData.forEach((data) => {
        if (data.breeds) {
          data.breeds.forEach((breed: any) => {
            breedMapping[breed.code] = breed.description;
          });
        }
      });
      setBreedMap(breedMapping);
    } catch (err) {
      console.error(err);
      setReservations([]);
    }
  };

  const cancelReservation = async (reservationId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      return { success: false };
    }

    try {
      const res = await fetch(`/api/v1/reservations/${reservationId}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("예약 취소에 실패했습니다.");
      }

      setReservations((prev) => prev.filter((r) => r.id !== reservationId));
      setSelectedReservation(null);
      return { success: true };
    } catch (err) {
      console.error("예약 취소 에러:", err);
      alert("예약 취소 중 오류가 발생했습니다.");
      return { success: false };
    }
  };

  return {
    reservations,
    hospitalsInfo,
    animalTypeMap,
    breedMap,
    selectedReservation,
    setSelectedReservation,
    cancelReservation,
  };
};
