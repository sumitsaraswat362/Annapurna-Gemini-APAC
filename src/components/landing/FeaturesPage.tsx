import { motion } from "motion/react";
import { 
  Brain, Bot, Code, Database, LineChart, Camera, 
  Cloud, HardDrive, Cpu, Leaf, Wifi, Map, Activity, 
  Search, Workflow, Zap, Network, Scale
} from "lucide-react";

const features = [
  {
    id: 1,
    title: "Gemini 2.5 Flash",
    description: "Powers the autonomous multi-agent AI decision-making system. Used for real-time spoilage prediction, emergency rerouting, and conversational analytics.",
    icon: Brain,
    color: "bg-blue-500/10 text-blue-500",
    badge: "Vertex AI",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    id: 2,
    title: "Multi-Agent Orchestration",
    description: "Autonomous Monitor, Decision, Notification, and Market agents communicate and act without human intervention.",
    icon: Bot,
    color: "bg-purple-500/10 text-purple-500",
    badge: "Antigravity",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    id: 3,
    title: "Function Calling",
    description: "AI agents use structured function calls like reroute_truck() and alert_wholesaler() to take real autonomous actions.",
    icon: Code,
    color: "bg-green-500/10 text-green-500",
    badge: "Gemini Tools",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    id: 4,
    title: "RAG Assistant",
    description: "Legal & Compliance AI retrieves from a vector database of FSSAI regulations to generate definitive legal liability reports.",
    icon: Search,
    color: "bg-orange-500/10 text-orange-500",
    badge: "Vector Search",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    id: 5,
    title: "Conversational Analytics",
    description: "Natural language querying of fleet telemetry data. Ask plain English questions and get SQL queries + visual charts.",
    icon: LineChart,
    color: "bg-cyan-500/10 text-cyan-500",
    badge: "DataQnA",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    id: 6,
    title: "Vision AI",
    description: "Camera-based cargo quality inspection. AI analyzes images for spoilage detection at delivery checkpoints.",
    icon: Camera,
    color: "bg-indigo-500/10 text-indigo-500",
    badge: "Gemini Multi-Modal",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    id: 7,
    title: "Cloud Run",
    description: "Serverless container deployment for the entire backend API layer and autonomous agent execution.",
    icon: Cloud,
    color: "bg-blue-400/10 text-blue-400",
    badge: "Google Cloud",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    id: 8,
    title: "BigQuery",
    description: "Historical telemetry data warehouse powering the analytics dashboard and predictive models.",
    icon: Database,
    color: "bg-blue-600/10 text-blue-600",
    badge: "Google Cloud",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    id: 9,
    title: "Firestore",
    description: "Real-time NoSQL database for live fleet state, bid management, and agent communication.",
    icon: HardDrive,
    color: "bg-yellow-500/10 text-yellow-500",
    badge: "Google Cloud",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    id: 10,
    title: "Predictive Maintenance",
    description: "ML models that predict compressor failures and cooling anomalies before they happen.",
    icon: Activity,
    color: "bg-red-500/10 text-red-500",
    badge: "Vertex AI",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    id: 11,
    title: "Sustainability Dashboard",
    description: "Real-time carbon footprint tracking, food waste reduction metrics, and economic impact for farmers.",
    icon: Leaf,
    color: "bg-emerald-500/10 text-emerald-500",
    badge: "ESG Metrics",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    id: 12,
    title: "IoT Telemetry Pipeline",
    description: "Real-time ingestion of temperature, humidity, GPS, and vibration data from truck-mounted sensors.",
    icon: Cpu,
    color: "bg-teal-500/10 text-teal-500",
    badge: "Pub/Sub",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    id: 13,
    title: "Maps & Geolocation",
    description: "Live GPS tracking with route visualization, geofencing, and distance-optimized rerouting.",
    icon: Map,
    color: "bg-green-600/10 text-green-600",
    badge: "Maps Platform",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    id: 14,
    title: "Offline 5G Dead Zone Sync",
    description: "LoRaWAN mesh network fallback ensures data continuity in zero-connectivity rural areas.",
    icon: Network,
    color: "bg-pink-500/10 text-pink-500",
    badge: "Edge Computing",
    colSpan: "col-span-1 md:col-span-3 lg:col-span-4",
  },
];

export function FeaturesPage() {
  return (
    <div className="py-24 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-4"
          >
            Powered by Google Cloud
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto"
          >
            A fully autonomous ecosystem leveraging industry-leading AI, data, and infrastructure to optimize the entire cold chain.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`relative overflow-hidden rounded-[40px] border border-[var(--separator)] bg-[var(--bg-secondary)]/50 backdrop-blur-xl p-8 flex flex-col group hover:border-[var(--fill-secondary)] transition-all duration-300 shadow-sm hover:shadow-xl ${feature.colSpan}`}
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className={`p-4 rounded-2xl ${feature.color}`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                {feature.badge && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--bg-primary)] border border-[var(--separator)] text-[var(--text-secondary)] shadow-sm">
                    {feature.badge}
                  </span>
                )}
              </div>
              
              <div className="relative z-10 mt-auto">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--text-primary)] group-hover:to-[var(--text-secondary)] transition-all">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
