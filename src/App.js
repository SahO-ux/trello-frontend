import {
  BrowserRouter as Router,
  // eslint-disable-next-line
  Navigate,
  Routes,
  Route,
} from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import LoginRegister from "./Components/LoginRegister/LoginRegister";
import Home from "./Components/Home";

function App() {
  const mode = useSelector((state) => state.mode);
  // const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          {/* <Route path="/login" element={<LoginRegister />} /> */}
          <Route path="/home" element={<Home />} />
          {/* <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
