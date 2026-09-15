import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="page">
      <div className="dashboard-hero">
        <h1>🌾 Krishi Mithra</h1>
        <p>Welcome, Farmer</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>🌾 Active Farm</h3>
          <p>Paddy - Cultivation Stage</p>
        </div>

        <div className="dashboard-card">
          <h3>🌦 Weather Alert</h3>
          <p>Rain chance 60% tomorrow</p>
        </div>

        <div className="dashboard-card">
          <h3>📈 Pending Tasks</h3>
          <p>5 tasks need attention</p>
        </div>

        <div className="dashboard-card">
          <h3>💰 Profit Estimate</h3>
          <p>₹80,000 - ₹1,20,000</p>
        </div>
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <button>Start New Farm Plan</button>
        <button>Continue Farming Journey</button>
        <button>Open AI Assistant</button>
        <button>Check Marketplace</button>
        <br />
        <br />
        <Link to="/">Back Home</Link>
      </div>
    </div>
  );
}

export default Dashboard;