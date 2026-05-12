import React, { useEffect, useState } from 'react';
import { store, Report, LeaderboardEntry, UserProfile } from '../lib/store';
import { motion } from 'motion/react';
import { Droplet, Recycle, Award, ChevronRight, Activity, Trophy, Filter, MapPin, CheckCircle2, Circle } from 'lucide-react';
import { MapDisplay } from '../components/MapDisplay';

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({ score: 0, count: 0, badges: [] as string[] });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    store.getReports().then(setReports);
    store.getUserStats().then(s => setStats({ score: s.score, count: s.reportsCount, badges: s.badges || [] }));
    store.getLeaderboard().then(setLeaderboard);
    store.getUserProfile().then(setProfile);
  }, []);

  const totalKg = reports.reduce((acc, curr) => acc + curr.weightEstimateKg, 0);
  
  const filteredReports = filter === 'ALL' 
    ? reports 
    : reports.filter(r => r.trashType.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Daily Quests */}
      {profile?.dailyQuests && profile.dailyQuests.length > 0 && (
        <section className="glass-panel p-4 rounded-xl border border-neon-cyan/20">
          <h2 className="text-xs uppercase tracking-widest font-bold text-neon-cyan mb-4 flex items-center gap-2">
            📋 Misi Harian
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.dailyQuests.map(quest => (
              <div key={quest.id} className={`flex items-center gap-3 p-3 rounded-lg border ${quest.completed ? 'bg-eco-green/10 border-eco-green/20' : 'bg-black/40 border-white/5'}`}>
                <div className="shrink-0">
                  {quest.completed ? <CheckCircle2 className="w-6 h-6 text-eco-green" /> : <Circle className="w-6 h-6 text-white/20" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[11px] font-bold text-white mb-1 line-clamp-2 leading-snug">{quest.desc}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-mono text-white/50">{quest.progress} / {quest.target}</span>
                    <span className="text-[10px] font-bold text-neon-cyan">+{quest.reward} CWP</span>
                  </div>
                  <div className="w-full h-1 bg-black rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-neon-cyan transition-all duration-1000" style={{ width: `${(quest.progress / quest.target) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hero Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-6 rounded-[16px] relative overflow-hidden group border-l-4 border-l-neon-cyan">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <Droplet className="w-48 h-48" />
          </div>
          <div className="relative z-10">
            <h2 className="text-xs uppercase tracking-widest font-bold text-neon-cyan mb-2">Dampak Nyata</h2>
            <div className="text-5xl font-black stat-value neon-text-cyan flex items-baseline gap-2">
              {totalKg.toFixed(1)} <span className="text-xl text-neon-cyan font-sans font-bold">MT</span>
            </div>
            <p className="mt-2 text-[11px] text-white/40 italic">Sampah dicegah masuk Teluk Jakarta</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-[16px] relative overflow-hidden bg-moss-deep/50">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xs uppercase tracking-widest font-bold text-white/50 mb-2">Vibe Score Kamu</h2>
              <div className="text-4xl font-black stat-value text-eco-green">
                {stats.score}
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-neon-cyan p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                ME
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-end text-xs text-white/60 mb-2 font-mono">
              <span>{stats.count} Laporan</span>
              {stats.badges.length > 0 ? (
                <div className="flex gap-1">
                  {stats.badges.map((b, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-eco-green/10 text-eco-green rounded-full font-bold uppercase border border-eco-green/20">
                      🏅 {b}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="opacity-50">Butuh {5 - (stats.count % 5)} lagi</span>
              )}
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: stats.badges.length > 0 ? '100%' : `${(stats.count % 5) / 5 * 100}%` }} 
                className="h-full bg-eco-green"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="glass-panel p-6 rounded-[16px]">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-eco-green flex items-center gap-2">
            <Trophy className="w-4 h-4" /> Eco-Guardian Leaderboard
          </h2>
        </div>
        <div className="space-y-3">
          {leaderboard.slice(0, 3).map((user, i) => (
            <div key={user.id} className={`flex items-center justify-between p-3 rounded-lg ${user.id === 'demo-user' ? 'bg-cyan-900/20 border border-cyan-400/20' : 'bg-white/5'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] ${i === 0 ? 'bg-yellow-500/20 text-yellow-500' : i === 1 ? 'bg-slate-300/20 text-slate-300' : i === 2 ? 'bg-amber-700/20 text-amber-500' : 'bg-white/10 text-white/50'}`}>
                  #{i + 1}
                </div>
                <div className="font-mono text-sm">{user.name}</div>
              </div>
              <div className="flex items-center gap-3">
                {user.badges.length > 0 && <Award className="w-4 h-4 text-neon-cyan" />}
                <div className="text-neon-cyan font-bold">{user.score} pt</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Peta Persebaran Section */}
      <section className="glass-panel p-6 rounded-[16px]">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neon-cyan" /> Peta Persebaran Sampah
          </h2>
        </div>
        <MapDisplay reports={reports} />
      </section>

      {/* Circular Economy Hub List */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b border-white/10 pb-4 gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neon-cyan flex items-center gap-2">
            Circular Economy Hub
          </h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {['ALL', 'PLASTIK', 'ORGANIK'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-full border uppercase tracking-widest whitespace-nowrap transition-all ${filter === f ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="text-center p-12 glass-panel rounded-[16px] border-dashed">
              <Activity className="w-8 h-8 text-white/50 mx-auto mb-3 opacity-50" />
              <p className="text-white/40">Belum ada laporan kategori ini.</p>
            </div>
          ) : (
            filteredReports.map((report, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={report.id} 
                className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-neon-cyan/30 transition-all flex gap-4 items-center group cursor-pointer"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img src={report.imageUrl} alt="Trash" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{report.trashType}</h3>
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-[10px] opacity-50 tracking-wider">0.4 km away</span>
                     {report.status === 'Collected' && (
                       <span className="text-[10px] px-2 py-0.5 bg-eco-green/10 text-eco-green rounded-full font-bold">DIANGKUT</span>
                     )}
                     {report.status !== 'Collected' && (
                       <span className="text-[10px] px-2 py-0.5 bg-neon-cyan/10 text-neon-cyan rounded-full font-bold">MENUNGGU</span>
                     )}
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/60">ESTIMASI</span>
                    <span className="text-eco-green font-bold">{report.weightEstimateKg} KG</span>
                  </div>
                </div>
                <div className="w-8 h-8 flex items-center justify-center shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-neon-cyan" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
