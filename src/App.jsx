import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Education, Healthcare, Transport, Housing } from "./pages/Modules";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="education" element={<Education />} />
          <Route path="healthcare" element={<Healthcare />} />
          <Route path="transport" element={<Transport />} />
          <Route path="housing" element={<Housing />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
