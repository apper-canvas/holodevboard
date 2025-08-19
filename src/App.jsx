import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/components/pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
        
      </div>
    </BrowserRouter>
  );
}

export default App;