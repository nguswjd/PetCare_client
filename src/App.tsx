import { Routes, Route } from "react-router";
import Login from "./pages/login";

function MainPage() {
  return <div>Main Page</div>;
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
