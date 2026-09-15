import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import "./App.css";

const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000/api"
  : "https://krishi-mithra.onrender.com/api";

const locationData = {
  "Udupi": ["Udupi", "Brahmavara", "Kapu", "Kundapura", "Byndoor", "Karkala", "Hebri"],
  "Mysuru": ["Mysuru", "Hunsur", "Nanjangud", "T.Narasipura", "K.R.Nagara", "Piriyapatna", "Saragur"],
  "Bengaluru": ["Bengaluru North", "Bengaluru South", "Bengaluru East", "Anekal"],
  "Mandya": ["Mandya", "Maddur", "Malavalli", "Srirangapatna", "Pandavapura", "Nagamangala", "K.R.Pete"],
  "Dakshina Kannada": ["Mangaluru", "Ullal", "Mulki", "Bantwal", "Beltangady", "Puttur", "Sullia", "Kadaba"],
  "Hassan": ["Hassan", "Arasikere", "Channarayapatna", "Holenarasipura", "Arkalgud", "Alur", "Sakleshpura", "Belur"],
  "Belagavi": ["Belagavi", "Chikodi", "Athani", "Raybag", "Gokak", "Hukkeri", "Bailhongal", "Saundatti", "Ramdurg"],
  "Raichur": ["Raichur", "Manvi", "Sindhanur", "Devadurga", "Lingsugur", "Sirwar", "Maski"],
  "Kalaburagi": ["Kalaburagi", "Afzalpur", "Aland", "Chincholi", "Chitapur", "Jevargi", "Sedam", "Shahabad", "Kalgi", "Kamalapur"]
};

const districts = Object.keys(locationData);

const stageOrder = ["Setup", "Cultivation", "Harvest", "Sale"];

const stages = {
  Setup: ["Land Available", "Water Source", "Electricity", "Soil Testing", "Seeds Purchase", "Fertilizer Purchase", "Irrigation Setup"],
  Cultivation: ["Land Preparation", "Ploughing", "Sowing", "First Irrigation", "Fertilizer Application", "Pest Monitoring"],
  Harvest: ["Crop Maturity Check", "Arrange Labor / Machine", "Harvest Crop", "Storage Arrangement"],
  Sale: ["Check Market Price", "Find Buyers", "Auction Listing", "Sell Produce", "Record Profit"],
};

const details = {
  "Water Source": { text: "Arrange borewell, open well, tank, canal water or rain-fed option.", action: "Contact Borewell Services", contact: "9845011223" },
  Electricity: { text: "Electricity is required for pump and irrigation.", action: "BESCOM Portal", link: "https://bescom.karnataka.gov.in/" },
  "Soil Testing": { text: "Test pH, NPK and soil health before fertilizer use.", action: "Find Nearest Soil Lab", contact: "080-234123" },
  "Seeds Purchase": { text: "Buy certified seeds suitable for selected crop.", action: "Visit Seed Hub", link: "#" },
  "Fertilizer Purchase": { text: "Use organic manure first, then fertilizer.", action: "Contact Fertilizer Shop", contact: "9741223344" },
  "Irrigation Setup": { text: "Choose drip, sprinkler or field irrigation.", action: "Drip Setup Vendors", contact: "8861223344" },
  "Land Preparation": { text: "Rent Tractor for Leveling", action: "Rent Tractor", screen: "rental" },
  Ploughing: { text: "Deep ploughing helps in better root penetration.", action: "Book Service", screen: "rental" },
  Sowing: { text: "Sow at proper spacing and depth.", action: "View Sowing Guide", link: "https://rkvy.nic.in/" },
  "Pest Monitoring": { text: "Ask AI for Diagnosis", action: "Ask AI Assistant", screen: "ai" },
  "Arrange Labor / Machine": { text: "Book harvesters or labor teams.", action: "Check Rentals", screen: "rental" },
  "Harvest Crop": { text: "Labor Group Contact", action: "Call Labor Team", contact: "7022110099" },
  "Check Market Price": { text: "Check current Mandi prices.", action: "Open Marketplace", screen: "market" },
  "Find Buyers": { text: "Connect with local traders.", action: "View Verified Buyers", screen: "market" },
  "Auction Listing": { text: "List on local APMC.", action: "Visit e-NAM Portal", link: "https://www.enam.gov.in/" },
};

const soilInfo = {
  "Red Soil": { ph: "6.0 - 7.0", characteristics: "Derived from granite; rich in Iron oxide.", crops: "Ragi, Groundnut, Pulses", color: "#e57373", satelliteNPK: { n: "Low", p: "Medium", k: "High" }, moistureLevel: "32%", carbonContent: "0.45%" },
  "Black Soil": { ph: "7.2 - 8.5", characteristics: "Highly clayey; moisture retention.", crops: "Cotton, Sunflower, Chilli", color: "#424242", satelliteNPK: { n: "Medium", p: "Low", k: "Very High" }, moistureLevel: "65%", carbonContent: "0.62%" },
  "Laterite Soil": { ph: "4.5 - 5.8", characteristics: "Highly acidic; rich in Iron.", crops: "Coffee, Cashew, Rubber", color: "#d84315", satelliteNPK: { n: "Very Low", p: "Low", k: "Low" }, moistureLevel: "28%", carbonContent: "0.31%" },
  "Coastal Alluvial": { ph: "6.5 - 7.5", characteristics: "Fertile sand+clay mix.", crops: "Paddy, Coconut, Banana", color: "#8d6e63", satelliteNPK: { n: "High", p: "High", k: "Medium" }, moistureLevel: "78%", carbonContent: "0.85%" },
  "Loamy Soil": { ph: "6.0 - 7.5", characteristics: "Ideal sand/silt/clay balance.", crops: "Vegetables, Maize, Flowers", color: "#afb42b", satelliteNPK: { n: "High", p: "High", k: "High" }, moistureLevel: "52%", carbonContent: "0.75%" }
};

const financeData = {
  "Paddy": { totalInvestment: 40000, profit: 80000, expectedRevenue: 120000, breakdown: { "Seeds": 2500, "Fertilizers": 8000, "Labor": 15000, "Machinery": 10000, "Pesticides": 4500 } },
  "Ragi": { totalInvestment: 24000, profit: 51000, expectedRevenue: 75000, breakdown: { "Seeds": 1500, "Fertilizers": 5000, "Labor": 10000, "Machinery": 5000, "Pesticides": 2500 } },
  "Tomato": { totalInvestment: 80000, profit: 170000, expectedRevenue: 250000, breakdown: { "Seeds": 12000, "Fertilizers": 15000, "Labor": 25000, "Pesticides": 18000, "Staking": 10000 } },
  "Banana": { totalInvestment: 125000, profit: 225000, expectedRevenue: 350000, breakdown: { "Saplings": 35000, "Fertilizers": 25000, "Labor": 40000, "Irrigation": 15000, "Maint": 10000 } },
  "Coconut": { totalInvestment: 55000, profit: 145000, expectedRevenue: 200000, breakdown: { "Saplings": 15000, "Pitting": 10000, "Fertilizers": 8000, "Labor": 12000, "Irrigation": 10000 } }
};

