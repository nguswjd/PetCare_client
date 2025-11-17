import { Routes, Route } from "react-router";
import Login from "./pages/login";
import SignUp from "./pages/sign-up/sign-up";
import MainPage from "./pages/main";
import Hospital from "./pages/hospital";
import Review from "./pages/review";
import Mypage from "./pages/mypage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/hospital/:id" element={<Hospital />} />
      <Route path="/hospital/:id/review" element={<Review />} />
      <Route path="/mypage" element={<Mypage />} />
    </Routes>
  );
}

export default App;
