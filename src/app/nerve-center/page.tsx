"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NegotiationPit from './NegotiationPit';

const allLogs = [
  { agent: 'System', message: 'Initializing Neural Routing Core...', type: 'system' },
  { agent: 'MonitorAgent', message: 'Scanning 45 active trucks...', type: 'info' },
  { agent: 'MonitorAgent', message: '⚠️ Anomaly detected on TRK-007 (Temp: 6°C). Passing context to DecisionAgent.', type: 'warning' },
  { agent: 'DecisionAgent', message: 'Evaluating spoilage window. Spoilage in 45m. ETA 90m.', type: 'info' },
  { agent: 'DecisionAgent', message: 'Initiating Emergency Reroute protocol.', type: 'critical' },
  { agent: 'NotificationAgent', message: 'Dispatching alerts to 5 nearby wholesalers.', type: 'action' },
  { agent: 'MarketAgent', message: 'Wholesaler-B accepted emergency bid at -15% margin.', type: 'success' },
  { agent: 'System', message: 'Reroute confirmed. TRK-007 redirected to Wholesaler-B. Loss mitigated: $4,500.', type: 'success' },
  { agent: 'MonitorAgent', message: 'Telemetry normalized for fleet subset A.', type: 'info' }
];

const AgentControlCenter = () => {
  const [logs, setLogs] = useState<typeof allLogs>([]);
  const [logIndex, setLogIndex] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logIndex < allLogs.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, allLogs[logIndex]]);
        setLogIndex(prev => prev + 1);
      }, Math.random() * 1500 + 500); // Random delay between 0.5s and 2s
      return () => clearTimeout(timer);
    } else {
        // loop back for demo after a pause
        const timer = setTimeout(() => {
           setLogIndex(0);
           setLogs([]);
        }, 5000);
        return () => clearTimeout(timer);
    }
  }, [logIndex]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getColor = (type: string, agent: string) => {
    if (type === 'warning') return 'text-yellow-600 dark:text-yellow-400';
    if (type === 'critical') return 'text-red-600 dark:text-red-500';
    if (type === 'success') return 'text-emerald-600 dark:text-emerald-400';
    if (type === 'action') return 'text-blue-600 dark:text-blue-400';
    if (type === 'system') return 'text-[var(--text-secondary)]';
    
    // Agent colors
    if (agent === 'MonitorAgent') return 'text-cyan-600 dark:text-cyan-400';
    if (agent === 'DecisionAgent') return 'text-purple-600 dark:text-purple-400';
    if (agent === 'NotificationAgent') return 'text-amber-600 dark:text-amber-400';
    if (agent === 'MarketAgent') return 'text-fuchsia-600 dark:text-fuchsia-400';
    
    return 'text-[var(--text-primary)]';
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono p-4 md:p-8 selection:bg-cyan-500/30 aura-container relative overflow-hidden">
      {/* Background Aura */}
      <div className="aura-orb aura-blue w-[70vw] h-[70vh] top-[-10%] left-[-10%]"></div>
      <div className="aura-orb aura-purple w-[50vw] h-[50vh] bottom-[-10%] right-[-10%]" style={{ animationDelay: '-5s' }}></div>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--separator)] pb-6"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-wider flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              Nerve Center
            </h1>
            <p className="text-[var(--text-tertiary)] mt-1 text-sm tracking-widest">Autonomous Fleet Intelligence</p>
          </div>
          
          <div className="flex gap-4 text-xs">
            <div className="px-4 py-2 rounded-md bg-white/5 border border-[var(--separator)] backdrop-blur-md">
              <span className="text-[var(--text-tertiary)]">SYSTEM STATUS</span>
              <div className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2 mt-1">
                OPTIMAL <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)] animate-pulse" />
              </div>
            </div>
            <div className="px-4 py-2 rounded-md bg-white/5 border border-[var(--separator)] backdrop-blur-md">
              <span className="text-[var(--text-tertiary)]">ACTIVE AGENTS</span>
              <div className="text-cyan-600 dark:text-cyan-400 font-semibold mt-1">1,024</div>
            </div>
          </div>
        </motion.header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[75vh]">
          
          {/* Terminal View */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 relative rounded-xl bg-[var(--fill-secondary)]/70 border border-[var(--separator)] shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl overflow-hidden flex flex-col"
          >
            {/* Terminal Header */}
            <div className="h-10 border-b border-cyan-500/20 bg-[var(--fill-secondary)]/90 border-b border-[var(--separator)] flex items-center px-4 justify-between backdrop-blur-md">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700 hover:bg-red-500/80 transition-colors cursor-pointer" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700 hover:bg-yellow-500/80 transition-colors cursor-pointer" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700 hover:bg-green-500/80 transition-colors cursor-pointer" />
              </div>
              <div className="text-xs text-cyan-500/50 tracking-widest uppercase font-sans">Multi-Agent Feed</div>
            </div>

            {/* Terminal Body */}
            <div className="p-4 overflow-y-auto flex-1 font-mono text-sm space-y-3 custom-scrollbar">
              <AnimatePresence initial={false}>
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 leading-relaxed"
                  >
                    <span className="text-[var(--text-tertiary)] shrink-0 select-none">
                      {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className="text-[var(--text-primary)] select-none">{'>'}</span>
                    <span className={`${getColor('agent', log.agent)} font-semibold shrink-0`}>
                      [{log.agent}]
                    </span>
                    <span className={`${getColor(log.type, log.agent)}`}>
                      {log.message}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={bottomRef} />
              
              {/* Blinking cursor */}
              <motion.div 
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-4 bg-cyan-500 mt-2 ml-16"
              />
            </div>
            
            {/* Glowing bottom border effect */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          </motion.div>

          {/* Right Sidebar - System Stats */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-6"
          >
            {/* Quick Metrics */}
            <div className="rounded-xl bg-[var(--fill-secondary)]/70 border border-[var(--separator)] shadow-sm backdrop-blur-md p-5 space-y-4">
              <h3 className="text-xs text-[var(--text-tertiary)] tracking-widest uppercase font-sans">Network Health</h3>
              
              <div className="space-y-4 font-sans">
                {[
                  { label: 'Neural Core Load', value: '34%', raw: 34, color: 'bg-cyan-400' },
                  { label: 'Memory Allocation', value: '18 GB', raw: 65, color: 'bg-purple-400' },
                  { label: 'Event Throughput', value: '1.2k /s', raw: 80, color: 'bg-emerald-400' },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">{stat.label}</span>
                      <span className="text-[var(--text-primary)]">{stat.value}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[var(--fill-tertiary)] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.raw}%` }}
                        transition={{ duration: 1.5, delay: 0.5 + (i * 0.2), ease: "easeOut" }}
                        className={`h-full ${stat.color} shadow-[0_0_10px_currentColor]`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Protocols */}
            <div className="rounded-xl bg-[var(--fill-secondary)]/70 border border-[var(--separator)] shadow-sm backdrop-blur-md p-5 flex-1 flex flex-col font-sans">
              <h3 className="text-xs text-[var(--text-tertiary)] tracking-widest uppercase mb-4">Active Protocols</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
                  <span className="text-red-400">Emergency Reroute (TRK-007)</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-emerald-600 dark:text-emerald-400/80">Standard Telemetry</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <span className="text-blue-600 dark:text-blue-400/80">Market Sync Protocol</span>
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>
        
        {/* Active Negotiation Pit */}
        <NegotiationPit />
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.4);
        }
      `}} />
    </div>
  );
};

export default AgentControlCenter;
