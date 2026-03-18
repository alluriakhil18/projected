import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import "./styles.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function Teacher() {
  const [sessionId, setSessionId] = useState("");
  const [mode, setMode] = useState("online");
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);

  const createSession = async () => {
    const res = await fetch("http://127.0.0.1:8000/create_session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode })
    });

    const data = await res.json();
    setSessionId(data.session_id);
    setSummary(null);
  };

  const fetchStats = async () => {
    if (!sessionId) return;

    const res = await fetch(`http://127.0.0.1:8000/stats/${sessionId}`);
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const refreshSession = async () => {
    await fetch(`http://127.0.0.1:8000/refresh/${sessionId}`, {
      method: "POST"
    });
    setStats({ lost: 0, fast: 0, got_it: 0, boring: 0 });
  };

  const endTopic = async () => {
    await fetch(`http://127.0.0.1:8000/end_topic/${sessionId}`, {
      method: "POST"
    });
    setStats({ lost: 0, fast: 0, got_it: 0, boring: 0 });
  };

  const endSession = async () => {
    const res = await fetch(`http://127.0.0.1:8000/end_session/${sessionId}`, {
      method: "POST"
    });
    const data = await res.json();
    setSummary(data);
  };

  const getInsight = () => {
    if (!stats) return "";

    const total = stats.lost + stats.fast + stats.got_it + stats.boring;
    if (total === 0) return "No responses yet";

    const x = stats.got_it;

    const isFast = stats.fast > x / 3;
    const isLost = stats.lost > x / 3;
    const isBoring = stats.boring > x / 2;

    if (isFast && isLost && isBoring)
      return "⚠️ Mixed signals: confusion, fast pace, and disengagement";

    if (isFast && isLost)
      return "⚠️ Students are confused and pace is fast";

    if (isLost && isBoring)
      return "⚠️ Students confused and disengaged";

    if (isFast && isBoring)
      return "⚠️ Fast pace and low engagement";

    if (isLost) return "⚠️ Students are confused";
    if (isFast) return "⚠️ Pace is too fast";
    if (isBoring) return "⚠️ Students are disengaged";

    return "✅ Students are following well";
  };

  const getSessionInsight = () => {
    if (!summary) return "";

    const total =
      summary.overall.lost +
      summary.overall.fast +
      summary.overall.got_it +
      summary.overall.boring;

    if (total === 0) return "No session data";

    const lost = Math.round((summary.overall.lost / total) * 100);
    const fast = Math.round((summary.overall.fast / total) * 100);
    const boring = Math.round((summary.overall.boring / total) * 100);

    if (lost >= 40 && fast >= 40)
      return `⚠️ ${lost}% confused & ${fast}% felt pace fast`;

    if (lost >= 40) return `⚠️ ${lost}% confused overall`;
    if (fast >= 40) return `⚠️ ${fast}% felt pace fast`;
    if (boring >= 40) return `⚠️ ${boring}% disengaged`;

    return "✅ Overall session was effective";
  };

  const pieData = stats && {
    labels: ["Lost", "Fast", "Got It", "Boring"],
    datasets: [
      {
        data: [stats.lost, stats.fast, stats.got_it, stats.boring],
        backgroundColor: ["#ff4d4d", "#ffa500", "#4caf50", "#9e9e9e"]
      }
    ]
  };

  const overallPieData = summary && {
    labels: ["Lost", "Fast", "Got It", "Boring"],
    datasets: [
      {
        data: [
          summary.overall.lost,
          summary.overall.fast,
          summary.overall.got_it,
          summary.overall.boring
        ],
        backgroundColor: ["#ff4d4d", "#ffa500", "#4caf50", "#9e9e9e"]
      }
    ]
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Teacher Dashboard</h2>

        <button onClick={createSession}>Create Session</button>

        <div>
          <button className="secondary-btn" onClick={refreshSession}>Refresh</button>
          <button className="secondary-btn" onClick={endTopic}>End Topic</button>
          <button onClick={endSession}>End Session</button>
        </div>

        {sessionId && <h3>Session ID: {sessionId}</h3>}

        {stats && (
          <div className="stats">
            <p>😕 Lost: {stats.lost}</p>
            <p>⚡ Fast: {stats.fast}</p>
            <p>✅ Got It: {stats.got_it}</p>
            <p>😴 Boring: {stats.boring}</p>

            {pieData && (
              <div className="chart">
                <Pie data={pieData} />
              </div>
            )}

            <p className="live-insight">{getInsight()}</p>
          </div>
        )}
      </div>

      {summary && (
        <div className="card">
          <h3>Session Overview</h3>

          <p className="session-insight">{getSessionInsight()}</p>

          {overallPieData && (
            <div className="chart">
              <Pie data={overallPieData} />
            </div>
          )}

          {summary.topics.map((t, i) => {
            const topicData = {
              labels: ["Lost", "Fast", "Got It", "Boring"],
              datasets: [
                {
                  data: [t.lost, t.fast, t.got_it, t.boring],
                  backgroundColor: ["#ff4d4d", "#ffa500", "#4caf50", "#9e9e9e"]
                }
              ]
            };

            return (
              <div key={i}>
                <h4>Topic {i + 1}</h4>
                <div className="chart">
                  <Pie data={topicData} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Teacher;