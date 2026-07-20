"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Wifi, 
  Container, 
  BrainCircuit, 
  Database, 
  Flame, 
  ArrowRight,
  Server,
  Activity,
  ShieldCheck,
  Zap
} from "lucide-react";
import { FloatingNav } from "@/components/landing/FloatingNav";

type Node = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  lightColor: string;
  glowColor: string;
  description: string;
  details: string[];
};

const nodes: Node[] = [
  {
    id: "iot",
    title: "IoT Sensors",
    subtitle: "Google Cloud IoT Core",
    icon: Wifi,
    color: "bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/30",
    lightColor: "#4285F4",
    glowColor: "shadow-[0_0_30px_rgba(66,133,244,0.4)]",
    description: "Real-Time Telemetry Ingestion",
    details: [
      "Captures high-frequency temperature, humidity, and GPS data from active cold chain trucks.",
      "Streams data securely over MQTT/HTTP to the cloud.",
      "Edge processing to filter anomalous spikes before transmission."
    ],
  },
  {
    id: "cloudrun",
    title: "Cloud Run",
    subtitle: "Serverless Containers",
    icon: Container,
    color: "bg-[#34A853]/10 text-[#34A853] border-[#34A853]/30",
    lightColor: "#34A853",
    glowColor: "shadow-[0_0_30px_rgba(52,168,83,0.4)]",
    description: "Serverless Compute & APIs",
    details: [
      "Auto-scaled serverless backend handling all API requests and autonomous agent execution.",
      "Zero infrastructure management — pay only for what you use.",
      "Deploys the multi-agent orchestrator that runs MonitorAgent, DecisionAgent, and NotificationAgent."
    ],
  },
  {
    id: "vertexai",
    title: "Gemini 2.5 Flash",
    subtitle: "Vertex AI • Generative AI",
    icon: BrainCircuit,
    color: "bg-[#AF52DE]/10 text-[#AF52DE] border-[#AF52DE]/30",
    lightColor: "#AF52DE",
    glowColor: "shadow-[0_0_30px_rgba(175,82,222,0.4)]",
    description: "Multi-Agent AI Engine",
    details: [
      "Powers real-time spoilage prediction with sub-second inference latency.",
      "Enables Function Calling — AI agents execute reroute_truck() and alert_wholesaler() autonomously.",
      "RAG pipeline retrieves FSSAI legal documents to generate compliance reports."
    ],
  },
  {
    id: "bigquery",
    title: "BigQuery",
    subtitle: "Data Warehouse & ML",
    icon: Database,
    color: "bg-[#FBBC04]/10 text-[#FBBC04] border-[#FBBC04]/30",
    lightColor: "#FBBC04",
    glowColor: "shadow-[0_0_30px_rgba(251,188,4,0.4)]",
    description: "Analytics & Predictive Modeling",
    details: [
      "Historical telemetry warehouse powering the conversational analytics dashboard.",
      "Users query fleet data in plain English — AI generates SQL and returns visual charts.",
      "BigQuery ML runs ARIMA forecasts to predict future cold-chain failures."
    ],
  },
  {
    id: "firestore",
    title: "Cloud Firestore",
    subtitle: "Real-Time NoSQL Database",
    icon: Flame,
    color: "bg-[#EA4335]/10 text-[#EA4335] border-[#EA4335]/30",
    lightColor: "#EA4335",
    glowColor: "shadow-[0_0_30px_rgba(234,67,53,0.4)]",
    description: "Live State & Marketplace",
    details: [
      "NoSQL database holding live operational state for all fleet vehicles.",
      "Instantly syncs truck locations, active distress bids, and agent actions to all clients.",
      "Provides sub-second latency for the wholesaler bidding marketplace."
    ],
  },
];

