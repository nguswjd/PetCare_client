import { Routes, Route } from "react-router";
import Login from "./pages/login";
import Footer from "./components/footer";

function MainPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">Main Page</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
