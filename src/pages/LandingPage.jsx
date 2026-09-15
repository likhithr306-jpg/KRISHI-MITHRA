function LandingPage({ onGetStarted }) {
  const scrollToFeatures = () => {
    document.getElementById("features-section").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <section className="landing-hero">
        <div className="landing-bg"></div>

        <nav className="landing-nav">
          <div className="landing-logo">
            Krishi<span>Mithra</span>
          </div>
        </nav>

        <div className="landing-content">
          <p className="landing-eyebrow">🌾 India’s Smart Agriculture Ecosystem</p>

          <h1>
            Krishi Mithra
            <em> From Seed to Sale.</em>
          </h1>

          <p>
            A complete digital farming companion that helps farmers with crop
            planning, weather guidance, soil intelligence, AI assistance,
            equipment support, marketplace access, and profit tracking.
          </p>

          <div>
            <button onClick={onGetStarted}>Get Started</button>
            <button className="secondary-btn" onClick={scrollToFeatures}>Explore Features</button>
          </div>

          <div className="landing-stats">
            <div>
              <strong>4</strong>
              <span>Farm Stages</span>
            </div>

            <div>
              <strong>8+</strong>
              <span>Smart Modules</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Assistant</span>
            </div>
          </div>
        </div>
      </section>

      <main className="landing-main" id="features-section">
        <p className="section-label">Platform Modules</p>
        <h2>Everything a farmer needs in one place</h2>

        <div className="landing-grid">
          <Feature icon="🌱" title="Crop Intelligence" text="Recommends suitable crops based on soil, district, season, and water availability." />
          <Feature icon="🌦" title="Weather Intelligence" text="Provides weather alerts and farming suggestions based on rainfall and climate." />
          <Feature icon="🧪" title="Soil Intelligence" text="Helps understand soil type, fertility, pH, and crop suitability." />
          <Feature icon="🤖" title="AI Farming Assistant" text="Guides farmers through setup, cultivation, harvest, and sale." />
          <Feature icon="🚜" title="Rental Hub" text="Supports future tractor, harvester, sprayer, and equipment rentals." />
          <Feature icon="🛒" title="Marketplace" text="Helps farmers sell crops directly or through auction." />
          <Feature icon="📈" title="Market Intelligence" text="Tracks crop demand, price trends, and selling opportunities." />
          <Feature icon="🏛" title="Government Schemes" text="Shows subsidies, crop insurance, PM-KISAN, and loan support." />
        </div>
      </main>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="landing-card">
      <div className="landing-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default LandingPage;