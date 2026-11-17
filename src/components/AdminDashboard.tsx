import React, { useState } from "react";
import { ShieldAlert, Server, Activity, Send, CheckCircle2, Sliders, ListFilter } from "lucide-react";

export default function AdminDashboard() {
  const [pushTitle, setPushTitle] = useState("");
  const [pushBody, setPushBody] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);

  // Feature flag states
  const [flags, setFlags] = useState({
    e2ee: true,
    realtimeSocket: true,
    aiGeminiPlanner: true,
    voiceCalling: true
  });

  const handleSendPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim()) return;
    setSentSuccess(true);
    setPushTitle("");
    setPushBody("");
    setTimeout(() => setSentSuccess(false), 3000);
  };

  const serverLogs = [
    { time: "08:14:02", event: "Secure E2EE Tunnel verified for user Liam" },
    { time: "08:14:04", event: "Secure E2EE Tunnel verified for user Sophia" },
    { time: "08:14:15", event: "Heartbeat check: 2 active WebSocket tunnels connected" },
    { time: "08:15:32", event: "Water relationship tree request processed for Couple space" }
  ];

  return (
    <div id="admin_dashboard" className="space-y-6 max-w-lg mx-auto pb-20">
      
      {/* 1. SERVER HEALTH STATUS */}
      <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Server className="w-4 h-4 text-[#FF4D8D]" />
          <span>Server Tunnel Ingress Health</span>
        </h4>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl dark:bg-emerald-950/10 dark:border-emerald-950">
            <span className="text-[10px] text-gray-400 block">Express Gateway</span>
            <p className="font-black text-sm text-emerald-600 mt-1">ONLINE (Port 3000)</p>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl dark:bg-emerald-950/10 dark:border-emerald-950">
            <span className="text-[10px] text-gray-400 block">WebSocket Gateway</span>
            <p className="font-black text-sm text-emerald-600 mt-1">ACTIVE (2 Nodes)</p>
          </div>
        </div>
      </div>

      {/* 2. PUSH NOTIFICATION BROADCASTER */}
      <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Send className="w-4 h-4 text-[#FF4D8D]" />
          <span>FCM Push Notification Broadcaster</span>
        </h4>

        <form onSubmit={handleSendPush} className="space-y-3">
          <input 
            type="text" required placeholder="Notification Heading (e.g., Liam sent a heart!)" value={pushTitle} onChange={(e) => setPushTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs dark:bg-zinc-950 dark:border-zinc-900 dark:text-white"
          />
          <input 
            type="text" placeholder="Subtitle / body content" value={pushBody} onChange={(e) => setPushBody(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs dark:bg-zinc-950 dark:border-zinc-900 dark:text-white"
          />

          {sentSuccess && (
            <p className="text-[10px] text-emerald-500 font-bold flex items-center justify-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Broadcast Dispatched Successfully!</span>
            </p>
          )}

          <button type="submit" className="w-full py-2.5 bg-[#FF4D8D] text-white text-xs font-bold rounded-xl shadow-md">
            Dispatch Broadcast Alert
          </button>
        </form>
      </div>

      {/* 3. FEATURE TOGGLE FLAGS */}
      <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Sliders className="w-4 h-4 text-[#FF4D8D]" />
          <span>Live Applet Feature Flags</span>
        </h4>

        <div className="space-y-2 text-xs">
          {[
            { id: 'e2ee', label: 'Mandate End-to-End Encryption', desc: 'Symmetric encryption keys validation' },
            { id: 'realtimeSocket', label: 'Simulate WebSockets heartbeat', desc: 'Simulated 1s typing and call frames' },
            { id: 'aiGeminiPlanner', label: 'Allow Gemini LLM Planners', desc: 'Allows Love Letter & Date generators' }
          ].map(flag => (
            <div key={flag.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl dark:bg-zinc-900/40">
              <div>
                <p className="font-bold text-gray-800 dark:text-zinc-200">{flag.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{flag.desc}</p>
              </div>
              <input 
                type="checkbox" 
                checked={(flags as any)[flag.id]}
                onChange={() => setFlags({ ...flags, [flag.id]: !(flags as any)[flag.id] })}
                className="rounded text-[#FF4D8D] focus:ring-[#FF4D8D]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 4. REAL-TIME EVENT INGRESS LOGS */}
      <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Activity className="w-4 h-4 text-[#FF4D8D]" />
          <span>Real-time Secure Event logs</span>
        </h4>

        <div className="bg-gray-50 p-4 rounded-2xl font-mono text-[9px] text-gray-500 leading-relaxed dark:bg-zinc-950 dark:text-zinc-400 space-y-1.5">
          {serverLogs.map((log, i) => (
            <p key={i}>
              <span className="text-rose-400 font-bold">[{log.time}]</span> {log.event}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
}
