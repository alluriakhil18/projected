import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Classroom Pulse</h2>

        <button onClick={() => navigate("/student")}>Student</button>
        <br /><br />

        <button onClick={() => navigate("/teacher")}>Teacher</button>
      </div>
    </div>
  );
}

export default Home;