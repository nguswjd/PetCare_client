interface HospitalSignupData {
  representativeName: string;
  username: string;
  password: string;
  name: string;
  hospitalNumber: string;
  businessRegistrationNumber: string;
  address: string;
  hasParking?: string;
  departments?: string;
  animalTypes?: string;
  breeds?: string;
  holidays?: string;
  operatingStartTime?: string;
  operatingEndTime?: string;
  breakTimes?: string;
  description?: string;
  imageFile?: File | null;
}

export const hospitalSignup = async (data: HospitalSignupData) => {
  const API_URL = import.meta.env.VITE_API_URL;

  try {
    const formData = new FormData();

    formData.append("representativeName", data.representativeName);
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("name", data.name);
    formData.append("hospitalNumber", data.hospitalNumber);
    formData.append(
      "businessRegistrationNumber",
      data.businessRegistrationNumber
    );
    formData.append("address", data.address);

    if (data.hasParking) formData.append("hasParking", data.hasParking);
    if (data.departments) formData.append("departments", data.departments);
    if (data.animalTypes) formData.append("animalTypes", data.animalTypes);
    if (data.breeds) formData.append("breeds", data.breeds);
    if (data.holidays) formData.append("holidays", data.holidays);
    if (data.operatingStartTime)
      formData.append("operatingStartTime", data.operatingStartTime);
    if (data.operatingEndTime)
      formData.append("operatingEndTime", data.operatingEndTime);
    if (data.breakTimes) formData.append("breakTimes", data.breakTimes);
    if (data.description) formData.append("description", data.description);
    if (data.imageFile) formData.append("imageFile", data.imageFile);

    const response = await fetch(`${API_URL}/api/v1/hospital/auth/signup`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "회원가입에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("회원가입 오류:", error);
    throw error;
  }
};
