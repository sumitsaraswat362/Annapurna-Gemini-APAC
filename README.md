<div align="center">
  <img src="public/images/readme/landing-hero-light.png" alt="Annapurna Hero" width="800" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
  
  <br/>
  
  <h1>Annapurna Logistics 🏔️</h1>
  
  <p>
    <strong>Built for Google Cloud Gen AI Academy APAC</strong><br>
    <em>Minimizing waste. Maximizing efficiency. Saving the harvest.</em>
  </p>
  
  <p>
    <a href="#the-15-lakh-crore-crisis">The Problem</a> •
    <a href="#our-autonomous-solution">Our Solution</a> •
    <a href="#key-features">Key Features</a> •
    <a href="#architecture">Google Cloud Stack</a>
  </p>
</div>

---

## 💔 The ₹1.5 Lakh Crore Crisis

Every year, India loses over **₹1.5 Lakh Crore** to food wastage. The primary culprit? **Broken, fragmented logistics and compromised cold-chain integrity.**

Traditional logistics fleets operate with blind spots. Drivers face unpredictable weather, severe traffic, and mechanical failures. By the time a refrigeration compressor fails on a transport truck, the damage is already done. The cargo spoils, the farmer loses their livelihood, and the wholesaler receives nothing. The current market relies on reactive telematics—telling managers a truck *has already broken down*. 

## 💡 Our Autonomous Solution

**Annapurna** is an autonomous, multi-agent logistics ecosystem designed to eradicate food waste in transit. 

We don't just track trucks; we actively protect perishables. By combining **Google Cloud IoT Edge Telemetry** with **Gemini 2.5 Multi-Agent Orchestration**, Annapurna continuously monitors environmental conditions. If our hardware detects a cooling failure, our AI autonomously calculates reroutes, alerts drivers in their native language, and opens an emergency bidding marketplace to sell the endangered cargo before it spoils.

---

## ✨ Key Features (Gen AI Innovations)

### 1. Multi-Agent Orchestration (The Nerve Center)
Instead of a simple chatbot, Annapurna is powered by a distributed Multi-Agent System:
*   **MonitorAgent:** Analyzes real-time IoT edge telemetry (Temp, Humidity, GPS) via Cloud Run.
*   **DecisionAgent:** Powered by Vertex AI & Gemini Function Calling to calculate autonomous reroutes when anomalies are detected.
*   **NotificationAgent:** Integrates with the **Google Workspace API** to dispatch Gmail alerts and push data to the marketplace.

### 2. Multi-Modal Vision & Document AI
At delivery checkpoints, quality control is completely automated. We utilize **Gemini 1.5 Pro's Vision capabilities** to scan physical cargo images and instantly detect rot or spoilage percentages. Simultaneously, **Google Document AI** digitizes physical invoices, eliminating manual B2B data entry.

### 3. Conversational BigQuery Analytics & Predictive AI
We transformed our data warehouse into a conversational engine. Fleet managers can type plain English queries (e.g., *"Which trucks spoiled this week?"*), and Gemini instantly generates the SQL, queries **BigQuery**, and renders beautiful predictive forecast charts. We've also integrated **Predictive AI Modeling** for ESG Metrics and future spoilage forecasting.

### 4. Voice AI & Localization (Dialogflow CX)
To support diverse drivers across rural India, we integrated a **Dialogflow CX Voice widget** backed by the **Google Cloud Translation API**. This allows drivers to interact with cutting-edge AI dispatchers entirely via voice in regional languages like Hindi.

### 5. The Emergency Wholesaler Marketplace
When a cold-chain failure is unavoidable, the AI pushes the distressed cargo to a live, geo-fenced smart marketplace. Nearby wholesalers can bid on the cargo instantly, ensuring the food is rescued and economic value is recovered for the farmers.

---

## ⚙️ Google Cloud Architecture

Annapurna is built for enterprise scale, utilizing the full breadth of the Google Cloud ecosystem.

```mermaid
graph TD
    A[IoT Edge Sensors] -->|Telemetry| B(Cloud Run)
    B --> C{Firestore Real-time DB}
    C --> D[Multi-Agent Nerve Center]
    D -->|Function Calling| E(Vertex AI / Gemini 2.5)
    E --> F[Workspace API / Gmail]
    E --> G[Wholesaler Marketplace]
    C --> H[(BigQuery)]
    H -->|Conversational SQL| I[Analytics Dashboard]
    J[Cargo Images] --> K(Vision AI / Document AI)
    K --> G
```

<div align="center">
  <img src="public/images/readme/fleet-dashboard-dark.png" width="100%" style="border-radius: 8px;">
</div>

<br/>

*Live map navigation and intelligent rerouting directly to the driver.*

<div align="center">
  <img src="public/images/readme/fleet-rerouting-light.png" width="100%" style="border-radius: 8px;">
</div>

### 🤝 The Wholesaler Marketplace
*A revolutionized B2B market. Wholesalers are notified of emergency cargo nearby and can bid to save the load.*

<div align="center">
  <img src="public/images/readme/wholesaler-dashboard-light.png" width="48%" style="border-radius: 8px;">
  <img src="public/images/readme/marketplace-activity-light.png" width="48%" style="border-radius: 8px;">
</div>

---

## 📸 Latest Application Screenshots

*Showcasing our newest features: The Nerve Center, Predictive Analytics, and Live Dashboard.*

<div align="center">
  <img src="public/images/readme/new-1.png" width="48%" style="border-radius: 8px; margin: 4px;">
  <img src="public/images/readme/new-2.png" width="48%" style="border-radius: 8px; margin: 4px;">
  <img src="public/images/readme/new-3.png" width="48%" style="border-radius: 8px; margin: 4px;">
  <img src="public/images/readme/new-4.png" width="48%" style="border-radius: 8px; margin: 4px;">
  <img src="public/images/readme/new-5.png" width="48%" style="border-radius: 8px; margin: 4px;">
  <img src="public/images/readme/new-6.png" width="48%" style="border-radius: 8px; margin: 4px;">
  <img src="public/images/readme/new-7.png" width="48%" style="border-radius: 8px; margin: 4px;">
  <img src="public/images/readme/new-8.png" width="48%" style="border-radius: 8px; margin: 4px;">
  <img src="public/images/readme/new-9.png" width="48%" style="border-radius: 8px; margin: 4px;">
  <img src="public/images/readme/new-10.png" width="48%" style="border-radius: 8px; margin: 4px;">
  <img src="public/images/readme/new-11.png" width="48%" style="border-radius: 8px; margin: 4px;">
  <img src="public/images/readme/new-12.png" width="48%" style="border-radius: 8px; margin: 4px;">
</div>

---

<div align="center">
  <h3>Ready to revolutionize your supply chain?</h3>
  <p>Join industry leaders in minimizing waste and maximizing efficiency with Annapurna's AI logistics platform.</p>
</div>
