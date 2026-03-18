import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Student from "./Student";
import Teacher from "./Teacher";
import "./styles.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student" element={<Student />} />
        <Route path="/teacher" element={<Teacher />} />
      </Routes>
    </Router>
  );
}

export default App;