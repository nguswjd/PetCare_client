import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router";
import Login from "./pages/login";
import Footer from "./components/footer";

function App() {
  const [vh, setVh] = useState("100vh");
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setVh(`${window.innerHeight}px`);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showFooter = location.pathname !== "/login";

  return (
    <div style={{ height: vh }} className="flex flex-col w-full">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
}

function MainPage() {
  return <main className="flex-1">Main Page</main>;
}

export default App;
