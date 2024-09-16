import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import SideMenu from "./components/SideMenu";
import Home from "./pages/Home";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";
import Page4 from "./pages/Page4";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import IncidentDetail from "./pages/IncidentDetail";
import MakeReport from "./pages/MakeReport"; // <-- Import MakeReport

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set true if the user is authenticated
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    // Show a Bootstrap loading spinner while checking auth status
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div>
        {isAuthenticated && <SideMenu />}
        <div
          style={{
            marginLeft: isAuthenticated ? "200px" : "0",
            padding: "20px",
          }}
        >
          <Routes>
            {isAuthenticated ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/page1" element={<Page1 />} />
                <Route path="/page2" element={<Page2 />} />
                <Route path="/page3" element={<Page3 />} />
                <Route path="/page4" element={<Page4 />} />
                <Route path="/incident/:id" element={<IncidentDetail />} />
                <Route path="/make-report" element={<MakeReport />} />{" "}
                {/* <-- Add MakeReport route */}
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
