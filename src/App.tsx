import { Routes, Route } from "react-router";
import Login from "./pages/login";
import Footer from "./components/footer";
import Join from "./pages/join/join";

function MainPage() {
  return (
    <div className="bg-white flex flex-col h-dvh">
      <main className="flex-1 overflow-auto">Main Page</main>
      <Footer />
    </div>
  );
}

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
