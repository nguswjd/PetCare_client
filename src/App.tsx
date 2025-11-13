import { Routes, Route } from "react-router";
import Login from "./pages/login";
import Join from "./pages/join/join";
import MainPage from "./pages/main";
import Hospital from "./pages/hospital";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />
      <Route path="/hospital" element={<Hospital />} />
    </Routes>
  );
}

export default App;
