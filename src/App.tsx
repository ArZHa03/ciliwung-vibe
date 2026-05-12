/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Camera, LayoutDashboard, Settings, UserCircle2, ShoppingBag } from 'lucide-react';
import { cn } from './lib/utils';
import DashboardPage from './pages/Dashboard';
import ReporterPage from './pages/Reporter';
import ProfilePage from './pages/Profile';
import StorePage from './pages/Store';
import { VirtualPetsOverlay } from './components/VirtualPet';
import { store, UserProfile } from './lib/store';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reporter' | 'profile' | 'store'>('dashboard');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [cheatClicks, setCheatClicks] = useState(0);

  useEffect(() => {
    let keys = '';
    const cheatHandler = (e: KeyboardEvent) => {
      keys += e.key.toLowerCase();
      if (keys.endsWith('hesoyam')) {
        store.addEcoCoins(100000).then(() => {
          alert('Cheat Activated: +100,000 CWP');
          store.getUserProfile().then(setProfile);
        });
        keys = '';
      }
      if (keys.length > 20) keys = keys.slice(-20);
    };
    window.addEventListener('keydown', cheatHandler);
    return () => window.removeEventListener('keydown', cheatHandler);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      store.tickPets().then(() => {
        store.getUserProfile().then(setProfile);
      });
    }, 10000); // 10 seconds tick
    store.getUserProfile().then(setProfile); // initial load
    return () => clearInterval(interval);
  }, []);

  const handleCheatClick = () => {
    setCheatClicks(prev => {
      const next = prev + 1;
      if (next >= 7) {
        store.addEcoCoins(100000).then(() => {
          alert('Secret Cheat Activated: +100,000 CWP');
          store.getUserProfile().then(setProfile);
        });
        return 0;
      }
      return next;
    });
  };

  const bgStyle = profile?.activeBackground && profile.activeBackground !== 'default' 
    ? { backgroundImage: profile.activeBackground.startsWith('http') || profile.activeBackground.startsWith('data:') 
        ? `url(${profile.activeBackground})` 
        : `url('/bg-${profile.activeBackground}.jpg')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundAttachment: 'fixed' }
    : {};

  const isGlassmorphism = profile?.activeEffects.includes('glassmorphism');

  return (
    <div 
      className={cn(
        "min-h-screen pb-24 md:pb-0 pt-6 flex flex-col relative z-0 transition-all duration-500",
        isGlassmorphism ? "bg-transparent before:content-[''] before:fixed before:inset-0 before:-z-10 before:backdrop-blur-xl before:bg-black/60" : "bg-moss-dark"
      )}
      style={bgStyle}
    >
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 flex flex-col items-stretch h-full">
        <VirtualPetsOverlay />
        
        {/* Top Header */}
        <header className={cn(
          "pb-4 flex items-end justify-between border-b mb-6 transition-colors",
          isGlassmorphism ? "border-white/5" : "border-white/10"
        )}>
          <div className="flex flex-col cursor-pointer" onClick={handleCheatClick}>
            <span className="text-[10px] uppercase tracking-[0.3em] text-neon-cyan font-bold">#JuaraVibeCoding 2026</span>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase" onDoubleClick={() => setActiveTab('dashboard')}>CiliwungVibe<span className="text-neon-cyan">:</span> <span className="font-light">Smart Eco-Guardian</span></h1>
          </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('store')}
            className={cn(
              "p-2 rounded-full transition-all border",
              activeTab === 'store' ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan" : "bg-white/5 border-white/10 text-white/50 hover:text-white"
            )}
          >
            <ShoppingBag className="w-5 h-5 flex-shrink-0" />
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={cn(
              "p-2 rounded-full transition-all border",
              activeTab === 'profile' ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan" : "bg-white/5 border-white/10 text-white/50 hover:text-white"
            )}
          >
            <UserCircle2 className="w-5 h-5 flex-shrink-0" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pb-8">
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'reporter' && <ReporterPage />}
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'store' && <StorePage />}
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-50">
        <div className="glass-panel p-2 flex items-center justify-around relative">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "px-4 py-2 font-black text-[11px] uppercase tracking-tighter rounded-md flex flex-1 justify-center items-center gap-2 transition-all duration-300",
              activeTab === 'dashboard' ? "bg-white/5 border border-white/10 text-white" : "text-white/50 hover:text-white/80"
            )}
          >
            Impact Dashboard
          </button>
          
          <div className="w-2" />

          <button 
            onClick={() => setActiveTab('reporter')}
            className={cn(
              "px-4 py-2 font-black text-[11px] uppercase tracking-tighter rounded-md flex flex-1 justify-center items-center gap-2 transition-all duration-300",
              activeTab === 'reporter' ? "bg-neon-cyan text-black neon-border" : "text-white/50 hover:text-white/80 border border-transparent"
            )}
          >
            Vision AI Mode
          </button>
        </div>
      </nav>
      
      </div>
    </div>
  );
}