export default function CloudStackPage() {
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden relative flex flex-col font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(66,133,244,0.08),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(66,133,244,0.15),transparent_60%)] -z-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(175,82,222,0.06),transparent_60%)] dark:bg-[radial-gradient(circle,rgba(175,82,222,0.12),transparent_60%)] -z-10" />
      
      <FloatingNav activeTab="cloud-stack" />
      
      <main className="flex-1 flex flex-col lg:flex-row items-stretch max-w-7xl w-full mx-auto p-6 lg:p-12 gap-12 pt-28">
        {/* Header */}
        <div className="w-full lg:hidden text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-3">Google Cloud Stack</h1>
          <p className="text-[var(--text-secondary)] text-lg">Hover over each service to explore its role</p>
        </div>

        {/* Left Column: Visual Diagram */}
        <div className="flex-1 flex items-center justify-center relative min-h-[600px]">
          {/* Connecting Line */}
          <div className="absolute left-12 top-12 bottom-12 w-[2px] bg-gradient-to-b from-[#4285F4]/20 via-[#AF52DE]/20 to-[#EA4335]/20 rounded-full hidden md:block" />

          <div className="w-full flex flex-col gap-6 md:gap-10 relative z-10">
            {/* Title - desktop only */}
            <div className="hidden lg:block mb-4">
              <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Google Cloud Stack</h1>
              <p className="text-[var(--text-secondary)] text-base">The services powering Annapurna&apos;s autonomous logistics platform</p>
            </div>

            {nodes.map((node, index) => {
              const isActive = activeNode?.id === node.id;
              const isAnyActive = activeNode !== null;
              
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5, type: "spring" }}
                  onMouseEnter={() => setActiveNode(node)}
                  onMouseLeave={() => setActiveNode(null)}
                  className={`
                    relative flex items-center gap-6 p-4 rounded-2xl cursor-pointer transition-all duration-500 glass
                    ${isActive ? 'bg-[var(--fill-secondary)] shadow-lg scale-[1.02]' : ''}
                    ${isAnyActive && !isActive ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}
                  `}
                >
                  {/* Connection Dot */}
                  <div className="hidden md:flex absolute left-[-42px] w-4 h-4 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--separator)] items-center justify-center">
                    {isActive && (
                      <motion.div 
                        layoutId="activeDot"
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: node.lightColor }}
                      />
                    )}
                  </div>

                  {/* Icon */}
                  <motion.div
                    className={`
                      w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border backdrop-blur-xl transition-all duration-300
                      ${node.color}
                      ${isActive ? node.glowColor + ' scale-110' : ''}
                    `}
                    animate={isActive ? {
                      y: [0, -5, 0],
                      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                    } : {}}
                  >
                    <node.icon className={`w-8 h-8 md:w-10 md:h-10 ${isActive ? 'animate-pulse' : ''}`} />
                  </motion.div>

                  {/* Title & Subtitle */}
                  <div className="flex-1">
                    <h3 className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300 text-[var(--text-primary)]`}>
                      {node.title}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider mt-1" style={{ color: node.lightColor }}>
                      {node.subtitle}
                    </p>
                    <p className={`text-sm font-medium mt-1 text-[var(--text-tertiary)]`}>
                      {node.description}
                    </p>
                  </div>

                  {/* Flow Arrow */}
                  {index < nodes.length - 1 && (
                    <motion.div 
                      animate={isActive ? { x: [0, 10, 0] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="hidden md:flex absolute -bottom-8 left-10 text-[var(--text-quaternary)]"
                    >
                      <ArrowRight className="w-5 h-5 rotate-90" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detail Panel */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="relative h-[500px] w-full max-w-lg mx-auto">
            <AnimatePresence mode="wait">
              {activeNode ? (
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 glass border border-[var(--separator)] rounded-3xl p-8 backdrop-blur-2xl shadow-2xl flex flex-col"
                >
                  <div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 w-fit"
                    style={{ 
                      backgroundColor: `${activeNode.lightColor}10`, 
                      borderColor: `${activeNode.lightColor}30`,
                      color: activeNode.lightColor 
                    }}
                  >
                    <activeNode.icon className="w-5 h-5" />
                    <span className="text-sm font-semibold tracking-wide uppercase">{activeNode.title}</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-4 text-[var(--text-primary)]">
                    {activeNode.description}
                  </h2>
                  
                  <div className="h-px w-full bg-[var(--separator)] mb-6" />
                  
                  <ul className="space-y-6 flex-1">
                    {activeNode.details.map((detail, idx) => (
                      <motion.li 
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.1 }}
                        className="flex gap-4 items-start text-[var(--text-secondary)] leading-relaxed"
                      >
                        <div 
                          className="mt-1 rounded-full p-1 border"
                          style={{ 
                            backgroundColor: `${activeNode.lightColor}10`, 
                            borderColor: `${activeNode.lightColor}30`,
                            color: activeNode.lightColor 
                          }}
                        >
                          <Zap className="w-3 h-3" />
                        </div>
                        <span className="text-sm md:text-base">{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <div className="mt-8 flex items-center justify-between p-4 bg-[var(--fill-secondary)] rounded-xl border border-[var(--separator)]">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#34A853]" />
                      <span className="text-xs font-mono text-[var(--text-tertiary)]">Google Cloud Native</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-[#4285F4]" />
                      <span className="text-xs font-mono text-[var(--text-tertiary)]">99.99% Uptime</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center border border-dashed border-[var(--separator)] rounded-3xl glass"
                >
                  <div className="w-20 h-20 mb-6 rounded-full bg-[var(--fill-secondary)] flex items-center justify-center">
                    <Activity className="w-8 h-8 text-[var(--text-quaternary)]" />
                  </div>
                  <h3 className="text-xl font-medium text-[var(--text-secondary)] mb-2">Interactive Cloud Stack</h3>
                  <p className="text-[var(--text-tertiary)] max-w-[250px] text-sm">
                    Hover over any component to explore how Google Cloud services power the Annapurna platform.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
