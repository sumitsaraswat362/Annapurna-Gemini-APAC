"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import Link from "next/link";

type Node = {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  glowColor: string;
  description: string;
  details: string[];
};

const nodes: Node[] = [
  {
    id: "iot",
    title: "IoT Sensors",
    icon: Wifi,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    glowColor: "shadow-[0_0_30px_rgba(59,130,246,0.5)]",
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
    icon: Container,
    color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    glowColor: "shadow-[0_0_30px_rgba(99,102,241,0.5)]",
    description: "Serverless Compute & APIs",
    details: [
      "Highly scalable containerized environment handling our Next.js backend and IoT ingestion.",
      "Auto-scales from zero to thousands of instances during high-traffic route rerouting.",
      "Serves the distress marketplace APIs seamlessly."
    ],
  },
  {
    id: "vertex",
    title: "Vertex AI",
    icon: BrainCircuit,
    color: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    glowColor: "shadow-[0_0_30px_rgba(168,85,247,0.5)]",
    description: "Agentic AI Core",
    details: [
      "Powers the Annapurna AI Agent utilizing advanced LLMs.",
      "Predicts commodity spoilage based on thermal degradation models.",
      "Autonomously negotiates and reroutes trucks to nearby wholesalers when distress is detected."
    ],
  },
  {
    id: "bigquery",
    title: "BigQuery",
    icon: Database,
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    glowColor: "shadow-[0_0_30px_rgba(16,185,129,0.5)]",
    description: "Enterprise Data Warehouse",
    details: [
      "Stores petabytes of historical IoT data, route histories, and market transactions.",
      "Runs complex analytical queries to optimize future supply chain routes.",
      "Serves as the foundational training data source for Vertex AI models."
    ],
  },
  {
    id: "firestore",
    title: "Firestore",
    icon: Flame,
    color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    glowColor: "shadow-[0_0_30px_rgba(245,158,11,0.5)]",
    description: "Real-Time Synchronization",
    details: [
      "NoSQL database holding live operational state.",
      "Instantly syncs truck locations, active distress bids, and agent actions to all web and mobile clients.",
      "Provides sub-second latency for marketplace bidding."
    ],
  },
];

export default function ArchitecturePage() {
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative flex flex-col font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay -z-10"></div>
      
      {/* Navigation */}
      <nav className="p-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Annapurna <span className="font-light text-white/50">Architecture</span>
          </span>
        </div>
        <Link 
          href="/" 
          className="text-sm font-medium text-white/60 hover:text-white transition-colors flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
        >
          Return Home
        </Link>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row items-stretch max-w-7xl w-full mx-auto p-6 lg:p-12 gap-12">
        {/* Left Column: Visual Diagram */}
        <div className="flex-1 flex items-center justify-center relative min-h-[600px]">
          {/* Connecting Line underlying nodes */}
          <div className="absolute left-12 top-12 bottom-12 w-1 bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-amber-500/20 rounded-full hidden md:block" />

          <div className="w-full flex flex-col gap-6 md:gap-12 relative z-10">
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
                    relative flex items-center gap-6 p-4 rounded-2xl cursor-pointer transition-all duration-500
                    ${isAnyActive && !isActive ? 'opacity-40 scale-95 blur-[1px]' : 'opacity-100 scale-100'}
                  `}
                >
                  {/* Decorative Connection Dot */}
                  <div className="hidden md:flex absolute left-[-42px] w-4 h-4 rounded-full bg-[#0a0a0a] border-2 border-white/20 items-center justify-center">
                    {isActive && (
                      <motion.div 
                        layoutId="activeDot"
                        className={`w-2 h-2 rounded-full ${node.color.split(' ')[1].replace('text-', 'bg-')}`} 
                      />
                    )}
                  </div>

                  {/* Icon Container */}
                  <motion.div
                    className={`
                      w-20 h-20 rounded-2xl flex items-center justify-center border backdrop-blur-xl transition-all duration-300
                      ${node.color}
                      ${isActive ? node.glowColor + ' border-opacity-100 scale-110' : 'border-opacity-30'}
                    `}
                    animate={isActive ? {
                      y: [0, -5, 0],
                      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                    } : {}}
                  >
                    <node.icon className={`w-10 h-10 ${isActive ? 'animate-pulse' : ''}`} />
                  </motion.div>

                  {/* Title & Subtitle */}
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/80'}`}>
                      {node.title}
                    </h3>
                    <p className={`text-sm font-medium mt-1 transition-colors duration-300 ${isActive ? node.color.split(' ')[1] : 'text-white/40'}`}>
                      {node.description}
                    </p>
                  </div>

                  {/* Flow Arrow (except last) */}
                  {index < nodes.length - 1 && (
                    <motion.div 
                      animate={isActive ? { x: [0, 10, 0] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="hidden md:flex absolute -bottom-10 left-10 text-white/20"
                    >
                      <ArrowRight className="w-5 h-5 rotate-90" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Info Panel */}
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
                  className="absolute inset-0 bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl flex flex-col"
                >
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 mb-6 w-fit ${activeNode.color.split(' ')[0]} ${activeNode.color.split(' ')[1]}`}>
                    <activeNode.icon className="w-5 h-5" />
                    <span className="text-sm font-semibold tracking-wide uppercase">{activeNode.title}</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-4 text-white">
                    {activeNode.description}
                  </h2>
                  
                  <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent mb-6" />
                  
                  <ul className="space-y-6 flex-1">
                    {activeNode.details.map((detail, idx) => (
                      <motion.li 
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.1 }}
                        className="flex gap-4 items-start text-white/70 leading-relaxed"
                      >
                        <div className={`mt-1 rounded-full p-1 border border-white/10 ${activeNode.color.split(' ')[0]} ${activeNode.color.split(' ')[1]}`}>
                          <Zap className="w-3 h-3" />
                        </div>
                        <span className="text-sm md:text-base">{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <div className="mt-8 flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-mono text-white/50">Google Cloud Native</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-blue-400" />
                      <span className="text-xs font-mono text-white/50">99.99% Uptime</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]"
                >
                  <div className="w-20 h-20 mb-6 rounded-full bg-white/5 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-white/20" />
                  </div>
                  <h3 className="text-xl font-medium text-white/60 mb-2">Interactive Architecture</h3>
                  <p className="text-white/40 max-w-[250px] text-sm">
                    Hover over any component in the diagram to explore its role in the Annapurna platform.
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
