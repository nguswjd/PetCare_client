import { Routes, Route } from "react-router";
import Login from "./pages/login";
import Join from "./pages/join/join";
import MainPage from "./pages/main";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />
    </Routes>
  );
}

export default App;
