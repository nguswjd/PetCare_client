import Header from "@/components/header";

import StatusUserList from "@/components/status-userlist";

function HospitalReservation() {
  return (
    <div className="h-dvh flex flex-col">
      <Header label="병원리뷰" variant="label" showBackButton={true} />
      <StatusUserList />
    </div>
  );
}

export default HospitalReservation;
