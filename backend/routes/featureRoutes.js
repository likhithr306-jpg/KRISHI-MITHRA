const express = require("express");
const router = express.Router();
const axios = require("axios");

const districtCoordinates = {
  Bengaluru: { lat: 12.9716, lon: 77.5946 },
  Udupi: { lat: 13.3409, lon: 74.7421 },
  "Dakshina Kannada": { lat: 12.9141, lon: 74.856 },
  Mysuru: { lat: 12.2958, lon: 76.6394 },
  Mandya: { lat: 12.5223, lon: 76.8959 },
  Hassan: { lat: 13.0033, lon: 76.1004 },
  Belagavi: { lat: 15.8497, lon: 74.4977 },
  Raichur: { lat: 16.212, lon: 77.3439 },
  Kalaburagi: { lat: 17.3297, lon: 76.8343 },
};

// V2 - Real Marketplace Trends (Karnataka Market Index)
const marketplaceTrends = {
  summary: "Agricultural markets are seeing a 12% rise in demand for organic pulses and a stable trend for cereals.",
  hotSelling: "Ragi, Paddy & Coconut",
  stats: [
    { crop: 'Paddy', val: 78, hike: '+4%', volume: 'High' },
    { crop: 'Ragi', val: 95, hike: '+12%', volume: 'Peak' },
    { crop: 'Tomato', val: 35, hike: '-15%', volume: 'Low' },
    { crop: 'Maize', val: 70, hike: '+2%', volume: 'Stable' },
    { crop: 'Banana', val: 60, hike: '0%', volume: 'Medium' }
  ]
};

// V2 - Verified Buyers (Mandi & Private)
const marketplaceData = [
  {
    crop: "Paddy",
    markets: [
      { name: "Udupi APMC Mandi", price: "₹2,350/qtl", saleRatio: "92%", type: "Govt", contact: "0820252111" },
      { name: "Mangalore Wholesale Hub", price: "₹2,410/qtl", saleRatio: "88%", type: "Private", contact: "9880123456" },
      { name: "Reliance Fresh Sourcing", price: "₹2,450/qtl", saleRatio: "85%", type: "Retail", contact: "9001122334" }
    ]
  },
  {
    crop: "Ragi",
    markets: [
      { name: "Mandya Raitha Sangha", price: "₹3,400/qtl", saleRatio: "98%", type: "Co-op", contact: "9741223344" },
      { name: "Mysuru APMC Market", price: "₹3,350/qtl", saleRatio: "94%", type: "Govt", contact: "0821245000" }
    ]
  },
  {
    crop: "Banana",
    markets: [
      { name: "Mysuru Fruit Hub", price: "₹28/kg", saleRatio: "88%", type: "Wholesale", contact: "9008112233" },
      { name: "Hassan Growers Society", price: "₹30/kg", saleRatio: "90%", type: "Co-op", contact: "9448001122" }
    ]
  },
  {
    crop: "Coconut",
    markets: [
      { name: "Tiptur Copra Market", price: "₹35/piece", saleRatio: "96%", type: "Govt", contact: "0813425001" },
      { name: "Coastal Traders", price: "₹32/piece", saleRatio: "82%", type: "Private", contact: "9011223344" }
    ]
  }
];

