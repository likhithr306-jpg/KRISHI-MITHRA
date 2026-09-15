import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-circles"></div>

        <Navbar />

        <div className="hero-content">
          <p className="hero-eyebrow">🌾 India’s Smart Agriculture Ecosystem</p>

          <h1 className="hero-title">
            Krishi Mithra
            <em>From Seed to Sale.</em>
          </h1>

          <p className="hero-sub">
            A complete digital farming companion for crop planning, weather
            intelligence, soil guidance, AI assistance, equipment rental,
            marketplace support, and profit tracking.
          </p>

          <div className="hero-actions">
            <Link to="/login">
              <button>Get Started</button>
            </Link>

            <Link to="/dashboard">
              <button className="secondary-btn">View Demo</button>
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <span className="stat-num">4</span>
              <span className="stat-label">Farm Stages</span>
            </div>

            <div>
              <span className="stat-num">8+</span>
              <span className="stat-label">Smart Modules</span>
            </div>

            <div>
              <span className="stat-num">24/7</span>
              <span className="stat-label">Assistant</span>
            </div>
          </div>
        </div>
      </section>

      <main className="main-section">
        <p className="section-label">Platform Modules</p>
        <h2>Everything a farmer needs in one place</h2>

        <div className="features-grid">
          <FeatureCard
            icon="🌱"
            title="Crop Intelligence"
            text="Get crop recommendations based on soil, district, season, rainfall, and water availability."
          />

          <FeatureCard
            icon="🌦"
            title="Weather Intelligence"
            text="Receive weather alerts and farming advice such as avoiding fertilizer before rain."
          />

          <FeatureCard
            icon="🧪"
            title="Soil Intelligence"
            text="Understand soil type, pH, fertility needs, and suitable crops."
          />

          <FeatureCard
            icon="🤖"
            title="AI Farming Assistant"
            text="Stage-wise guidance from setup, cultivation, harvest, and sale."
          />

          <FeatureCard
            icon="🚜"
            title="Rental Hub"
            text="Rent tractors, harvesters, sprayers, seeders, and other farm equipment."
          />

          <FeatureCard
            icon="🛒"
            title="Farmer Marketplace"
            text="Sell crops directly to buyers or through auction without middlemen."
          />

          <FeatureCard
            icon="📈"
            title="Market Intelligence"
            text="Track crop demand, price trends, and selling opportunities."
          />

          <FeatureCard
            icon="🏛"
            title="Government Schemes"
            text="View subsidies, crop insurance, PM-KISAN, loans, and eligibility."
          />
        </div>
      </main>
    </>
  );
}

export default Home;