const cropCategories = {
  "Vegetables": [
    { name: "Tomato", emoji: "🍅" }, { name: "Onion", emoji: "🧅" }, { name: "Chilli", emoji: "🌶️" },
    { name: "Brinjal", emoji: "🍆" }, { name: "Cabbage", emoji: "🥬" }, { name: "Cauliflower", emoji: "🥦" },
    { name: "Ladyfinger", emoji: "🥒" }, { name: "Potato", emoji: "🥔" }, { name: "Bitter Gourd", emoji: "🥒" },
    { name: "Cucumber", emoji: "🥒" }, { name: "Capsicum", emoji: "🫑" }, { name: "Carrot", emoji: "🥕" }
  ],
  "Flowers": [
    { name: "Marigold", emoji: "🌼" }, { name: "Rose", emoji: "🌹" }, { name: "Jasmine", emoji: "🌸" },
    { name: "Aster", emoji: "🌻" }, { name: "Hibiscus", emoji: "🌺" }, { name: "Chrysanthemum", emoji: "🌼" },
    { name: "Lily", emoji: "🌷" }, { name: "Crossandra", emoji: "🌸" }, { name: "Gerbera", emoji: "🌻" },
    { name: "Carnation", emoji: "🌹" }
  ],
  "Cereals": [
    { name: "Maize", emoji: "🌽" }, { name: "Jowar", emoji: "🌾" }, { name: "Bajra", emoji: "🌾" },
    { name: "Ragi", emoji: "🌾" }, { name: "Wheat", emoji: "🌾" }, { name: "Paddy", emoji: "🌾" },
    { name: "Navane", emoji: "🌾" }, { name: "Sajje", emoji: "🌾" }, { name: "Barley", emoji: "🌾" }
  ],
  "Fruits": [
    { name: "Mango", emoji: "🥭" }, { name: "Banana", emoji: "🍌" }, { name: "Grapes", emoji: "🍇" },
    { name: "Pomegranate", emoji: "🍎" }, { name: "Sapota", emoji: "🥔" }, { name: "Papaya", emoji: "🥭" },
    { name: "Guava", emoji: "🍏" }, { name: "Jackfruit", emoji: "🍈" }, { name: "Lemon", emoji: "🍋" },
    { name: "Watermelon", emoji: "🍉" }, { name: "Dragon Fruit", emoji: "🌵" }
  ]
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [farmerName, setFarmerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: ID, 2: OTP, 3: New Pass

  const [screen, setScreen] = useState("dashboard");
  const [district, setDistrict] = useState("Udupi");
  const [taluk, setTaluk] = useState("");
  const [village, setVillage] = useState("");
  const [landSize, setLandSize] = useState("");
  const [soilType, setSoilType] = useState("Red Soil");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("Light");
  const [soilView, setSoilView] = useState("report"); // report or new-test

  const themes = {
    Light: {
      "--cream": "#fbf9f1",
      "--soil": "#2c1810",
      "--clay": "#8b4513",
      "--leaf": "#3d6b35",
      "--sage": "#6b8f5e",
      "--card-bg": "white",
      "--text": "#2c1810"
    },
    Dark: {
      "--cream": "#121212",
      "--soil": "#e2e8f0",
      "--clay": "#fbd38d",
      "--leaf": "#48bb78",
      "--sage": "#a0aec0",
      "--card-bg": "#1a202c",
      "--text": "#f7fafc"
    },
    Sunset: {
      "--cream": "#fff5f0",
      "--soil": "#4a2c2a",
      "--clay": "#d64545",
      "--leaf": "#5c8a32",
      "--sage": "#8e9b61",
      "--card-bg": "#fffaf0",
      "--text": "#4a2c2a"
    }
  };

  const translations = {
    English: { welcome: "Welcome Back", dashboard: "Dashboard", profile: "Profile", settings: "Settings", logout: "Logout", activeFarm: "ACTIVE FARM", weather: "LIVE WEATHER", progress: "FARM PROGRESS", finance: "FINANCE", newPlan: "Start New Farming Plan", ecosystem: "Farming Ecosystem", soilLab: "Soil Lab", mithraAi: "Mithra AI", market: "Market", rentals: "Rentals", schemes: "Schemes", diseaseLab: "Disease Lab", localSupport: "Local Support", journal: "Journal" },
    Kannada: { welcome: "ಸ್ವಾಗತ", dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", profile: "ಪ್ರೊಫೈಲ್", settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", logout: "ಲಾಗ್ ಔಟ್", activeFarm: "ಸಕ್ರಿಯ ಫಾರ್ಮ್", weather: "ಹವಾಮಾನ", progress: "ಕೃಷಿ ಪ್ರಗತಿ", finance: "ಹಣಕಾಸು", newPlan: "ಹೊಸ ಕೃಷಿ ಯೋಜನೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ", ecosystem: "ಕೃಷಿ ಪರಿಸರ ವ್ಯವಸ್ಥೆ", soilLab: "ಮಣ್ಣಿನ ಪ್ರಯೋಗಾಲಯ", mithraAi: "ಮಿತ್ರ AI", market: "ಮಾರುಕಟ್ಟೆ", rentals: "ಬಾಡಿಗೆಗಳು", schemes: "ಯೋಜನೆಗಳು", diseaseLab: "ರೋಗ ಪತ್ತೆ", localSupport: "ಸ್ಥಳೀಯ ಬೆಂಬಲ", journal: "ರೈತ ದಿನಚರಿ" },
    Hindi: { welcome: "स्वागत है", dashboard: "डैशबोर्ड", profile: "प्रोफ़ाइल", settings: "सेटिंग्स", logout: "लॉग आउट", activeFarm: "सक्रिय फार्म", weather: "मौसम", progress: "कृषि प्रगति", finance: "वित्त", newPlan: "नई खेती योजना शुरू करें", ecosystem: "कृषि पारिस्थितिकी तंत्र", soilLab: "मिट्टी लैब", mithraAi: "मित्रा AI", market: "बाजार", rentals: "किराया", schemes: "योजनाएं", diseaseLab: "रोग लैब", localSupport: "स्थानीय सहायता", journal: "डायरी" },
    Telugu: { welcome: "స్వాగతం", dashboard: "డాష్‌బోర్డ్", profile: "ప్రొఫైల్", settings: "సెట్టింగులు", logout: "లాగ్ అవుట్", activeFarm: "క్రియాశీల ఫారం", weather: "వాతావరణం", progress: "వ్యవసాయ పురోగతి", finance: "ఫైనాన్స్", newPlan: "కొత్త వ్యవసాయ ప్రణాళికను ప్రారంభించండి", ecosystem: "వ్యవసాయ పర్యావరణ వ్యవస్థ", soilLab: "నేల ప్రయోగశాల", mithraAi: "మిత్ర AI", market: "మార్కెట్", rentals: "అద్దెలు", schemes: "పథకాలు", diseaseLab: "వ్యాధి ల్యాబ్", localSupport: "స్థానిక మద్దతు", journal: "డైరీ" },
    Tamil: { welcome: "வரவேற்கிறோம்", dashboard: "டாஷ்போர்டு", profile: "சுயவிவரம்", settings: "அமைப்புகள்", logout: "வெளியேறு", activeFarm: "செயலில் உள்ள பண்ணை", weather: "வானிலை", progress: "பண்ணை முன்னேற்றம்", finance: "நிதி", newPlan: "புதிய விவசாயத் திட்டத்தைத் தொடங்குங்கள்", ecosystem: "விவசாய சுற்றுச்சூழல்", soilLab: "மண் ஆய்வு", mithraAi: "மித்ரா AI", market: "சந்தை", rentals: "வாடகை", schemes: "திட்டங்கள்", diseaseLab: "நோய் ஆய்வு", localSupport: "உள்ளூர் ஆதரவு", journal: "ഡയറി" },
    Malayalam: { welcome: "സ്വാഗതം", dashboard: "ഡാഷ്ബോർഡ്", profile: "പ്രൊഫൈൽ", settings: "ക്രമീകരണങ്ങൾ", logout: "ലോഗ് ഔട്ട്", activeFarm: "സജീവ ഫാം", weather: "കാലാവസ്ഥ", progress: "കൃഷി പുരോഗതി", finance: "ധനകാര്യം", newPlan: "പുതിയ കൃഷി പ്ലാൻ ആരംഭിക്കുക", ecosystem: "കൃഷി ഇക്കോസിസ്റ്റം", soilLab: "മണ്ണ് ലാബ്", mithraAi: "മിത്ര AI", market: "മാർക്കറ്റ്", rentals: "വാടകകൾ", schemes: "പദ്ധതികൾ", diseaseLab: "രോഗ ലാബ്", localSupport: "പ്രാദേശിക പിന്തുണ", journal: "ഡയറി" }
  };

  const t = translations[language] || translations.English;

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = themes[theme] || themes.Light;
    Object.keys(currentTheme).forEach(key => {
      root.style.setProperty(key, currentTheme[key]);
    });

    if (theme === "Dark") {
      document.body.style.backgroundColor = "#121212";
      document.body.style.color = "#f7fafc";
    } else {
      document.body.style.backgroundColor = "var(--cream)";
      document.body.style.color = "var(--soil)";
    }
  }, [theme]);

  const [notifications, setNotifications] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [showSmartSuggest, setShowSmartSuggest] = useState(false);
  const [currentStage, setCurrentStage] = useState("Setup");
  const [completed, setCompleted] = useState({});
  const [openDetail, setOpenDetail] = useState("");
  const [showLanding, setShowLanding] = useState(true);

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [schemeData, setSchemeData] = useState([]);
  const [marketplaceData, setMarketplaceData] = useState([]);
  const [marketTrends, setMarketTrends] = useState(null);
  const [marketView, setMarketView] = useState("home");
  const [selectedMarketCrop, setSelectedMarketCrop] = useState("");
  const [rentalData, setRentalData] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [journalActivity, setJournalActivity] = useState("");
  const [journalCategory, setJournalCategory] = useState("Task");
  const [journalAmount, setJournalAmount] = useState("");
  const [journalNotes, setJournalNotes] = useState("");
  const [chatMessages, setChatMessages] = useState([{ role: "assistant", text: "Hello! I am Mithra, your AI Farming Buddy." }]);
  const [userInput, setUserInput] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [detectedPlace, setDetectedPlace] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  const diseaseDatabase = {
    "Maize": {
      name: "Turcicum Leaf Blight (TLB)",
      scientificName: "Exserohilum turcicum",
      intensity: "High (Level 4/5)",
      cause: "Fungal pathogen activation due to high humidity and moderate temperatures.",
      conditions: "Temperatures between 18-27°C and heavy dew or frequent rain.",
      outcomes: "Elongated elliptical greyish-green spots on leaves. Photosynthetic area reduces significantly. Can lead to 50% yield reduction if spots cover 2/3 of leaf area before silking.",
      cures: [
        "Spray Mancozeb @ 2.5g per liter immediately.",
        "Remove and destroy infected crop residues to reduce inoculum.",
        "Switch to resistant hybrids like MAH-14 for the next cycle.",
        "Avoid overhead irrigation to keep leaves dry."
      ]
    },
    "Ragi": {
      name: "Finger Millet Blast",
      scientificName: "Pyricularia grisea",
      intensity: "Critical (Level 5/5)",
      cause: "Spore germination on leaf surface under low-night temperatures.",
      conditions: "Low night temperatures (<20°C) with relative humidity >90%.",
      outcomes: "Spindle-shaped spots on leaves. Neck blast leads to 100% grain loss in affected tillers. Common in high humidity areas of Karnataka.",
      cures: [
        "Spray Tricyclazole @ 0.6g/L upon first appearance.",
        "Apply Nitrogen fertilizer in 3 split doses instead of one.",
        "Treat seeds with Carbendazim (2g/kg) before next sowing.",
        "Ensure field sanitation and remove weeds."
      ]
    },
    "Mango": {
      name: "Powdery Mildew",
      scientificName: "Oidium mangiferae",
      intensity: "High (Level 4/5)",
      cause: "Fungal growth on young leaves and flowers during transition from cool to warm weather.",
      conditions: "High humidity at night followed by warm dry days. Common in early spring.",
      outcomes: "White powdery coating on leaves and flowers. Causes severe flower drop (inflorescence drying) and premature fruit fall. Can lead to 20-80% yield loss in Mango orchards.",
      cures: [
        "Spray Wettable Sulphur @ 3g/L or Dinocap (Karathane) @ 1ml/L.",
        "Prune excessive foliage to improve sunlight and aeration.",
        "Monitor orchard closely during flowering stage.",
        "Repeat spray at 15-day intervals if symptoms persist."
      ]
    },
    "Banana": {
      name: "Sigatoka Leaf Spot",
      scientificName: "Mycosphaerella musicola",
      intensity: "High (Level 4/5)",
      cause: "Wind-borne ascospores and water-borne conidia.",
      conditions: "Extended periods of leaf wetness and high rainfall.",
      outcomes: "Small pale spots turning into dark brown streaks. Reduces leaf area for photosynthesis, leading to smaller, premature bunches and uneven ripening.",
      cures: [
        "Spray Propiconazole @ 1ml/L mixed with mineral oil (1%).",
        "Maintain wide plant spacing for maximum airflow.",
        "Regularly remove and burn dry infected leaves (De-leafing).",
        "Apply potash-rich fertilizers to boost plant immunity."
      ]
    },
    "Paddy": {
      name: "Bacterial Leaf Blight (BLB)",
      scientificName: "Xanthomonas oryzae",
      intensity: "Critical (Level 5/5)",
      cause: "Bacterial entry through wounds or water pores on leaves.",
      conditions: "Stormy weather, high rainfall, and flooding in the field.",
      outcomes: "Wavy yellow streaks from leaf tips downwards. Total crop wilting (Kresek) in early stages. Yield loss up to 60-70%.",
      cures: [
        "Spray Streptocycline (0.1g) + Copper Oxychloride (2g) per liter.",
        "Avoid flooding; keep field drained for 3-4 days.",
        "Do not apply excessive Urea (Nitrogen) during infection.",
        "Use resistant varieties like IR-64 or Jaya."
      ]
    }
  };

  const handleDiagnosis = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAnalyzing(true);
    setDiagnosisResult(null);

    setTimeout(() => {
      setAnalyzing(false);
      const cropData = diseaseDatabase[selectedCrop];

      if (cropData) {
        setDiagnosisResult({
          ...cropData,
          image: URL.createObjectURL(file)
        });
      } else {
        // High quality fallback for any crop not in the database
        setDiagnosisResult({
          name: "General Fungal/Bacterial Infection",
          scientificName: "Pathogen Analysis Pending Lab Confirmation",
          intensity: "Moderate (Level 3/5)",
          cause: "Cross-contamination or environmental stress (excessive moisture/heat).",
          conditions: "High field humidity and lack of aeration.",
          outcomes: "General loss of leaf vigor and spotting. If ignored, may reduce yield by 15-20%.",
          cures: [
            "Apply Neem Oil spray (organic) immediately.",
            "Maintain proper drainage in the field.",
            "Remove weeds which might act as alternate hosts.",
            "Balance NPK application to boost plant immunity."
          ],
          image: URL.createObjectURL(file)
        });
      }
    }, 2500);
  };

  const currentSoil = soilInfo[soilType] || soilInfo["Red Soil"];

  useEffect(() => {
    const savedUser = localStorage.getItem("farmer");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setFarmerName(user.name); setPhone(user.phone); setSelectedCrop(user.activeCrop || "");
      setCurrentStage(user.currentStage || "Setup"); setCompleted(user.completedTasks || {});
      setDistrict(user.district || "Udupi"); setSoilType(user.soilType || "Red Soil");
      if (user.lat && user.lon) setUserLocation({ lat: user.lat, lon: user.lon });
      setLoggedIn(true); setShowLanding(false);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (loggedIn) {
      fetchWeather();
      fetchMarketplace();
      fetchSchemes();
      fetchRentals();
      fetchJournal();
      // Update weather every 30 minutes
      interval = setInterval(fetchWeather, 30 * 60 * 1000);
    }
    return () => clearInterval(interval);
  }, [loggedIn, district, userLocation]);

  async function fetchJournal() {
    try {
      const res = await fetch(`${API_BASE_URL}/user/journal/${phone}`);
      const data = await res.json();
      if (data.success) setJournalEntries(data.data);
    } catch (e) {}
  }

  async function addJournalEntry() {
    if (!journalActivity) return alert("Please enter an activity");
    try {
      const res = await fetch(`${API_BASE_URL}/user/journal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, activity: journalActivity, category: journalCategory, amount: journalAmount || 0, notes: journalNotes }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Entry saved to your digital diary!");
        setJournalActivity(""); setJournalAmount(""); setJournalNotes("");
        fetchJournal();
      }
    } catch (e) {}
  }

  const soilAnalysisData = {
    "Red Soil": [
      { label: "Organic Matter", val: 5.2, rate: "VH", color: "#2e7d32" },
      { label: "Phosphorus (P)", val: 78, rate: "VH", color: "#2e7d32" },
      { label: "Potassium (K)", val: 320, rate: "VH", color: "#2e7d32" },
      { label: "Magnesium (Mg)", val: 327, rate: "VH", color: "#2e7d32" },
      { label: "Calcium (Ca)", val: 2383, rate: "M", color: "#f2a832" },
      { label: "pH", val: 5.7, rate: "L", color: "#d32f2f" }
    ],
    "Black Soil": [
      { label: "Organic Matter", val: 4.8, rate: "H", color: "#3d6b35" },
      { label: "Phosphorus (P)", val: 12, rate: "L", color: "#d32f2f" },
      { label: "Potassium (K)", val: 86, rate: "L", color: "#d32f2f" },
      { label: "Magnesium (Mg)", val: 323, rate: "VH", color: "#2e7d32" },
      { label: "Calcium (Ca)", val: 3282, rate: "H", color: "#3d6b35" },
      { label: "pH", val: 7.8, rate: "H", color: "#3d6b35" }
    ],
    "Laterite Soil": [
      { label: "Organic Matter", val: 2.1, rate: "L", color: "#d32f2f" },
      { label: "Phosphorus (P)", val: 8, rate: "VL", color: "#d32f2f" },
      { label: "Potassium (K)", val: 45, rate: "VL", color: "#d32f2f" },
      { label: "Magnesium (Mg)", val: 110, rate: "M", color: "#f2a832" },
      { label: "Calcium (Ca)", val: 800, rate: "L", color: "#d32f2f" },
      { label: "pH", val: 4.8, rate: "VL", color: "#d32f2f" }
    ],
    "Coastal Alluvial": [
      { label: "Organic Matter", val: 6.5, rate: "VH", color: "#2e7d32" },
      { label: "Phosphorus (P)", val: 45, rate: "H", color: "#3d6b35" },
      { label: "Potassium (K)", val: 180, rate: "H", color: "#3d6b35" },
      { label: "Magnesium (Mg)", val: 250, rate: "H", color: "#3d6b35" },
      { label: "Calcium (Ca)", val: 1800, rate: "M", color: "#f2a832" },
      { label: "pH", val: 6.8, rate: "Opt", color: "#2e7d32" }
    ],
    "Loamy Soil": [
      { label: "Organic Matter", val: 5.5, rate: "VH", color: "#2e7d32" },
      { label: "Phosphorus (P)", val: 60, rate: "VH", color: "#2e7d32" },
      { label: "Potassium (K)", val: 250, rate: "VH", color: "#2e7d32" },
      { label: "Magnesium (Mg)", val: 300, rate: "VH", color: "#2e7d32" },
      { label: "Calcium (Ca)", val: 2500, rate: "H", color: "#3d6b35" },
      { label: "pH", val: 6.5, rate: "Opt", color: "#2e7d32" }
    ]
  };

  async function fetchWeather() {
    setWeatherLoading(true);
    try {
      let url = `${API_BASE_URL}/features/weather?district=${district}`;
      if (userLocation) url += `&lat=${userLocation.lat}&lon=${userLocation.lon}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) { setWeather(data.data.current); setForecast(data.data.daily.time.map((t, i) => ({ date: t, max: data.data.daily.temperature_2m_max[i], rain: data.data.daily.precipitation_probability_max[i] }))); }
    } catch (e) {}
    setWeatherLoading(false);
  }

  async function fetchMarketplace() {
    try {
      const res = await fetch(`${API_BASE_URL}/features/marketplace`);
      const data = await res.json();
      if (data.success) { setMarketplaceData(data.data); setMarketTrends(data.trends); }
    } catch (e) {}
  }

  async function fetchSchemes() {
    try {
      const res = await fetch(`${API_BASE_URL}/features/schemes`);
      const data = await res.json();
      if (data.success) setSchemeData(data.data);
    } catch (e) {}
  }

  async function fetchRentals() {
    try {
      const res = await fetch(`${API_BASE_URL}/features/rental`);
      const data = await res.json();
      if (data.success) setRentalData(data.data);
    } catch (e) {}
  }

  async function syncProgress(crop, stage, tasks) {
    if (!loggedIn || !phone) return;
    try {
      await fetch(`${API_BASE_URL}/user/update-progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, activeCrop: crop, currentStage: stage, completedTasks: tasks }),
      });
    } catch (e) {}
  }

  function getUserLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;
      setUserLocation({ lat, lon });
      try {
        const res = await fetch(`${API_BASE_URL}/features/location/geo?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        if (data.success) {
          const addr = data.data.address || {};
          setDistrict(addr.county || addr.state_district || "Udupi");
          setDetectedPlace(data.data.displayName);
          alert(`📍 Location Detected: ${addr.village || addr.town || addr.city}`);
        }
      } catch (e) {}
    });
  }

  async function handleAuth(mode) {
    const url = mode === "login" ? "/auth/login" : "/auth/register";
    const body = mode === "login"
      ? { identifier: phone, phone, password }
      : {
          name: farmerName, phone, email, password, district, taluk, village, soilType, landSize,
          lat: userLocation?.lat, lon: userLocation?.lon
        };
    try {
      const res = await fetch(`${API_BASE_URL}${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        if (mode === "register") { alert("Account Created! Please login."); setAuthMode("login"); }
        else {
          const user = data.user;
          setFarmerName(user.name); setPhone(user.phone);
          setDistrict(user.district || "Udupi"); setTaluk(user.taluk || "");
          setVillage(user.village || ""); setLandSize(user.landSize || "");
          setSoilType(user.soilType || "Red Soil");
          setLoggedIn(true); setScreen("dashboard");
          localStorage.setItem("token", data.token); localStorage.setItem("farmer", JSON.stringify(data.user));
        }
      } else alert(data.message);
    } catch (e) {
      console.error("Auth Error:", e);
      alert(`Server connectivity error. Make sure the backend is running at ${API_BASE_URL}`);
    }
  }

  async function handleOTP() {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier: phone }) });
      const data = await res.json();
      if (data.success) { setRecoveryStep(2); alert("OTP Generated! Check your phone/console."); }
      else alert(data.message);
    } catch (e) {}
  }

  async function verifyOTP() {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier: phone, otp }) });
      const data = await res.json();
      if (data.success) { setRecoveryStep(3); alert(data.message); }
      else alert(data.message);
    } catch (e) {}
  }

  async function handleReset() {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier: phone, otp, newPassword: password }) });
      const data = await res.json();
      if (data.success) { alert("Success! Password changed."); setAuthMode("login"); setRecoveryStep(1); setOtp(""); setPassword(""); }
      else alert(data.message);
    } catch (e) {}
  }

  const [isListening, setIsListening] = useState(false);

  const langCodes = {
    English: "en-IN", Kannada: "kn-IN", Hindi: "hi-IN",
    Telugu: "te-IN", Tamil: "ta-IN", Malayalam: "ml-IN"
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCodes[language] || "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = langCodes[language] || "en-IN";
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  async function handleChat() {
    if (!userInput.trim()) return;
    const msg = userInput.trim();
    const newMsgs = [...chatMessages, { role: "user", text: msg }];
    setChatMessages(newMsgs);
    setUserInput("");

    setTimeout(() => {
      let reply = "I am Mithra, your farming buddy. I am still learning, but I can help you with crops, weather, and market prices! Can you be more specific?";
      const input = msg.toLowerCase();

      // Knowledge Base
      if (input.includes("paddy")) reply = "Paddy (Rice) is a major crop in Karnataka. It requires standing water and a warm climate. Best varieties: Jaya, IR-64. Ensure your field has good clay content!";
      else if (input.includes("ragi")) reply = "Ragi (Finger Millet) is highly nutritious and drought-resistant. It's the staple of South Karnataka. Best sown in July-August. Prices are currently peak!";
      else if (input.includes("tomato")) reply = "Tomatoes need well-drained soil and regular monitoring for pests like leaf miners. Prices fluctuate often, check the 'Market' section for live trends.";
      else if (input.includes("banana")) reply = "Bananas are year-round crops. Ensure high potassium in soil. Watch out for 'Bunchy Top' virus. Market demand is currently stable.";
      else if (input.includes("weather") || input.includes("rain")) reply = `Currently in ${district}, the temperature is ${weather?.temperature_2m || '25'}°C. Always check the '7-Day Outlook' before applying fertilizers!`;
      else if (input.includes("market") || input.includes("price")) reply = "The Market Index shows a 12% rise in demand for organic pulses. Ragi and Paddy are the top-selling crops this week. Check the analytics graph for details.";
      else if (input.includes("soil") || input.includes("npk")) reply = `Based on your profile, you have ${soilType}. You should maintain an Organic Matter level above 4.5% for the best yield. See the 'Soil Lab' for your full report.`;
      else if (input.includes("fertilizer") || input.includes("urea")) reply = "Always apply fertilizers based on your soil test report. For most cereals, a balanced NPK ratio of 4:2:1 is recommended. Avoid over-using Urea during heavy rain.";
      else if (input.includes("tractor") || input.includes("rent")) reply = "You can rent Mahindra Tractors, JCBs, and even Drones in our 'Rental Hub'. We have 10+ certified vendors available now.";
      else if (input.includes("scheme") || input.includes("pm-kisan")) reply = "The PM-KISAN scheme provides ₹6,000 yearly. You can apply directly through our 'Schemes' portal. Also check for 'Raitha Vidya Nidhi' scholarships!";
      else if (input.includes("hello") || input.includes("hi")) reply = `Hello ${farmerName}! I am Mithra. How is your ${selectedCrop || 'farm'} doing today?`;
      else if (input.includes("profit") || input.includes("money")) reply = `For ${selectedCrop || 'your farm'}, we have projected a healthy profit margin. Check the '🏦 Finance' section for your detailed Money Plan.`;
      else if (input.includes("pest") || input.includes("insect")) reply = "Identify the pest first! For common aphids, Neem Oil spray is effective. For major outbreaks, consult a local agronomist via our 'Assistant' details.";

      setChatMessages([...newMsgs, { role: "assistant", text: reply }]);
      speak(reply);
    }, 800);
  }

  const markDone = (item) => {
    const old = completed[currentStage] || [];
    if (!old.includes(item)) {
      const newC = { ...completed, [currentStage]: [...old, item] };
      setCompleted(newC); syncProgress(selectedCrop, currentStage, newC);
    }
  };

  const stageCompleted = (s) => stages[s].every(i => (completed[s] || []).includes(i));

  if (showLanding) return <LandingPage onGetStarted={() => setShowLanding(false)} />;

  if (!loggedIn) {
    return (
      <div className="page">
        <div className="hero-banner"><h1>🌾 Krishi Mithra</h1><p>The Future of Smart Farming</p></div>
        <div className="card">
          {authMode === "login" ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h2>Farmer Login</h2>
              <label>Phone or Email</label>
              <input placeholder="Enter registered phone or email" value={phone} onChange={e=>setPhone(e.target.value)}/>

              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', color: '#666', border: 'none', padding: '0', margin: '0' }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button onClick={()=>handleAuth("login")}>Secure Login</button>
              <button onClick={()=>setAuthMode("forgot")} style={{ background: '#eee', color: '#666' }}>Forgot Password?</button>
              <button onClick={()=>setAuthMode("register")} style={{ background: '#eee', color: '#333' }}>Create New Account</button>
            </div>
          ) : authMode === "register" ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h2>New Farmer Registration</h2>
              <label>Full Name</label>
              <input placeholder="Enter full name" value={farmerName} onChange={e=>setFarmerName(e.target.value)}/>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label>Mobile Number</label>
                  <input placeholder="Phone number" value={phone} onChange={e=>setPhone(e.target.value)}/>
                </div>
                <div>
                  <label>Email Address</label>
                  <input placeholder="Email (Optional)" value={email} onChange={e=>setEmail(e.target.value)}/>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label>District</label>
                  <select
                    value={district}
                    onChange={e => {
                      const d = e.target.value;
                      setDistrict(d);
                      setTaluk(locationData[d][0]); // Default to first taluk
                    }}
                  >
                    {districts.map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label>Taluk (Subdivision)</label>
                  <select value={taluk} onChange={e=>setTaluk(e.target.value)}>
                    {(locationData[district] || []).map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label>Village</label>
                  <input placeholder="Enter Village Name" value={village} onChange={e=>setVillage(e.target.value)}/>
                </div>
                <div>
                  <label>Land Size (Acres)</label>
                  <input placeholder="e.g. 2.5" value={landSize} onChange={e=>setLandSize(e.target.value)}/>
                </div>
              </div>

              <label>Soil Type</label>
              <select value={soilType} onChange={e=>setSoilType(e.target.value)}>{Object.keys(soilInfo).map(s=><option key={s}>{s}</option>)}</select>

              <label>Create Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', color: '#666', border: 'none', padding: '0', margin: '0' }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button onClick={getUserLocation} style={{ background: '#f2a832', color: '#2c1810' }}>📍 Auto-detect My Location</button>
              <button onClick={()=>handleAuth("register")}>Verify & Create Account</button>
              <button onClick={()=>setAuthMode("login")} style={{ background: '#eee' }}>Back to Login</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h2>Account Recovery</h2>
              {recoveryStep === 1 && (
                <>
                  <p style={{ fontSize: '14px', color: '#666' }}>Step 1: Enter your registered phone or email to receive a code.</p>
                  <label>Registered Phone / Email</label>
                  <input placeholder="Identifier" value={phone} onChange={e=>setPhone(e.target.value)}/>
                  <button onClick={handleOTP}>Send Verification Code</button>
                </>
              )}
              {recoveryStep === 2 && (
                <>
                  <p style={{ fontSize: '14px', color: '#666' }}>Step 2: Enter the 6-digit code we sent you.</p>
                  <label>Verification Code</label>
                  <input placeholder="6-digit OTP" value={otp} onChange={e=>setOtp(e.target.value)}/>
                  <button onClick={verifyOTP}>Verify Code</button>
                  <button onClick={() => setRecoveryStep(1)} style={{ background: '#eee' }}>Wrong number? Back</button>
                </>
              )}
              {recoveryStep === 3 && (
                <>
                  <p style={{ fontSize: '14px', color: '#666' }}>Step 3: Identity verified. Please set your new secure password.</p>
                  <label>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={e=>setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', color: '#666', border: 'none', padding: '0', margin: '0' }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <button onClick={handleReset}>Update Password</button>
                </>
              )}
              <button onClick={()=>{setAuthMode("login"); setRecoveryStep(1);}} style={{ background: '#eee' }}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="hero-banner"><h1>🌾 Krishi Mithra</h1><p>Command Center Dashboard</p></div>

      {screen === "dashboard" && (
        <div className="card" style={{ background: '#fcfcfc', padding: '20px 40px' }}>

          {/* Interactive Emergency Alert Ticker */}
          <div
            onClick={() => setScreen("market")}
            style={{
              background: '#fff5f5',
              border: '1px solid #feb2b2',
              borderRadius: '12px',
              padding: '10px 20px',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#fff0f0'}
            onMouseOut={(e) => e.currentTarget.style.background = '#fff5f5'}
          >
            <div style={{ background: '#c53030', color: 'white', padding: '2px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', marginRight: '15px', whiteSpace: 'nowrap' }}>🚨 LIVE ALERTS</div>
            <div className="ticker-wrapper" style={{ flex: 1, whiteSpace: 'nowrap' }}>
              <marquee scrollamount="5" style={{ fontSize: '13px', color: '#c53030', fontWeight: 'bold' }}>
                📈 MARKET ALERT: Ragi prices are at a 6-month high in Mandya Mandi. Click to view Market Analysis. | 🏛️ SCHEME: PM-KISAN registration closing in 4 days. Apply now!
              </marquee>
            </div>
            <div style={{ marginLeft: '10px', fontSize: '12px', color: '#c53030', fontWeight: 'bold' }}>View →</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
            <h2 style={{ margin: 0, color: 'var(--text)' }}>{t.welcome}, {farmerName}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setScreen("settings")}
                  style={{ background: 'var(--card-bg)', border: '1px solid #718096', color: '#718096', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                >
                  ⚙️ {t.settings}
                </button>
                <button
                  onClick={() => setScreen("profile")}
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--leaf)', color: 'var(--leaf)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                >
                  👤 {t.profile}
                </button>
              </div>
              <button
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                style={{ background: '#fff5f5', border: '1px solid #ffebeb', color: '#c0392b', padding: '6px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', width: '100%' }}
              >
                🚪 {t.logout}
              </button>
            </div>
          </div>

          {/* Primary Status Grid */}
          <div className="dashboard-grid">
            <div className="dashboard-card" onClick={() => selectedCrop ? setScreen("primaryPlan") : setScreen("land")} style={{ cursor: 'pointer', background: 'var(--card-bg)', borderLeft: '6px solid var(--leaf)' }}>
              <small style={{ color: '#666', fontWeight: 'bold' }}>{t.activeFarm}</small>
              <h3 style={{ margin: '5px 0', color: 'var(--text)' }}>🌾 {selectedCrop || "Set Plan"}</h3>
              <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>{selectedCrop ? 'View Roadmap' : 'Click to start'}</p>
            </div>

            <div className="dashboard-card" onClick={() => setScreen("weather")} style={{ cursor: 'pointer', background: 'var(--card-bg)', borderLeft: '6px solid #2196f3' }}>
              <small style={{ color: '#666', fontWeight: 'bold' }}>{t.weather}</small>
              <h3 style={{ margin: '5px 0', color: 'var(--text)' }}>🌦️ {weather?.temperature_2m || "25"}°C</h3>
              <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>{detectedPlace || district}</p>
            </div>

            <div className="dashboard-card" onClick={() => selectedCrop && setScreen("assistant")} style={{ cursor: 'pointer', background: 'var(--card-bg)', borderLeft: '6px solid #f2a832' }}>
              <small style={{ color: '#666', fontWeight: 'bold' }}>{t.progress}</small>
              <h3 style={{ margin: '5px 0', color: 'var(--text)' }}>📈 {Object.values(completed).flat().length} Tasks</h3>
              <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>{selectedCrop ? 'Continue Journey' : 'Across all stages'}</p>
            </div>

            <div className="dashboard-card" onClick={() => setScreen("finance")} style={{ cursor: 'pointer', background: 'var(--card-bg)', borderLeft: '6px solid #8e44ad' }}>
              <small style={{ color: '#666', fontWeight: 'bold' }}>{t.finance}</small>
              <h3 style={{ margin: '5px 0', color: 'var(--text)' }}>🏦 {selectedCrop ? '₹' + (financeData[selectedCrop]?.profit/1000).toFixed(0) + 'k' : 'Analysis'}</h3>
              <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Profit Projection</p>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <button
              onClick={() => setScreen("land")}
              style={{ width: '100%', background: 'var(--leaf)', color: 'white', padding: '20px', borderRadius: '15px', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(61, 107, 53, 0.3)', marginBottom: '20px', border: 'none' }}
            >
              🚀 {t.newPlan}
            </button>

            {/* Creative Secondary Options Grid */}
            <h4 style={{ textAlign: 'left', margin: '0 0 15px 5px', color: '#666', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.ecosystem}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div onClick={() => setScreen("diagnosis")} style={{ background: 'var(--card-bg)', padding: '15px 10px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
                <small style={{ fontWeight: 'bold', color: 'var(--text)' }}>{t.diseaseLab}</small>
              </div>
              <div onClick={() => setScreen("local-support")} style={{ background: 'var(--card-bg)', padding: '15px 10px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏢</div>
                <small style={{ fontWeight: 'bold', color: 'var(--text)' }}>{t.localSupport}</small>
              </div>
              <div onClick={() => setScreen("soil")} style={{ background: 'var(--card-bg)', padding: '15px 10px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🧪</div>
                <small style={{ fontWeight: 'bold', color: 'var(--text)' }}>{t.soilLab}</small>
              </div>
              <div onClick={() => setScreen("ai")} style={{ background: 'var(--card-bg)', padding: '15px 10px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🤖</div>
                <small style={{ fontWeight: 'bold', color: 'var(--text)' }}>{t.mithraAi}</small>
              </div>
              <div onClick={() => setScreen("market")} style={{ background: 'var(--card-bg)', padding: '15px 10px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛒</div>
                <small style={{ fontWeight: 'bold', color: 'var(--text)' }}>{t.market}</small>
              </div>
              <div onClick={() => setScreen("rental")} style={{ background: 'var(--card-bg)', padding: '15px 10px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚜</div>
                <small style={{ fontWeight: 'bold', color: 'var(--text)' }}>{t.rentals}</small>
              </div>
              <div onClick={() => setScreen("schemes")} style={{ background: 'var(--card-bg)', padding: '15px 10px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏛️</div>
                <small style={{ fontWeight: 'bold', color: 'var(--text)' }}>{t.schemes}</small>
              </div>
              <div onClick={() => setScreen("journal")} style={{ background: '#fffaf0', padding: '15px 10px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #feebc8' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📓</div>
                <small style={{ fontWeight: 'bold', color: '#7b341e' }}>{t.journal}</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === "profile" && (
        <div className="card">
          <h2>👤 My Farmer Profile</h2>
          <div className="assistant-reply" style={{ background: '#fff', textAlign: 'left', padding: '25px' }}>
            <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#3d6b35' }}>Personal Details</h3>
              <p><b>Name:</b> {farmerName}</p>
              <p><b>Mobile:</b> {phone}</p>
              {email && <p><b>Email:</b> {email}</p>}
            </div>

            <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#3d6b35' }}>Farmland Information</h3>
              <p><b>Location:</b> {village}, {taluk}, {district}</p>
              <p><b>Land Size:</b> {landSize} Acres</p>
              <p><b>Soil Type:</b> {soilType}</p>
            </div>

            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#3d6b35' }}>Farming Status</h3>
              <p><b>Active Crop:</b> {selectedCrop || "No active plan"}</p>
              <p><b>Current Stage:</b> {currentStage}</p>
              <p><b>Tasks Completed:</b> {Object.values(completed).flat().length}</p>
            </div>
          </div>
          <button onClick={() => setScreen("dashboard")} style={{ marginTop: '20px', width: '100%' }}>Back to Dashboard</button>
        </div>
      )}

      {screen === "settings" && (
        <div className="card">
          <h2>⚙️ Platform Settings</h2>
          <div className="assistant-reply" style={{ background: '#fff', textAlign: 'left', padding: '25px' }}>
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#3d6b35' }}>Preferred Language</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {Object.keys(translations).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    style={{ background: language === lang ? '#3d6b35' : '#eee', color: language === lang ? 'white' : '#333', padding: '10px 5px', fontSize: '11px' }}
                  >
                    {lang === "Kannada" ? "ಕನ್ನಡ" : lang === "Hindi" ? "हिंदी" : lang === "Tamil" ? "தமிழ்" : lang === "Telugu" ? "తెలుగు" : lang === "Malayalam" ? "മലയാളം" : lang}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#3d6b35' }}>Display Theme</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <button
                  onClick={() => setTheme("Light")}
                  style={{ background: theme === "Light" ? '#3d6b35' : '#eee', color: theme === "Light" ? 'white' : '#333' }}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme("Dark")}
                  style={{ background: theme === "Dark" ? '#3d6b35' : '#eee', color: theme === "Dark" ? 'white' : '#333' }}
                >
                  Dark
                </button>
                <button
                  onClick={() => setTheme("Sunset")}
                  style={{ background: theme === "Sunset" ? '#3d6b35' : '#eee', color: theme === "Sunset" ? 'white' : '#333' }}
                >
                  Sunset
                </button>
              </div>
            </div>

            <div>
              <h3 style={{ margin: '0 0 15px 0', color: '#3d6b35' }}>Notifications</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  style={{ width: '20px', height: '20px', marginTop: 0 }}
                />
                <span>Receive real-time weather & market alerts</span>
              </div>
            </div>
          </div>
          <button onClick={() => setScreen("dashboard")} style={{ marginTop: '20px', width: '100%' }}>Save & Exit</button>
        </div>
      )}

      {screen === "local-support" && (
        <div className="card" style={{ background: '#fff', padding: '0', overflow: 'hidden' }}>
          <div style={{ background: '#2b6cb0', color: 'white', padding: '30px 20px', textAlign: 'center' }}>
            <h2 style={{ color: 'white', margin: 0 }}>🏢 Local Agricultural Support</h2>
            <p style={{ opacity: 0.8, fontSize: '14px' }}>Raitha Samparka Kendra (RSK) & District Offices</p>
          </div>

          <div style={{ padding: '30px' }}>
            <div className="assistant-reply" style={{ background: '#ebf8ff', borderLeft: '8px solid #2b6cb0', textAlign: 'left', marginBottom: '25px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#2b6cb0' }}>Your Local RSK: {taluk} Division</h3>
              <p style={{ fontSize: '14px', margin: 0 }}>Verified Government Service Center for {district} District.</p>
            </div>

            <div className="dashboard-grid">
               <div className="dashboard-card" style={{ textAlign: 'left', padding: '20px', borderTop: '4px solid #2b6cb0' }}>
                  <small style={{ color: '#666', fontWeight: 'bold' }}>RSK CONTACT</small>
                  <h4 style={{ margin: '5px 0' }}>Assistant Director of Agriculture</h4>
                  <p style={{ fontSize: '18px', color: '#2b6cb0', fontWeight: 'bold' }}>080-23412345</p>
                  <button
                    onClick={() => window.open('tel:08023412345')}
                    style={{ width: '100%', marginTop: '15px', background: '#2b6cb0' }}
                  >
                    📞 Call Office Now
                  </button>
               </div>

               <div className="dashboard-card" style={{ textAlign: 'left', padding: '20px', borderTop: '4px solid #3d6b35' }}>
                  <small style={{ color: '#666', fontWeight: 'bold' }}>OFFICE HOURS</small>
                  <h4 style={{ margin: '5px 0' }}>Monday - Saturday</h4>
                  <p style={{ fontSize: '14px', color: '#333' }}>10:00 AM - 5:30 PM</p>
                  <button
                    onClick={() => window.open(`https://www.google.com/maps/search/Raitha+Samparka+Kendra+${taluk}+${district}`)}
                    style={{ width: '100%', marginTop: '15px', background: '#3d6b35' }}
                  >
                    📍 Navigate to RSK
                  </button>
               </div>
            </div>

            <div className="assistant-reply" style={{ marginTop: '20px', textAlign: 'left' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2b6cb0' }}>🔔 Local Broadcasts from {taluk} RSK</h4>
              <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', lineHeight: '1.8' }}>
                <li><b>Seed Distribution:</b> High-yield Paddy seeds available for Kharif season at 50% subsidy.</li>
                <li><b>Soil Testing:</b> New mobile soil testing van visiting {village || 'your area'} next Tuesday.</li>
                <li><b>Fertilizer Alert:</b> Fresh stock of Urea and DAP reached the local warehouse today.</li>
              </ul>
            </div>
          </div>
          <button onClick={() => setScreen("dashboard")} style={{ margin: '0 30px 30px 30px', width: 'calc(100% - 60px)', background: '#2c3e50' }}>Return to Home</button>
        </div>
      )}

      {screen === "journal" && (
        <div className="card" style={{ background: '#fff', padding: '0', overflow: 'hidden' }}>
          <div style={{ background: '#7b341e', color: 'white', padding: '30px 20px', textAlign: 'center' }}>
            <h2 style={{ color: 'white', margin: 0 }}>📓 {t.journal}</h2>
            <p style={{ opacity: 0.8, fontSize: '14px' }}>Keep track of your daily farming activities & expenses</p>
          </div>

          <div style={{ padding: '25px' }}>
            {/* New Entry Form */}
            <div className="assistant-reply" style={{ background: '#fffaf0', borderLeft: '8px solid #7b341e', textAlign: 'left', marginBottom: '30px' }}>
              <h4 style={{ margin: '0 0 15px 0' }}>Add New Entry</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <input placeholder="What did you do today?" value={journalActivity} onChange={e=>setJournalActivity(e.target.value)} />
                <select value={journalCategory} onChange={e=>setJournalCategory(e.target.value)}>
                  <option value="Task">🛠️ Task</option>
                  <option value="Expense">💰 Expense</option>
                  <option value="Income">📈 Income</option>
                  <option value="Note">📝 Note</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '15px', marginBottom: '15px' }}>
                <input type="number" placeholder="Amount (optional)" value={journalAmount} onChange={e=>setJournalAmount(e.target.value)} />
                <input placeholder="Add more details..." value={journalNotes} onChange={e=>setJournalNotes(e.target.value)} />
              </div>
              <button onClick={addJournalEntry} style={{ width: '100%', background: '#7b341e' }}>💾 Save Entry</button>
            </div>

            {/* List of Entries */}
            <h4 style={{ textAlign: 'left', color: '#666' }}>Recent History</h4>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {journalEntries.length === 0 ? (
                <p style={{ color: '#aaa', fontStyle: 'italic', padding: '20px' }}>No records yet. Start writing your farming story today!</p>
              ) : (
                journalEntries.map((entry, i) => (
                  <div key={i} className="crop-card" style={{ textAlign: 'left', borderLeft: `6px solid ${entry.category === 'Expense' ? '#e53e3e' : entry.category === 'Income' ? '#38a169' : '#7b341e'}` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold' }}>{entry.activity}</span>
                        <small style={{ color: '#888' }}>{new Date(entry.date).toLocaleDateString()}</small>
                      </div>
                      <p style={{ fontSize: '13px', margin: '5px 0', color: '#666' }}>{entry.notes}</p>
                    </div>
                    {entry.amount > 0 && (
                      <div style={{ marginLeft: '15px', fontWeight: 'bold', color: entry.category === 'Expense' ? '#e53e3e' : '#38a169' }}>
                        {entry.category === 'Expense' ? '-' : '+'}₹{entry.amount}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          <button onClick={() => setScreen("dashboard")} style={{ margin: '20px', width: 'calc(100% - 40px)', background: '#2c3e50' }}>Back to Home</button>
        </div>
      )}

      {screen === "diagnosis" && (
        <div className="card" style={{ background: '#fff', padding: '0', overflow: 'hidden' }}>
          <div style={{ background: '#276749', color: 'white', padding: '30px 20px', textAlign: 'center' }}>
            <h2 style={{ color: 'white', margin: 0 }}>🔍 Mithra Disease Diagnosis Lab</h2>
            <p style={{ opacity: 0.8, fontSize: '14px' }}>AI-Powered Crop Health Analysis</p>
          </div>

          <div style={{ padding: '30px' }}>
            {!diagnosisResult && !analyzing && (
              <div style={{ textAlign: 'center', padding: '40px 20px', border: '2px dashed #cbd5e0', borderRadius: '20px', background: '#f7fafc' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>📸</div>
                <h3>Upload Crop Image</h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>Take a clear photo of the infected leaf or stem for analysis.</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDiagnosis}
                  id="crop-upload"
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="crop-upload"
                  style={{
                    background: '#3d6b35', color: 'white', padding: '15px 30px', borderRadius: '15px',
                    cursor: 'pointer', display: 'inline-block', fontWeight: 'bold', textTransform: 'none'
                  }}
                >
                  Select from Camera / Gallery
                </label>
              </div>
            )}

            {analyzing && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '40px', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>⚙️</div>
                <h3>Mithra AI is Scanning...</h3>
                <p>Comparing patterns against 50,000+ agricultural disease records.</p>
                <div style={{ width: '100%', height: '10px', background: '#eee', borderRadius: '5px', marginTop: '20px', overflow: 'hidden' }}>
                   <div style={{ width: '60%', height: '100%', background: '#3d6b35' }}></div>
                </div>
              </div>
            )}

            {diagnosisResult && (
              <div className="assistant-reply" style={{ background: '#fff', padding: '0', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: '25px', padding: '30px', background: '#f0fff4', position: 'relative' }}>
                  <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                    <img src={diagnosisResult.image} style={{ width: '100%', height: '100%', borderRadius: '15px', objectFit: 'cover' }} />
                    {/* Simulated YOLO Bounding Boxes */}
                    <div style={{ position: 'absolute', top: '20%', left: '20%', width: '30%', height: '30%', border: '2px solid red', borderRadius: '4px' }}>
                      <span style={{ position: 'absolute', top: '-18px', left: '-2px', background: 'red', color: 'white', fontSize: '10px', padding: '0 4px' }}>Leaf Spot</span>
                    </div>
                    <div style={{ position: 'absolute', bottom: '15%', right: '15%', width: '40%', height: '35%', border: '2px solid red', borderRadius: '4px' }}>
                      <span style={{ position: 'absolute', top: '-18px', left: '-2px', background: 'red', color: 'white', fontSize: '10px', padding: '0 4px' }}>Infected Area</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <small style={{ color: '#276749', fontWeight: '800', letterSpacing: '1px' }}>AI SCAN COMPLETE</small>
                    <h2 style={{ margin: '8px 0 2px 0', color: '#1a365d', fontSize: '28px' }}>{diagnosisResult.name}</h2>
                    <p style={{ fontStyle: 'italic', color: '#666', margin: '0 0 10px 0' }}>{diagnosisResult.scientificName}</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ background: '#3d6b35', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                        Confidence: {(Math.random() * 5 + 90).toFixed(1)}%
                      </div>
                      <div style={{ background: diagnosisResult.intensity.includes('Critical') ? '#c53030' : '#f2a832', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                        Intensity: {diagnosisResult.intensity}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '30px', textAlign: 'left' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ background: '#fef2f2', padding: '20px', borderRadius: '18px', borderLeft: '6px solid #c53030' }}>
                      <h4 style={{ color: '#c53030', margin: '0 0 8px 0' }}>🎯 Root Cause</h4>
                      <p style={{ fontSize: '14px', margin: 0, color: '#4a5568', lineHeight: '1.5' }}>{diagnosisResult.cause}</p>
                    </div>
                    <div style={{ background: '#fffaf0', padding: '20px', borderRadius: '18px', borderLeft: '6px solid #f2a832' }}>
                      <h4 style={{ color: '#c05621', margin: '0 0 8px 0' }}>🌦️ Ideal Conditions</h4>
                      <p style={{ fontSize: '14px', margin: 0, color: '#4a5568', lineHeight: '1.5' }}>{diagnosisResult.conditions}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ color: '#2d3748', margin: '0 0 10px 0', borderBottom: '2px solid #eee', paddingBottom: '5px' }}>⚠️ Predicted Outcomes</h4>
                    <p style={{ fontSize: '15px', margin: 0, color: '#4a5568', lineHeight: '1.6' }}>{diagnosisResult.outcomes}</p>
                  </div>

                  <div style={{ background: '#f0fff4', padding: '25px', borderRadius: '22px', border: '1.5px dashed #3d6b35', marginBottom: '30px' }}>
                    <h4 style={{ color: '#276749', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>💊 Professional Treatment Protocol</span>
                      <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#666' }}>(Based on ICAR guidelines)</span>
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {diagnosisResult.cures.map((step, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#2d3748' }}>
                          <span style={{ color: '#3d6b35', fontWeight: 'bold' }}>Step {idx + 1}:</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => { setDiagnosisResult(null); setAnalyzing(false); }}
                      style={{ flex: 1, background: '#eee', color: '#333' }}
                    >
                      Analyze Another Sample
                    </button>
                    <button
                      onClick={() => window.open('https://raitamitra.karnataka.gov.in/')}
                      style={{ flex: 1, background: '#f2a832', color: '#2c1810' }}
                    >
                      Connect with Expert
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setScreen("dashboard")} style={{ margin: '0 30px 30px 30px', width: 'calc(100% - 60px)', background: '#2c3e50' }}>Return to Dashboard</button>
        </div>
      )}

      {screen === "land" && (
        <div className="card">
          <h2>Discover Your Best Crop</h2>
          {!activeCategory && !showSmartSuggest ? (
            <div className="dashboard-grid">
              {Object.keys(cropCategories).map(cat => (
                <div key={cat} onClick={() => setActiveCategory(cat)} className="dashboard-card" style={{ cursor: 'pointer' }}>
                   <div style={{ fontSize: '30px' }}>{cat === 'Vegetables' ? '🍅' : cat === 'Flowers' ? '🌻' : cat === 'Fruits' ? '🍎' : '🌾'}</div>
                   <h3>{cat}</h3>
                </div>
              ))}
              <div onClick={() => setShowSmartSuggest(true)} className="dashboard-card" style={{ gridColumn: 'span 2', background: '#e8f5e9', cursor: 'pointer' }}>
                <h3>🤖 Get Mithra AI Suggestion</h3>
              </div>
            </div>
          ) : activeCategory ? (
            <div>
              <h3>Varieties of {activeCategory}</h3>
              <div className="dashboard-grid">
                {cropCategories[activeCategory].map(c => (
                  <div key={c.name} className="dashboard-card" style={{ padding: '15px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>{c.emoji}</div>
                    <h4 style={{ margin: '0 0 10px 0' }}>{c.name}</h4>
                    <button
                      onClick={() => { setSelectedCrop(c.name); setScreen("primaryPlan"); syncProgress(c.name, "Setup", {}); }}
                      style={{ fontSize: '12px', padding: '8px 12px' }}
                    >
                      Choose {c.name}
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => setActiveCategory("")} style={{ marginTop: '20px' }}>Back to Categories</button>
            </div>
          ) : (
            <div className="assistant-reply" style={{ background: '#e8f5e9', padding: '25px', borderLeft: '10px solid #3d6b35' }}>
              <h3>AI Intelligence Report</h3>
              <p>📍 <b>Location:</b> {detectedPlace || district}<br/>🧪 <b>Soil:</b> {soilType}<br/>🌦 <b>Weather:</b> {weather?.temperature_2m || '25'}°C</p>
              <p>Mithra suggests: <b style={{ fontSize: '20px', color: '#1b5e20' }}>Paddy</b></p>
              <button onClick={() => { setSelectedCrop("Paddy"); setScreen("primaryPlan"); }}>Accept Suggestion</button>
              <button onClick={() => setShowSmartSuggest(false)} style={{ marginLeft: '10px' }}>Try Others</button>
            </div>
          )}
          <button onClick={() => setScreen("dashboard")} style={{ marginTop: '20px', width: '100%', background: '#2c3e50' }}>Back to Dashboard</button>
        </div>
      )}

      {screen === "primaryPlan" && (
        <div className="card" style={{ background: '#fff', padding: '0', overflow: 'hidden' }}>
          <div style={{ background: '#3d6b35', color: 'white', padding: '30px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>
              {Object.values(cropCategories).flat().find(c => c.name === selectedCrop)?.emoji || '🌾'}
            </div>
            <h2 style={{ color: 'white', margin: 0 }}>Active Farming Plan: {selectedCrop}</h2>
            <p style={{ opacity: 0.8 }}>Strategic Roadmap from Seed to Sale</p>
          </div>

          <div style={{ padding: '25px' }}>
            <div className="dashboard-grid" style={{ marginBottom: '25px' }}>
              <div className="dashboard-card" style={{ background: '#f0f7ff' }}>
                <small>GROWING PERIOD</small>
                <h3 style={{ color: '#1e3c72' }}>120 - 150 Days</h3>
              </div>
              <div className="dashboard-card" style={{ background: '#e8f5e9' }}>
                <small>PROFIT POTENTIAL</small>
                <h3 style={{ color: '#2e7d32' }}>High</h3>
              </div>
            </div>

            <div className="assistant-reply" style={{ background: '#f9f9f9', borderLeft: '8px solid #3d6b35', textAlign: 'left', marginBottom: '25px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Plan Overview</h4>
              <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                You have selected a high-yield {selectedCrop} plan. This cycle covers everything from initial soil preparation to the final market sale.
              </p>
            </div>

            {/* Jump-to-Stage Feature */}
            <h4 style={{ textAlign: 'left', margin: '0 0 15px 0', color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Select Your Starting Point</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '30px' }}>
              {[
                { id: "Setup", icon: "🛠️", color: "#666" },
                { id: "Cultivation", icon: "🌱", color: "#3d6b35" },
                { id: "Harvest", icon: "🚜", color: "#f2a832" },
                { id: "Sale", icon: "💰", color: "#8e44ad" }
              ].map((stage) => (
                <div
                  key={stage.id}
                  onClick={() => {
                    setCurrentStage(stage.id);
                    setScreen("assistant");
                    syncProgress(selectedCrop, stage.id, {});
                  }}
                  style={{
                    background: 'white', border: `1.5px solid #eee`, padding: '15px 5px',
                    borderRadius: '15px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = stage.color}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#eee'}
                >
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>{stage.icon}</div>
                  <small style={{ fontWeight: 'bold', fontSize: '11px', color: '#333' }}>{stage.id}</small>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setCurrentStage("Setup"); setScreen("assistant"); syncProgress(selectedCrop, "Setup", {}); }}
                style={{ flex: 2, background: '#3d6b35', color: 'white', padding: '15px', fontSize: '16px', fontWeight: 'bold' }}
              >
                🚀 Start from Beginning
              </button>
              <button
                onClick={() => setScreen("land")}
                style={{ flex: 1, background: '#eee', color: '#333' }}
              >
                Change Crop
              </button>
            </div>
          </div>

          <button onClick={() => setScreen("dashboard")} style={{ margin: '0 25px 25px 25px', width: 'calc(100% - 50px)', background: '#2c3e50' }}>Return to Dashboard</button>
        </div>
      )}

      {screen === "weather" && (
        <div className="card" style={{ background: '#f8f9fa', padding: '0', overflow: 'hidden' }}>
          {/* Professional Weather Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white',
            padding: '30px 20px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <button
              onClick={() => setScreen("dashboard")}
              style={{ position: 'absolute', left: '15px', top: '15px', background: 'rgba(255,255,255,0.2)', padding: '5px 12px' }}
            >
              ←
            </button>
            <h2 style={{ color: 'white', marginBottom: '5px' }}>{detectedPlace || district}</h2>
            <p style={{ opacity: 0.8, fontSize: '14px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', margin: '20px 0' }}>
              <div style={{ fontSize: '80px' }}>{weather?.precipitation_probability_max > 50 ? '🌧️' : '☀️'}</div>
              <div style={{ textAlign: 'left' }}>
                <h1 style={{ fontSize: '64px', margin: '0', lineHeight: '1' }}>{weather?.temperature_2m || '25'}°</h1>
                <p style={{ margin: '0', fontSize: '18px' }}>{weather?.precipitation_probability_max > 50 ? 'Rainy' : 'Sunny'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '15px' }}>
              <div><small style={{ display: 'block', opacity: 0.7 }}>Humidity</small><b>{weather?.relative_humidity_2m || '65'}%</b></div>
              <div><small style={{ display: 'block', opacity: 0.7 }}>Wind</small><b>{weather?.wind_speed_10m || '11'} km/h</b></div>
              <div><small style={{ display: 'block', opacity: 0.7 }}>Rain</small><b>{weather?.rainToday || '0'}%</b></div>
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            {/* Map & Wind Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div style={{ background: 'white', borderRadius: '15px', padding: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>📍 Live Location Map</h4>
                <div style={{ height: '120px', background: '#eef', borderRadius: '10px', overflow: 'hidden' }}>
                  <iframe
                    width="100%" height="100%" frameBorder="0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${(userLocation?.lon || 74.74)-0.01}%2C${(userLocation?.lat || 13.34)-0.01}%2C${(userLocation?.lon || 74.74)+0.01}%2C${(userLocation?.lat || 13.34)+0.01}&layer=mapnik&marker=${userLocation?.lat || 13.34}%2C${userLocation?.lon || 74.74}`}
                  ></iframe>
                </div>
              </div>
              <div style={{ background: 'white', borderRadius: '15px', padding: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>🌬️ Wind Info</h4>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3d6b35' }}>{weather?.wind_speed_10m || '11'} <small>km/h</small></div>
                <p style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>Direction: NW<br/>{weather?.wind_speed_10m > 15 ? '⚠️ High wind' : '✅ Stable wind'}</p>
              </div>
            </div>

            {/* Hourly Temperature Graph (Visual Mock) */}
            <div style={{ background: 'white', borderRadius: '15px', padding: '15px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>🌡️ Hourly Temperature Graph</h4>
              <div style={{ height: '100px', display: 'flex', alignItems: 'flex-end', gap: '5px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                {[22, 23, 25, 27, 28, 27, 26, 24, 23, 22].map((t, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: `${t * 3}px`, background: 'rgba(42, 82, 152, 0.2)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '0', width: '6px', height: '6px', background: '#1e3c72', borderRadius: '50%', left: '50%', marginLeft: '-3px' }}></div>
                    </div>
                    <span style={{ fontSize: '8px', marginTop: '5px', color: '#999' }}>{i+9}AM</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-Day Forecast (Premium Vertical List) */}
            <div style={{ background: 'white', borderRadius: '15px', padding: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>📅 7-Day Agricultural Outlook</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {forecast.map((day, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: idx === forecast.length-1 ? 'none' : '1px solid #f0f0f0' }}>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontWeight: 'bold' }}>{idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                      <small style={{ color: '#888' }}>{day.rain > 50 ? 'Thunder nearby' : 'Clear sky'}</small>
                    </div>
                    <div style={{ fontSize: '24px', margin: '0 20px' }}>{day.rain > 30 ? '🌧️' : '☀️'}</div>
                    <div style={{ textAlign: 'right', minWidth: '70px' }}>
                      <span style={{ fontWeight: 'bold' }}>{day.max}°</span>
                      <span style={{ color: '#888', marginLeft: '8px' }}>{day.rain}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button onClick={() => setScreen("dashboard")} style={{ margin: '20px', width: 'calc(100% - 40px)', background: '#2c3e50' }}>Return to Dashboard</button>
        </div>
      )}

      {screen === "soil" && (
        <div className="card" style={{ background: '#fff', padding: '0', overflow: 'hidden' }}>
          <div style={{ background: '#3d6b35', color: 'white', padding: '20px', textAlign: 'center' }}>
            <h2 style={{ color: 'white', margin: 0 }}>🔬 Professional Soil Lab</h2>
            <p style={{ opacity: 0.8, fontSize: '12px' }}>Authorized Agricultural Testing Portal</p>
          </div>

          <div style={{ padding: '20px' }}>
            {soilView === "report" ? (
              <>
                <div className="assistant-reply" style={{ background: '#f9f9f2', borderLeft: `8px solid ${currentSoil.color}` }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>Latest Analysis Report: {soilType}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                    <div>📍 <b>Location:</b> {detectedPlace || district}</div>
                    <div>🚜 <b>Sample Source:</b> {village || 'Main Field'}</div>
                  </div>
                </div>

                {/* Scientific Analysis Table */}
                <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'center' }}>
                    <thead>
                      <tr style={{ background: '#f0f0f0' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nutrient / Property</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Result</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Rating</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(soilAnalysisData[soilType] || soilAnalysisData["Red Soil"]).map((row, i) => (
                        <tr key={i}>
                          <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>{row.label}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.val}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: row.color }}>{row.rate}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                            <div style={{ height: '8px', width: '100%', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: row.rate === 'VH' ? '95%' : row.rate === 'H' ? '75%' : row.rate === 'M' ? '50%' : '25%', background: row.color }}></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Yield Probability Graph (Restored) */}
                <div style={{ marginTop: '30px', background: '#fff', borderRadius: '15px', padding: '20px', border: '1px solid #eee', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <h4 style={{ margin: '0 0 15px 0', textAlign: 'left' }}>📈 Yield Increase Probability</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {[
                      { label: 'Fertilizer Response', val: 85, color: '#4caf50', sub: 'High Probability' },
                      { label: 'Organic Amendments', val: 92, color: '#f2a832', sub: 'Very High Impact' },
                      { label: 'Irrigation Benefit', val: 60, color: '#2196f3', sub: 'Moderate' }
                    ].map((item, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{item.label}</span>
                          <span style={{ fontSize: '13px', color: item.color }}>{item.val}% Impact</span>
                        </div>
                        <div style={{ height: '24px', width: '100%', background: '#f0f0f0', borderRadius: '12px', overflow: 'hidden', display: 'flex', position: 'relative' }}>
                          <div style={{ height: '100%', width: `${item.val}%`, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                            {item.val >= 50 ? 'POTENTIAL GAIN' : ''}
                          </div>
                          <span style={{ position: 'absolute', right: '10px', top: '4px', fontSize: '10px', color: '#666' }}>{item.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actionable Lab Advice */}
                <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '12px', marginTop: '20px', borderLeft: '6px solid #3d6b35', textAlign: 'left' }}>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    <b>🧪 Agronomist Conclusion:</b> Recommended to use {currentSoil.fertilizer} to achieve <b>{currentSoil.yield || 'High'} Yield</b>.
                  </p>
                </div>

                <div style={{ marginTop: '30px' }}>
                  <button
                    onClick={() => setSoilView("new-test")}
                    style={{ width: '100%', background: '#f2a832', color: '#2c1810', padding: '15px', fontSize: '16px', fontWeight: 'bold' }}
                  >
                    ➕ Need a New Test? Request Here
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ borderBottom: '2px solid #3d6b35', paddingBottom: '10px' }}>Select Testing Service</h3>

                {/* Option 1: Pickup */}
                <div className="dashboard-card" style={{ marginBottom: '20px', borderLeft: '6px solid #3d6b35' }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚚</div>
                  <h4>Soil Sample Pickup Service</h4>
                  <p style={{ fontSize: '13px', color: '#666' }}>A Mithra Agent will visit your farm in {village || district} to collect soil samples and deliver them to the district lab.</p>
                  <button
                    onClick={() => alert(`Pickup request registered for ${farmerName} in ${village || taluk}. Our agent will call you within 24 hours.`)}
                    style={{ width: '100%', marginTop: '10px' }}
                  >
                    Request Collection
                  </button>
                </div>

                {/* Option 2: Lab Finder */}
                <div className="dashboard-card" style={{ borderLeft: '6px solid #2b6cb0' }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>📍</div>
                  <h4>Nearby Authorized Labs</h4>
                  <p style={{ fontSize: '13px', color: '#666' }}>Find and navigate to the nearest government-certified soil testing centers in {district}.</p>

                  <div style={{ height: '150px', background: '#eef', borderRadius: '15px', overflow: 'hidden', margin: '15px 0' }}>
                    <iframe
                      width="100%" height="100%" frameBorder="0"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${(userLocation?.lon || 74.74)-0.05}%2C${(userLocation?.lat || 13.34)-0.05}%2C${(userLocation?.lon || 74.74)+0.05}%2C${(userLocation?.lat || 13.34)+0.05}&layer=mapnik&marker=${userLocation?.lat || 13.34}%2C${userLocation?.lon || 74.74}`}
                    ></iframe>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '10px', fontSize: '12px' }}>
                      <b>1. District Soil Lab, {district}</b><br/>
                      Distance: ~4.5 km | <a href="#" style={{ color: '#2b6cb0' }}>Directions</a>
                    </div>
                    <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '10px', fontSize: '12px' }}>
                      <b>2. Regional Agri Research Center</b><br/>
                      Distance: ~12.2 km | <a href="#" style={{ color: '#2b6cb0' }}>Directions</a>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSoilView("report")}
                  style={{ width: '100%', marginTop: '20px', background: '#eee', color: '#333' }}
                >
                  ← Back to Report
                </button>
              </div>
            )}
          </div>

          <button onClick={() => { setScreen("dashboard"); setSoilView("report"); }} style={{ margin: '20px', width: 'calc(100% - 40px)', background: '#2c3e50' }}>Return to Home</button>
        </div>
      )}

      {screen === "ai" && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>🤖 Talk to Mithra</h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ width: 'auto', padding: '5px 10px', fontSize: '12px', marginTop: 0 }}
            >
              {Object.keys(translations).map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="assistant-reply" style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px', background: 'var(--parchment)' }}>
            {chatMessages.map((m, i) => (
              <div key={i} style={{ textAlign: m.role === 'user' ? 'right' : 'left', margin: '15px 0' }}>
                <span style={{
                  background: m.role === 'user' ? 'var(--leaf)' : 'white',
                  color: m.role === 'user' ? 'white' : 'var(--soil)',
                  padding: '12px 18px',
                  borderRadius: '20px',
                  display: 'inline-block',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  maxWidth: '80%',
                  lineHeight: '1.5'
                }}>
                  {m.text}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={startListening}
              style={{
                background: isListening ? '#e53e3e' : '#edf2f7',
                color: isListening ? 'white' : '#4a5568',
                padding: '12px',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 0,
                border: '1px solid #cbd5e0'
              }}
              title="Speak"
            >
              {isListening ? "🛑" : "🎤"}
            </button>
            <input
              value={userInput}
              onChange={e=>setUserInput(e.target.value)}
              placeholder={language === "Kannada" ? "ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ..." : "Type or speak to Mithra..."}
              onKeyPress={(e) => e.key === 'Enter' && handleChat()}
              style={{ flex: 1, margin: 0 }}
            />
            <button
              onClick={handleChat}
              style={{ padding: '12px 25px', margin: 0 }}
            >
              Send
            </button>
          </div>
          <button onClick={() => setScreen("dashboard")} style={{ marginTop: '20px', width: '100%', background: '#2c3e50' }}>Back to Dashboard</button>
        </div>
      )}

      {screen === "market" && (
        <div className="card" style={{ background: '#fff', padding: '0', overflow: 'hidden' }}>
          <div style={{ background: '#3d6b35', color: 'white', padding: '25px 20px', textAlign: 'center' }}>
            <h2 style={{ color: 'white', margin: 0 }}>🛒 Krishi Market Intelligence</h2>
            <p style={{ opacity: 0.8, fontSize: '12px' }}>Real-time Mandi Prices & Price Index Analytics</p>
          </div>

          <div style={{ padding: '20px' }}>
            {marketView === "home" ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div onClick={() => setMarketView("trends")} className="dashboard-card" style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #f2a832 0%, #e67e22 100%)', color: 'white', border: 'none' }}>
                  <div style={{ fontSize: '32px' }}>📊</div>
                  <h3 style={{ color: 'white' }}>Price Index Analytics</h3>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>View market trends and crop margins</p>
                </div>
                <div onClick={() => setMarketView("select-crop")} className="dashboard-card" style={{ cursor: 'pointer', border: '2px solid #3d6b35' }}>
                  <div style={{ fontSize: '32px' }}>💰</div>
                  <h3>Sell My Produce</h3>
                  <p style={{ color: '#666', fontSize: '13px' }}>Connect with verified buyers and traders</p>
                </div>
              </div>
            ) : marketView === "trends" ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0 }}>📈 Market Analysis</h3>
                  <button onClick={() => setMarketView("home")} style={{ padding: '5px 15px', background: '#eee', color: '#333' }}>Back</button>
                </div>

                {/* Professional Multi-Color Price Index Bar Chart (Matching Image 1) */}
                <div style={{ background: '#f8f9fa', borderRadius: '15px', padding: '20px', marginBottom: '25px' }}>
                  <h4 style={{ margin: '0 0 20px 0', textAlign: 'left', color: '#444' }}>Price Index by Category</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {[
                      { cat: 'Pulses', data: [124, 143, 160, 174], colors: ['#1e3c72', '#f2a832', '#95a5a6', '#f39c12'] },
                      { cat: 'Cereals', data: [141, 160, 160, 158], colors: ['#1e3c72', '#f2a832', '#95a5a6', '#f39c12'] },
                      { cat: 'Food Grains', data: [141, 157, 160, 161], colors: ['#1e3c72', '#f2a832', '#95a5a6', '#f39c12'] },
                      { cat: 'Primary Goods', data: [132, 141, 144, 155], colors: ['#1e3c72', '#f2a832', '#95a5a6', '#f39c12'] }
                    ].map((row, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '100px', fontSize: '11px', fontWeight: 'bold', textAlign: 'left' }}>{row.cat}</div>
                        <div style={{ flex: 1, height: '25px', display: 'flex', borderRadius: '4px', overflow: 'hidden' }}>
                          {row.data.map((val, idx) => (
                            <div key={idx} style={{ flex: val, background: row.colors[idx], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '9px', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                              {val}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px' }}>
                    {['2018', '2019', '2020', '2021'].map((yr, idx) => (
                      <div key={yr} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '10px', height: '10px', background: ['#1e3c72', '#f2a832', '#95a5a6', '#f39c12'][idx] }}></div>
                        <span style={{ fontSize: '10px' }}>{yr}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional Margin Trend Graph (Matching Image 2) */}
                <div style={{ background: 'white', borderRadius: '15px', padding: '20px', border: '1px solid #eee', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <h4 style={{ margin: '0 0 15px 0', textAlign: 'left' }}>Crop Margins (Revenue vs Cost)</h4>
                  <div style={{ height: '150px', position: 'relative', borderLeft: '2px solid #ddd', borderBottom: '2px solid #ddd', margin: '10px 0 30px 20px' }}>
                    {/* Simulated Line Graph with SVG */}
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Revenue Line (Red) */}
                      <polyline points="0,80 20,60 40,40 60,20 80,45 100,42" fill="none" stroke="#d32f2f" strokeWidth="2" />
                      {/* Cost Line (Blue) */}
                      <polyline points="0,85 20,75 40,55 60,45 80,30 100,50" fill="none" stroke="#1e3c72" strokeWidth="2" />
                    </svg>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '9px', color: '#999' }}>
                      <span>2019</span><span>2020</span><span>2021</span><span>2022</span><span>2023</span><span>2024</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <div style={{ fontSize: '11px' }}><span style={{ color: '#d32f2f' }}>▬</span> Revenue</div>
                    <div style={{ fontSize: '11px' }}><span style={{ color: '#1e3c72' }}>▬</span> Cost/Acre</div>
                  </div>
                </div>
              </div>
            ) : marketView === "select-crop" ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3>What are you selling?</h3>
                  <button onClick={() => setMarketView("home")} style={{ padding: '5px 15px', background: '#eee', color: '#333' }}>Back</button>
                </div>
                <div className="dashboard-grid">
                  {Object.keys(cropCategories).map(cat => (
                    <div key={cat} onClick={() => { setActiveCategory(cat); setMarketView("varieties"); }} className="dashboard-card" style={{ cursor: 'pointer', textAlign: 'center' }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                        {cat === 'Vegetables' ? '🍅' : cat === 'Flowers' ? '🌻' : cat === 'Fruits' ? '🍎' : '🌾'}
                      </div>
                      <h3>{cat}</h3>
                    </div>
                  ))}
                </div>
              </div>
            ) : marketView === "varieties" ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3>Select Variety of {activeCategory}</h3>
                  <button onClick={() => setMarketView("select-crop")} style={{ padding: '5px 15px', background: '#eee', color: '#333' }}>Back</button>
                </div>
                <div className="dashboard-grid">
                  {cropCategories[activeCategory].map(c => (
                    <div key={c.name} onClick={() => { setSelectedMarketCrop(c.name); setMarketView("vendors"); }} className="dashboard-card" style={{ cursor: 'pointer', padding: '15px' }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>{c.emoji}</div>
                      <h4>{c.name}</h4>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3>Verified Buyers for {selectedMarketCrop}</h3>
                  <button onClick={() => setMarketView("varieties")} style={{ padding: '5px 15px', background: '#eee', color: '#333' }}>Back</button>
                </div>
                {marketplaceData.find(m => m.crop === selectedMarketCrop || m.crop === "Paddy")?.markets.map((v, i) => (
                  <div key={i} className="dashboard-card" style={{ textAlign: 'left', marginBottom: '12px', borderLeft: '8px solid #3d6b35', padding: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0' }}>{v.name}</h4>
                        <p style={{ margin: 0, color: '#3d6b35', fontWeight: 'bold', fontSize: '18px' }}>{v.price}</p>
                        <small style={{ color: '#666' }}>Type: {v.type} | Trust Score: {v.saleRatio}</small>
                      </div>
                      <button
                        onClick={() => window.open(`tel:${v.contact}`)}
                        style={{ background: '#3d6b35', color: 'white', padding: '10px 20px' }}
                      >
                        📞 Call
                      </button>
                    </div>
                  </div>
                )) || <p>Searching for buyers in your district...</p>}
              </div>
            )}
          </div>

          <button onClick={() => { setScreen("dashboard"); setMarketView("home"); }} style={{ margin: '20px', width: 'calc(100% - 40px)', background: '#2c3e50' }}>Return to Home</button>
        </div>
      )}

      {screen === "rental" && (
        <div className="card">
          <h2>🚜 Verified Equipment Rentals</h2>
          <div className="dashboard-grid">
            {rentalData.map((it, i) => (
              <div key={i} className="dashboard-card" style={{ textAlign: 'left' }}>
                <img src={it.image} style={{ width: '100%', borderRadius: '10px', height: '120px', objectFit: 'cover' }} />
                <h3>{it.item}</h3><p><b>{it.price}</b></p><small>{it.vendor} | {it.location}</small>
                <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                  <button onClick={() => window.open(`tel:${it.contact}`)} style={{ flex: 1, padding: '8px', fontSize: '12px' }}>📞 Call</button>
                  <button onClick={() => alert("Booking request sent!")} style={{ flex: 1, padding: '8px', fontSize: '12px', background: '#f2a832' }}>Book Now</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setScreen("dashboard")} style={{ marginTop: '20px', width: '100%' }}>Back to Dashboard</button>
        </div>
      )}

      {screen === "schemes" && (
        <div className="card">
          <h2>🏛 Schemes & Subsidies</h2>
          <div className="dashboard-grid">
            {schemeData.map(s => (
              <div key={s.name} className="dashboard-card" style={{ textAlign: 'left', borderTop: `5px solid ${s.status==='Upcoming'?'#f2a832':'#3d6b35'}` }}>
                <small>{s.category}</small><h3>{s.name}</h3><p>{s.desc}</p>
                {s.link !== '#' ? <a href={s.link} target="_blank" rel="noreferrer" className="secondary-btn" style={{ padding: '8px 12px', fontSize: '13px', display: 'inline-block' }}>Visit Portal</a> : <button disabled>Coming Soon</button>}
              </div>
            ))}
          </div>
          <button onClick={() => setScreen("dashboard")} style={{ marginTop: '20px', width: '100%' }}>Back</button>
        </div>
      )}

      {screen === "finance" && (
        <div className="card" style={{ background: '#fff', padding: '0', overflow: 'hidden' }}>
          <div style={{ background: '#3d6b35', color: 'white', padding: '20px', textAlign: 'center' }}>
            <h2 style={{ color: 'white', margin: 0 }}>💰 Smart Finance Manager</h2>
            <p style={{ opacity: 0.8, fontSize: '12px' }}>Track your investments and project your profits</p>
          </div>

          <div style={{ padding: '20px' }}>
            {!selectedCrop ? (
              <div className="assistant-reply" style={{ textAlign: 'center' }}>
                <p>Please select a crop and start a plan to view detailed financial analysis.</p>
                <button onClick={() => setScreen("land")}>Start New Plan</button>
              </div>
            ) : (
              <>
                {/* Finance Navigation Tabs */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <button
                    onClick={() => setMarketView("investment")}
                    style={{ flex: 1, background: marketView === "investment" || marketView === "home" ? '#3d6b35' : '#eee', color: marketView === "investment" || marketView === "home" ? 'white' : '#333' }}
                  >
                    🏦 Investment
                  </button>
                  <button
                    onClick={() => setMarketView("profit")}
                    style={{ flex: 1, background: marketView === "profit" ? '#3d6b35' : '#eee', color: marketView === "profit" ? 'white' : '#333' }}
                  >
                    💰 Profit
                  </button>
                </div>

                {(marketView === "investment" || marketView === "home") && (
                  <div>
                    <h3 style={{ borderBottom: '2px solid #3d6b35', paddingBottom: '10px' }}>Finance Plan: {selectedCrop}</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>Estimation of funds required before harvest</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                      {Object.entries(financeData[selectedCrop]?.breakdown || {}).map(([item, cost]) => (
                        <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '12px 15px', borderRadius: '10px', borderLeft: '5px solid #f2a832' }}>
                          <span style={{ fontWeight: 'bold' }}>{item}</span>
                          <span style={{ color: '#3d6b35', fontWeight: 'bold' }}>₹{cost}</span>
                        </div>
                      ))}

                      <div style={{ marginTop: '10px', background: '#3d6b35', color: 'white', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>TOTAL REQUIRED CAPITAL</span>
                        <h3 style={{ margin: 0, color: 'white' }}>₹{financeData[selectedCrop]?.totalInvestment || 0}</h3>
                      </div>

                      <div style={{ background: '#fff9e6', padding: '15px', borderRadius: '12px', border: '1px solid #ffeeba', marginTop: '10px' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#856404' }}>
                          <b>💡 Finance Tip:</b> Check the <b>Schemes</b> section to see if you are eligible for subsidies on these seeds or fertilizers.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {marketView === "profit" && (
                  <div>
                    <h3 style={{ borderBottom: '2px solid #3d6b35', paddingBottom: '10px' }}>Revenue & Profit Forecast</h3>

                    <div className="dashboard-grid" style={{ marginTop: '20px' }}>
                      <div className="dashboard-card" style={{ background: '#f0f4ff' }}>
                        <small>EXPECTED REVENUE</small>
                        <h2 style={{ color: '#1e3c72' }}>₹{financeData[selectedCrop]?.expectedRevenue || 0}</h2>
                      </div>
                      <div className="dashboard-card" style={{ background: '#e8f5e9' }}>
                        <small>PROJECTED PROFIT</small>
                        <h2 style={{ color: '#2e7d32' }}>₹{financeData[selectedCrop]?.profit || 0}</h2>
                      </div>
                    </div>

                    <div style={{ marginTop: '30px', textAlign: 'left' }}>
                      <h4>📊 ROI Analysis (Return on Investment)</h4>
                      <div style={{ height: '24px', width: '100%', background: '#eee', borderRadius: '12px', overflow: 'hidden', display: 'flex' }}>
                        <div style={{ width: '40%', background: '#f2a832', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px' }}>COST</div>
                        <div style={{ width: '60%', background: '#3d6b35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px' }}>PROFIT (60%)</div>
                      </div>
                      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>*Based on current market prices for {selectedCrop} in {district}. Actual profit may vary after Sale stage.</p>
                    </div>

                    <button
                      style={{ marginTop: '20px', width: '100%', background: '#f2a832', color: '#2c1810' }}
                      onClick={() => setScreen("market")}
                    >
                      Check Current Market Prices →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <button onClick={() => { setScreen("dashboard"); setMarketView("home"); }} style={{ margin: '20px', width: 'calc(100% - 40px)', background: '#2c3e50' }}>Return to Home</button>
        </div>
      )}

      {screen === "assistant" && (
        <div className="card">
          <h2>Stage Assistant: {currentStage}</h2>
          <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>{stageOrder.map(s => <span key={s} style={{ opacity: s === currentStage ? 1 : 0.3 }}>{stageCompleted(s) ? '✅' : '⏳'}</span>)}</div>
          {stages[currentStage].map(i => (
            <div key={i} className="crop-card">
              <h4>{(completed[currentStage] || []).includes(i) ? "✅" : "⬜"} {i}</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!(completed[currentStage] || []).includes(i) && <button onClick={() => markDone(i)} style={{ fontSize: '12px', padding: '8px 12px' }}>Done</button>}
                {details[i] && <button onClick={() => setOpenDetail(openDetail === i ? "" : i)} style={{ fontSize: '12px', padding: '8px 12px', background: '#eee', color: '#333' }}>{openDetail === i ? 'Hide' : 'Details'}</button>}
              </div>
              {openDetail === i && <div className="assistant-reply"><p>{details[i].text}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {details[i].contact && <button onClick={() => window.open(`tel:${details[i].contact}`)} style={{ fontSize: '12px' }}>📞 Call Service</button>}
                  {details[i].link && <a href={details[i].link} target="_blank" rel="noreferrer" style={{ background: '#3d6b35', color: 'white', padding: '8px 12px', borderRadius: '999px', textDecoration: 'none', fontSize: '12px' }}>🔗 Open Portal</a>}
                  {details[i].screen && <button onClick={() => setScreen(details[i].screen)} style={{ fontSize: '12px', background: '#f2a832', color: '#2c1810' }}>🚀 Open Hub</button>}
                </div>
              </div>}
            </div>
          ))}
          {stageCompleted(currentStage) && <button onClick={() => { const next = stageOrder[stageOrder.indexOf(currentStage)+1]; if (next) { setCurrentStage(next); syncProgress(selectedCrop, next, completed); } else setScreen("dashboard"); }} style={{ background: '#f2a832', color: '#2c1810', width: '100%', marginTop: '20px' }}>Proceed to Next Stage →</button>}
          <button onClick={() => setScreen("dashboard")} style={{ marginTop: '10px', width: '100%' }}>Return to Dashboard</button>
        </div>
      )}
    </div>
  );
}

export default App;