import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginRegister from "./Components/LoginRegister";
import Home from "./Components/Home";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
