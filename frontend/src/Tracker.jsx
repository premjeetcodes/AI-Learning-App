import { useEffect, useState } from "react";
import { loadLocal, saveLocal } from "./offline";
import { loadCloud, saveCloud } from "./api";
import "./Tracker.css";

const TOPICS = [
  "JavaScript Basics",
  "Async JavaScript",
  "Node.js Fundamentals",
  "Express Basics",
  "REST APIs",
  "JWT Authentication",
  "Error Handling",
  "Database Integration",
  "Clean Architecture",
  "API Testing",
  "TypeScript Basics",
  "TypeScript + Express",
  "Backend Mini Project",
  "Finalize Mini Project",
  "GitHub Push",
  "Intro to LLMs",
  "Tokens & Context",
  "Prompt Engineering",
  "System vs User Prompts",
  "OpenAI API",
  "LLM Error Handling",
  "Structured Output",
  "Function Calling",
  "Embeddings",
  "Vector Databases",
  "Vector DB Hands-on",
  "RAG Architecture",
  "PDF Parsing",
  "PDF Chatbot (1)",
  "PDF Chatbot (2)",
  "Prompt Improvements",
  "Cost Optimization",
  "Logging",
  "Security",
  "RAG Push",
  "API Versioning",
  "Rate Limiting",
  "Background Jobs",
  "Webhooks",
  "SQL + Vector DB",
  "Resume Analyzer",
  "Resume Logic",
  "Admin APIs",
  "File Uploads",
  "Validation",
  "Docker",
  "Dockerize",
  "Cloud",
  "Deploy",
  "Performance",
  "Monitoring",
  "Support Bot",
  "Chat History",
  "Context Memory",
  "Multi-tenancy",
  "RBAC",
  "Redis",
  "API Docs",
  "Security Review",
  "Production Checklist",
  "GitHub Cleanup",
  "AI Resume",
  "LinkedIn",
  "LLM Interviews",
  "System Design",
  "Mock Interviews",
  "Job Apply",
  "Job Apply",
  "Job Apply",
  "Job Apply",
  "Networking",
  "Fix Gaps",
  "Advanced RAG",
  "Advanced RAG",
  "Advanced RAG",
  "Project Polish",
  "Docs",
  "Interview Rev",
  "Interview Rev",
  "Follow-ups",
  "Follow-ups",
  "Follow-ups",
  "Review",
  "Review",
  "Final Apply",
  "Final Apply",
  "Final Review",
  "Backup Plan",
  "Roadmap",
  "Done 🎉"
];

export default function Tracker() {
  const [days, setDays] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Phases");
  const [hoursInput, setHoursInput] = useState({});

  useEffect(() => {
    const local = loadLocal();
    if (local.length) {
      setDays(local);
    } else {
      const defaultDays = Array(90).fill(null).map((_, i) => ({
        topic: TOPICS[i % TOPICS.length],
        status: "Not Started",
        hours: 0,
        notes: ""
      }));
      setDays(defaultDays);
      saveLocal(defaultDays);
    }
  }, []);

  async function sync() {
    const token = localStorage.getItem("token");
    if (!navigator.onLine || !token) return;

    try {
      await saveCloud(token, days);
      alert("Synced to cloud successfully!");
    } catch (err) {
      alert("Sync failed: " + err.message);
    }
  }

  function update(i, key, val) {
    const copy = [...days];
    copy[i] = { ...copy[i], [key]: val };
    setDays(copy);
    saveLocal(copy);
  }

  function logout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  const filteredDays = days.filter((d, i) => {
    const matchesSearch = d.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All Phases" || d.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    completed: days.filter(d => d.status === "Completed").length,
    inProgress: days.filter(d => d.status === "In Progress").length,
    notStarted: days.filter(d => d.status === "Not Started").length,
    totalHours: days.reduce((sum, d) => sum + (parseInt(d.hours) || 0), 0),
    progressPercent: Math.round((days.filter(d => d.status === "Completed").length / days.length) * 100)
  };

  return (
    <div className="tracker-container">
      {/* Header */}
      <header className="tracker-header">
        <div className="header-content">
          <div className="header-title">
            <h1>🚀 AI + LLM + APIs + Backend</h1>
            <p className="subtitle">90-Day SQLite Tracker</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-label">Progress</span>
              <span className="stat-value">{stats.progressPercent}%</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{stats.completed}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Hours</span>
              <span className="stat-value">{stats.totalHours}</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={sync} className="btn-sync">📤 Sync to Cloud</button>
          <button onClick={logout} className="btn-logout">🚪 Logout</button>
        </div>
      </header>

      {/* Progress Chart */}
      <div className="progress-section">
        <div className="progress-chart">
          <div className="chart-title">Learning Progress</div>
          <svg viewBox="0 0 200 200" className="progress-ring">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(100, 200, 255, 0.1)"
              strokeWidth="12"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="12"
              strokeDasharray={`${(stats.progressPercent / 100) * 565.48} 565.48`}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64c8ff" />
                <stop offset="100%" stopColor="#5ba3ff" />
              </linearGradient>
            </defs>
            <text x="100" y="100" textAnchor="middle" dy="0.3em" className="chart-percentage">
              {stats.progressPercent}%
            </text>
          </svg>
        </div>

        <div className="status-breakdown">
          <div className="status-item completed">
            <div className="status-color"></div>
            <div className="status-info">
              <span className="status-name">Completed</span>
              <span className="status-count">{stats.completed} days</span>
            </div>
          </div>
          <div className="status-item inprogress">
            <div className="status-color"></div>
            <div className="status-info">
              <span className="status-name">In Progress</span>
              <span className="status-count">{stats.inProgress} days</span>
            </div>
          </div>
          <div className="status-item notstarted">
            <div className="status-color"></div>
            <div className="status-info">
              <span className="status-name">Not Started</span>
              <span className="status-count">{stats.notStarted} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="controls-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search topic"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters">
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All Phases</option>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <button className="btn-export">📊 Export DB</button>
          <button className="btn-ai">✨ AI Summary</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="tracker-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Topic</th>
              <th>Status</th>
              <th>Hrs</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredDays.map((d, originalIdx) => {
              const actualIdx = days.indexOf(d);
              return (
                <tr key={actualIdx} className={`status-${d.status.toLowerCase().replace(" ", "-")}`}>
                  <td className="day-cell">{actualIdx + 1}</td>
                  <td className="topic-cell">{d.topic}</td>
                  <td className="status-cell">
                    <select
                      value={d.status}
                      onChange={(e) => update(actualIdx, "status", e.target.value)}
                      className="status-select"
                    >
                      <option>Not Started</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </td>
                  <td className="hours-cell">
                    <input
                      type="number"
                      min="0"
                      value={d.hours || 0}
                      onChange={(e) => update(actualIdx, "hours", e.target.value)}
                      className="hours-input"
                    />
                  </td>
                  <td className="notes-cell">
                    <textarea
                      value={d.notes}
                      onChange={(e) => update(actualIdx, "notes", e.target.value)}
                      placeholder="Add notes..."
                      className="notes-input"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
