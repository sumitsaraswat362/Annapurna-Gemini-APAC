"use client";

import { useState } from "react";
import { Send, Bot, Database, BarChart3, AlertTriangle, Truck, Leaf, IndianRupee, CloudOff, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";
import { motion } from "framer-motion";

const forecastData = [
  { day: 'Mon', riskLevel: 20, trucksAtRisk: 1 },
  { day: 'Tue', riskLevel: 35, trucksAtRisk: 2 },
  { day: 'Wed', riskLevel: 55, trucksAtRisk: 4 },
  { day: 'Thu', riskLevel: 80, trucksAtRisk: 7 },
  { day: 'Fri', riskLevel: 45, trucksAtRisk: 3 },
  { day: 'Sat', riskLevel: 25, trucksAtRisk: 1 },
  { day: 'Sun', riskLevel: 15, trucksAtRisk: 0 },
];

const esgMetrics = [
  { title: "Total Food Saved (Kg)", value: "24,500", icon: <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />, trend: "+12%", desc: "vs last month" },
  { title: "Economic Value Recovered for Farmers (₹)", value: "1.24M", icon: <IndianRupee className="w-6 h-6 text-blue-600 dark:text-blue-400" />, trend: "+8%", desc: "in direct benefits" },
  { title: "CO2 Emissions Prevented", value: "4,200 Kg", icon: <CloudOff className="w-6 h-6 text-purple-600 dark:text-purple-400" />, trend: "+15%", desc: "carbon offset" },
];

export default function AnalyticsDashboard() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string, data?: any, sql?: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: 'user' as const, content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/analytics/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.summary,
        sql: data.sql,
        data: data.data
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I encountered an error processing your query."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] aura-container relative overflow-hidden">
      {/* Background Aura */}
      <div className="aura-orb aura-blue w-[70vw] h-[70vh] top-[-10%] left-[-10%]"></div>
      <div className="aura-orb aura-green w-[50vw] h-[50vh] bottom-[-10%] right-[-10%]" style={{ animationDelay: '-5s' }}></div>
      {/* Header */}
      <header className="border-b border-[var(--separator)] bg-[var(--bg-primary)]/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-xl">
              <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Conversational Analytics
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Sustainability Impact Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {esgMetrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[var(--fill-secondary)]/70 border border-[var(--separator)] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl relative overflow-hidden group hover:bg-white/10 transition-colors cursor-default"
            >
              <div className="absolute -right-10 -top-10 bg-white/5 rounded-full p-16 blur-3xl group-hover:bg-white/10 transition-colors pointer-events-none" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-[var(--bg-primary)]/50 rounded-xl border border-[var(--separator)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] backdrop-blur-md">
                  {metric.icon}
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-full">
                  {metric.trend}
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-1">{metric.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{metric.value}</span>
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">{metric.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-24rem)] min-h-[600px]">
          
          {/* Chat Section */}
          <div className="lg:col-span-1 flex flex-col h-full bg-[var(--fill-secondary)]/70 border border-[var(--separator)] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[var(--separator)] bg-white/5">
              <h2 className="font-medium flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Ask Analyst AI
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-[var(--text-secondary)] mt-10">
                  <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Ask a question about your logistics data.</p>
                  <div className="mt-4 flex flex-col gap-2">
                    <button onClick={() => setQuery("Which trucks spoiled this week?")} className="text-xs bg-[var(--fill-secondary)] hover:bg-[var(--fill-tertiary)] text-[var(--text-primary)] border border-[var(--separator)] px-3 py-2 rounded-lg text-left transition-colors">
                      "Which trucks spoiled this week?"
                    </button>
                    <button onClick={() => setQuery("Show me the coldest trucks")} className="text-xs bg-[var(--fill-secondary)] hover:bg-[var(--fill-tertiary)] text-[var(--text-primary)] border border-[var(--separator)] px-3 py-2 rounded-lg text-left transition-colors">
                      "Show me the coldest trucks"
                    </button>
                  </div>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-[var(--text-primary)] rounded-tr-sm' 
                      : 'bg-[var(--fill-tertiary)] text-[var(--text-primary)] border border-[var(--separator)] shadow-sm rounded-tl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex items-start">
                  <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-[var(--bg-primary)]/40 border-t border-[var(--separator)] backdrop-blur-md">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about your fleet..."
                  className="w-full bg-white/5 border border-[var(--separator)] rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-[var(--text-tertiary)]"
                />
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-[var(--text-tertiary)] text-[var(--text-primary)] rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Dashboard/Results & AI Section */}
          <div className="lg:col-span-2 space-y-6 flex flex-col h-full overflow-y-auto pr-2 pb-8">
            {messages.filter(m => m.role === 'assistant' && m.data).length > 0 ? (() => {
              const lastAssistantMessage = messages.filter(m => m.role === 'assistant' && m.data).pop()!;
              
              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 shrink-0"
                >
                  <div className="bg-[var(--fill-secondary)]/70 border border-[var(--separator)] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium flex items-center gap-2 text-[var(--text-primary)]">
                        <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Generated Query
                      </h3>
                    </div>
                    <div className="bg-[var(--fill-secondary)] rounded-xl p-4 border border-[var(--separator)] shadow-inner overflow-x-auto">
                      <code className="text-emerald-300 text-sm font-mono whitespace-pre">{lastAssistantMessage.sql}</code>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="bg-[var(--fill-secondary)]/70 border border-[var(--separator)] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl flex flex-col min-h-[300px]">
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-4 text-[var(--text-primary)]">
                        <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        Data Visualization
                      </h3>
                      <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={lastAssistantMessage.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[var(--separator)]" />
                            <XAxis dataKey="truck_id" stroke="currentColor" className="text-[var(--text-tertiary)]" fontSize={12} />
                            <YAxis stroke="currentColor" className="text-[var(--text-tertiary)]" fontSize={12} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--separator)', borderRadius: '8px' }}
                              itemStyle={{ color: 'var(--text-primary)' }}
                            />
                            <Bar dataKey="max_temp_celsius" fill="#818cf8" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-[var(--fill-secondary)]/70 border border-[var(--separator)] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl flex flex-col min-h-[300px]">
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-4 text-[var(--text-primary)]">
                        <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        Result Table
                      </h3>
                      <div className="flex-1 overflow-y-auto min-h-0 pr-2 space-y-3">
                        {lastAssistantMessage.data.map((row: any, i: number) => (
                          <div key={i} className="bg-white/5 border border-[var(--separator)] rounded-xl p-4 hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-mono text-sm font-bold text-[var(--text-primary)]">{row.truck_id}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${row.status === 'Spoiled' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
                                {row.status}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                              <span>Temp: <span className="text-[var(--text-primary)]">{row.max_temp_celsius}°C</span></span>
                              <span>Loc: <span className="text-[var(--text-primary)]">{row.last_location}</span></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })() : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-center opacity-40 bg-[var(--fill-secondary)]/70 border border-[var(--separator)] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl p-12 shrink-0 min-h-[250px] mb-6"
              >
                <Bot className="w-16 h-16 mb-6 text-[var(--text-secondary)]" />
                <h2 className="text-2xl font-bold tracking-tight">AI Analyst Standby</h2>
                <p className="mt-2 text-lg">Ask a question to generate a report.</p>
              </motion.div>
            )}

            {/* Predictive AI Modeling Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-white/5 to-white/10 border border-[var(--separator)] rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden shrink-0 mt-auto"
            >
              <div className="absolute top-0 right-0 p-32 bg-red-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-2 text-[var(--text-primary)]">
                  <Activity className="w-5 h-5 text-red-400" />
                  Predictive AI Modeling Forecast
                </h3>
                <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg p-3 mb-6 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                  <p className="text-sm">
                    <strong>Critical Alert:</strong> 3 trucks likely to spoil tomorrow due to high regional temperatures. Immediate rerouting recommended.
                  </p>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f87171" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="day" stroke="currentColor" className="text-[var(--text-tertiary)]" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="currentColor" className="text-[var(--text-tertiary)]" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--separator)', borderRadius: '8px' }}
                        itemStyle={{ color: 'var(--text-primary)' }}
                      />
                      <Area type="monotone" dataKey="riskLevel" stroke="#f87171" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </main>
    </div>
  );
}
