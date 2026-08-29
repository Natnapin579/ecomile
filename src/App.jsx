import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  Thermometer, 
  Gauge, 
  AlertTriangle, 
  BatteryCharging, 
  Navigation, 
  Cpu,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function App() {
  // ----------------------------------------------------
  // 1. Mock Data State
  // ----------------------------------------------------
  const [data, setData] = useState({
    speed: 78,
    rpm: 4200,
    motorTemp: 62.5,
    battery: 84,
    estimatedRange: 215,
    energyConsumption: 16.2,
    modules: [
      { id: 1, temp: 38, text: 'Normal' },
      { id: 2, temp: 41, text: 'Normal' },
      { id: 3, temp: 58, text: 'Warning' },
      { id: 4, temp: 68, text: 'Critical' },
    ],
    alerts: [
      { id: 1, type: 'critical', title: 'OVERHEAT WARNING', message: 'Module 4 Temp > 65°C' },
      { id: 2, type: 'warning', title: 'HIGH POWER USAGE', message: 'Energy draw spike detected' },
      { id: 3, type: 'info', title: 'SYSTEM OK', message: 'Regen Braking Active' },
    ]
  });

  const [energyHistory, setEnergyHistory] = useState([
    { time: '10:00', kw: 12.1 },
    { time: '10:05', kw: 15.4 },
    { time: '10:10', kw: 14.2 },
    { time: '10:15', kw: 18.9 },
    { time: '10:20', kw: 13.5 },
    { time: '10:25', kw: 16.2 },
  ]);

  // ----------------------------------------------------
  // 2. Real-time Simulation
  // ----------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newSpeed = Math.min(130, Math.max(0, prev.speed + (Math.floor(Math.random() * 7) - 3)));
        const newRpm = newSpeed * 52 + Math.floor(Math.random() * 80);
        const newEnergy = Number((newSpeed * 0.22 + (Math.random() * 2)).toFixed(1));

        return {
          ...prev,
          speed: newSpeed,
          rpm: newRpm,
          motorTemp: Math.min(95, Math.max(40, prev.motorTemp + (Math.random() > 0.5 ? 0.3 : -0.2))),
          energyConsumption: newEnergy,
          modules: prev.modules.map(mod => {
            const nextTemp = Math.min(85, Math.max(32, mod.temp + (Math.random() > 0.5 ? 0.4 : -0.3)));
            return {
              ...mod,
              temp: nextTemp,
            };
          })
        };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const getModuleStyle = (temp) => {
    if (temp >= 65) {
      return {
        bg: 'bg-rose-950/40 border-rose-500/50 shadow-rose-950/50',
        text: 'text-rose-400',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        status: 'CRITICAL'
      };
    }
    if (temp >= 50) {
      return {
        bg: 'bg-amber-950/40 border-amber-500/50 shadow-amber-950/50',
        text: 'text-amber-400',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        status: 'WARM'
      };
    }
    return {
      bg: 'bg-emerald-950/30 border-emerald-500/30 shadow-emerald-950/30',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      status: 'NORMAL'
    };
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-4 md:p-8 font-sans antialiased selection:bg-cyan-500 selection:text-black">
      
      {/* BACKGROUND GLOW EFFECTS */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">

        {/* TOP BAR / HEADER UI */}
        <header className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-5 gap-4 shadow-2xl shadow-black/50">
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl text-black font-black shadow-lg shadow-cyan-500/20">
              <Activity className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  EV TELEMETRY
                </h1>
                <span className="text-[10px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  v2.4 PROT
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">STM32 Multi-Module Real-time Telemetry</p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center justify-around lg:justify-end gap-3 sm:gap-6 bg-slate-950/80 p-2.5 px-4 rounded-2xl border border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Battery</div>
                <div className="text-lg font-black font-mono text-emerald-400">{data.battery}%</div>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-800" />

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Range</div>
                <div className="text-lg font-black font-mono text-cyan-400">
                  {data.estimatedRange} <span className="text-xs text-slate-500 font-sans">km</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD GRID CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* 1. MAIN SPEEDOMETER HERO CARD */}
          <div className="lg:col-span-2 bg-gradient-to-b from-slate-900/80 to-slate-950/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl group hover:border-slate-700/80 transition-all">
            
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Gauge className="w-4 h-4 text-cyan-400" /> Vehicle Speed & Motor State
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> LIVE DATA
              </span>
            </div>

            <div className="my-8 text-center relative z-10">
              <div className="text-8xl sm:text-9xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                {data.speed}
              </div>
              <div className="text-xs font-black tracking-[0.3em] text-cyan-400 uppercase mt-2">
                KILOMETERS PER HOUR (KM/HR)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-950/90 p-4 rounded-2xl border border-slate-800/80 z-10">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Motor RPM</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-slate-100">
                  {data.rpm.toLocaleString()} <span className="text-xs text-slate-500 font-sans">RPM</span>
                </div>
              </div>
              <div className="border-l border-slate-800/80 pl-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Motor Temp</div>
                <div className={`text-xl sm:text-2xl font-black font-mono ${data.motorTemp > 75 ? 'text-rose-400' : 'text-slate-100'}`}>
                  {data.motorTemp.toFixed(1)} <span className="text-xs text-slate-500 font-sans">°C</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. STM32 MODULE TEMPERATURES */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Cpu className="w-4 h-4 text-purple-400" /> STM32 Module Temps (1 - 4)
                </div>
                <span className="text-[11px] font-semibold text-slate-500">4 Sensors Online</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {data.modules.map((mod) => {
                  const style = getModuleStyle(mod.temp);
                  return (
                    <div 
                      key={mod.id} 
                      className={`p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-lg ${style.bg}`}
                    >
                      <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
                        <span>MODULE 0{mod.id}</span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border uppercase ${style.badge}`}>
                          {style.status}
                        </span>
                      </div>
                      <div className={`text-3xl font-black font-mono ${style.text}`}>
                        {mod.temp.toFixed(1)}<span className="text-sm text-slate-500 font-sans ml-1">°C</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 flex items-center gap-2 text-xs text-slate-400">
              <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Threshold: Safe &lt;50°C | Warning 50-65°C | Critical &gt;65°C</span>
            </div>
          </div>

          {/* 3. ENERGY CONSUMPTION REAL-TIME GRAPH */}
          <div className="lg:col-span-3 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Zap className="w-4 h-4 text-amber-400" /> Energy Consumption Rate
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-amber-400">{data.energyConsumption}</span>
                <span className="text-xs text-slate-500 font-bold ml-1">kW/hr</span>
              </div>
            </div>

            <div className="h-52 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={energyHistory}>
                  <defs>
                    <linearGradient id="energyGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="kw" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#energyGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. SYSTEM ALERTS PANEL */}
          <div className="lg:col-span-1 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <ShieldAlert className="w-4 h-4 text-rose-400" /> System Alerts
                </div>
              </div>

              <div className="space-y-3">
                {data.alerts.map((alert) => {
                  const isCritical = alert.type === 'critical';
                  const isWarning = alert.type === 'warning';

                  return (
                    <div 
                      key={alert.id} 
                      className={`p-3.5 rounded-2xl border text-xs flex items-start gap-3 transition-all ${
                        isCritical 
                          ? 'bg-rose-950/30 border-rose-500/40 text-rose-300' 
                          : isWarning 
                          ? 'bg-amber-950/30 border-amber-500/40 text-amber-300' 
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      {isCritical ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-extrabold uppercase tracking-wide text-[10px] opacity-80 mb-0.5">
                          {alert.title}
                        </div>
                        <div className="font-medium text-[11px] leading-snug">{alert.message}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button className="w-full mt-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-bold transition-all">
              Acknowledge All
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}