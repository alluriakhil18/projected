import { useState } from "react";
import "./styles.css";

function Student() {
  const [sessionId, setSessionId] = useState("");
  const [message, setMessage] = useState("");

  const sendSignal = async (signal) => {
    const res = await fetch("http://127.0.0.1:8000/send_signal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ session_id: sessionId, signal })
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Student Panel</h2>

        <input
          placeholder="Enter Session ID"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
        />

        <div>
          <button onClick={() => sendSignal("lost")}>😕 I'm Lost</button>
          <button onClick={() => sendSignal("fast")}>⚡ Too Fast</button>
          <button onClick={() => sendSignal("got_it")}>✅ Got It</button>
          <button onClick={() => sendSignal("boring")}>😴 Boring</button>
        </div>

        <p className="info">{message}</p>
      </div>
    </div>
  );
}

export default Student;