// V2 - Real Rental Inventory (Expanded with User's Images)
const rentalData = [
  { item: "Mahindra 575 DI XP Plus", type: "Tractor", price: "₹1,200 / Day", vendor: "Sri Manjunatha Equipments", location: "Udupi", contact: "9845012345", image: "https://tiimg.tistatic.com/fp/1/007/556/mahindra-575-di-tractor-775.jpg" },
  { item: "JCB 3DX Backhoe Loader", type: "Earth Mover", price: "₹2,500 / Day", vendor: "Karnataka Earthworks", location: "Bengaluru", contact: "9988776655", image: "https://cpimg.tistatic.com/07818451/b/4/JCB-3DX-Backhoe-Loader.jpg" },
  { item: "Hitachi ZAXIS 210 Excavator", type: "Excavator", price: "₹4,500 / Day", vendor: "Deep Excavation Hub", location: "Mysuru", contact: "9000112233", image: "https://5.imimg.com/data5/SELLER/Default/2023/1/320473950/AX/XW/IP/2330750/hitachi-zaxis-210-excavator.jpg" },
  { item: "Kubota Combine Harvester", type: "Harvester", price: "₹3,500 / Day", vendor: "Coastal Krishi Hub", location: "Udupi", contact: "8861234567", image: "https://5.imimg.com/data5/SELLER/Default/2021/6/YI/QX/ID/13045435/combine-harvester.jpg" },
  { item: "VST Shakti Power Tiller", type: "Cultivator", price: "₹900 / Day", vendor: "Malnad Agro Services", location: "Shimoga", contact: "7022123456", image: "https://vsttractors.com/assets/images/power-tiller.jpg" },
  { item: "Massey Ferguson Rotavator", type: "Soil Prep", price: "₹800 / Day", vendor: "Gowda Agro Rentals", location: "Mandya", contact: "9741234567", image: "https://masseyfergusonindia.com/assets/images/rotavator.jpg" },
  { item: "High-Pressure Sprayer", type: "Sprayer", price: "₹400 / Day", vendor: "Farmer's Friend Agency", location: "Hassan", contact: "9448123456", image: "https://m.media-amazon.com/images/I/71rIeU0rSLL._AC_UF1000,1000_QL80_.jpg" },
  { item: "Heavy-Duty Brush Cutter", type: "Weeder", price: "₹500 / Day", vendor: "Green Farm Solutions", location: "Belagavi", contact: "9123456789", image: "https://5.imimg.com/data5/ANDROID/Default/2021/3/TM/VZ/IK/124765664/product-jpeg-500x500.jpg" },
  { item: "Water Tanker Truck (5000L)", type: "Irrigation", price: "₹1,500 / Trip", vendor: "Cauvery Water Supply", location: "Mandya", contact: "8050112233", image: "https://5.imimg.com/data5/SELLER/Default/2022/9/MQ/SR/QJ/11993206/water-tanker-truck.jpg" },
  { item: "Agricultural Drone (Spray)", type: "Tech", price: "₹2,500 / Acre", vendor: "Krishi Tech Solutions", location: "Bengaluru", contact: "9122334455", image: "https://m.media-amazon.com/images/I/61y8B3O1ZzL.jpg" }
];

// V2 - Government Schemes (Karnataka & India)
const schemeData = [
  { name: "PM-KISAN Samman Nidhi", category: "Income", status: "Present", link: "https://pmkisan.gov.in/", desc: "₹6,000 yearly direct benefit transfer." },
  { name: "PM Fasal Bima Yojana", category: "Insurance", status: "Present", link: "https://pmfby.gov.in/", desc: "Financial support against crop loss." },
  { name: "Kisan Credit Card (KCC)", category: "Loan", status: "Present", link: "https://www.myscheme.gov.in/schemes/kcc", desc: "Low-interest agricultural loans." },
  { name: "Raitha Vidya Nidhi", category: "Education", status: "Present", link: "https://raitamitra.karnataka.gov.in/", desc: "Scholarships for farmers' children." },
  { name: "Digital Krishi Mission", category: "Tech", status: "Upcoming", link: "#", desc: "Drones and IoT integration (Mid-2025)." },
  { name: "Solar Pump Subsidy (KUSUM)", category: "Subsidy", status: "Present", link: "https://pmkusum.mnre.gov.in/", desc: "90% subsidy on solar irrigation pumps." }
];

router.get("/weather", async (req, res) => {
  let { lat, lon, district } = req.query;
  if (!lat || !lon) {
    const coords = districtCoordinates[district || "Udupi"];
    lat = coords?.lat; lon = coords?.lon;
  }
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const response = await axios.get(url);
    res.json({ success: true, data: response.data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get("/marketplace", (req, res) => res.json({ success: true, data: marketplaceData, trends: marketplaceTrends }));
router.get("/rental", (req, res) => res.json({ success: true, data: rentalData }));
router.get("/schemes", (req, res) => res.json({ success: true, data: schemeData }));

module.exports = router;
