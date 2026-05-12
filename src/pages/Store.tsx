import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Coins, Paintbrush, ShieldCheck, Cat, Fish } from 'lucide-react';
import { store, UserProfile, PETS_DB } from '../lib/store';

const THEMES = [
  { id: 'default', name: 'Original Eco', cost: 0, color: '#00F2FF' },
  { id: 'sunset', name: 'Golden Sunset', cost: 150, color: '#FFB347' },
  { id: 'ocean', name: 'Deep Ocean', cost: 200, color: '#0088FF' },
  { id: 'cyberpunk', name: 'Neon Cyberpunk', cost: 300, color: '#FF00FF' },
];

const EFFECTS = [
  { id: 'glassmorphism', name: 'Ultra Glassmorphism', cost: 250, desc: 'Aktifkan UI tembus pandang bergaya futuristik.' },
  { id: 'custom_bg', name: 'Custom Wallpaper', cost: 400, desc: 'Izinkan ubah background dengan gambar URL kamu sendiri.' }
];

const PET_ITEMS = [
  { id: 'toy_yarn', name: 'Bola Benang Merah', cost: 100, icon: '🧶', desc: 'Mainan kecil untuk kucing.' },
  { id: 'cat_bed', name: 'Kasur Empuk', cost: 300, icon: '🛏️', desc: 'Biar kucingnya tidur pulas.' },
  { id: 'litter_box', name: 'Pasir Kucing', cost: 150, icon: '📦', desc: 'Toilet khusus anabul.' },
  { id: 'cat_tree', name: 'Pohon Kucing', cost: 450, icon: '🌴', desc: 'Bisa dipanjat ke mana-mana.' },
  { id: 'dog_bone', name: 'Tulang Mainan', cost: 120, icon: '🦴', desc: 'Gigitan empuk untuk anjing.' },
  { id: 'dog_frisbee', name: 'Frisbee Terbang', cost: 250, icon: '🥏', desc: 'Cocok untuk lempar tangkap.' },
  { id: 'dog_house', name: 'Rumah Anjing', cost: 500, icon: '🛖', desc: 'Tempat berteduh anjing setia.' },
  { id: 'otter_pool', name: 'Bak Air Mini', cost: 400, icon: '🛁', desc: 'Kolam air untuk berang-berang.' },
  { id: 'eagle_perch', name: 'Tenggeran Kayu', cost: 450, icon: '🪵', desc: 'Rumah pohon untuk elang.' },
  { id: 'monkey_rope', name: 'Tali Panjat', cost: 350, icon: '🪢', desc: 'Mainan gelantungan monyet.' },
];

export default function StorePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bgUrlInput, setBgUrlInput] = useState('');
  const [showBgModal, setShowBgModal] = useState(false);

  useEffect(() => {
    store.getUserProfile().then(setProfile);
  }, []);

  const handleUpdateBg = async (url?: string) => {
    if (!profile) return;
    try {
      const targetUrl = url !== undefined ? url : bgUrlInput;
      const updated = await store.updateBackground(targetUrl === 'default' ? null : targetUrl);
      setProfile(updated);
      alert('Wallpaper berhasil diubah!');
    } catch(e) {}
  };

  const handleBuyTheme = async (themeId: string, cost: number) => {
    try {
      const updated = await store.buyTheme(themeId, cost);
      setProfile(updated);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error buying theme');
    }
  };

  const handleSetActiveTheme = async (themeId: string) => {
    try {
      const updated = await store.setActiveTheme(themeId);
      setProfile(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBuyEffect = async (effectId: string, cost: number) => {
    try {
      const updated = await store.buyEffect(effectId, cost);
      setProfile(updated);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error buying effect');
    }
  };

  const handleToggleEffect = async (effectId: string) => {
    try {
      const updated = await store.toggleEffect(effectId);
      setProfile(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBuyPet = async (petId: string, cost: number) => {
    try {
      const updated = await store.buyPet(petId, cost);
      setProfile(updated);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error buying pet');
    }
  };

  const handleTogglePet = async (petId: string, isActive: boolean) => {
    if (isActive) {
      window.dispatchEvent(new CustomEvent('recall-pet', { detail: { petId } }));
    } else {
      try {
        const updated = await store.togglePet(petId);
        setProfile(updated);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleBuyPetItem = async (itemId: string, cost: number) => {
    try {
      const updated = await store.buyPetItem(itemId, cost);
      setProfile(updated);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error buying pet item');
    }
  };

  const handleTogglePetItem = async (itemId: string) => {
    try {
      const updated = await store.togglePetItem(itemId);
      setProfile(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBuyFood = async () => {
    try {
      const updated = await store.buyFood(1, 20); // 1 food = 20 CWP
      setProfile(updated);
      alert('Berhasil membeli 1 Pet Food! 🐟');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error buying food');
    }
  };

  if (!profile) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-20"
    >
      <div className="flex items-center justify-between glass-panel p-4 rounded-xl border border-neon-cyan/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neon-cyan/20 rounded-lg">
            <Coins className="w-6 h-6 text-neon-cyan" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Eco-Coins</div>
            <div className="text-xl font-bold text-neon-cyan">{profile.ecoCoins} <span className="text-sm font-normal text-white/50">CWP</span></div>
          </div>
        </div>
        <div className="text-[10px] text-right text-white/40 max-w-[120px]">
          Kumpulkan coin dengan melaporkan tumpukan sampah
        </div>
      </div>

      <div className="glass-panel p-6 rounded-[16px]">
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
          <Paintbrush className="w-5 h-5 text-neon-cyan" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">Theme Shop</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {THEMES.map(theme => {
            const isUnlocked = profile.unlockedThemes.includes(theme.id);
            const isActive = profile.activeTheme === theme.id;
            const canAfford = profile.ecoCoins >= theme.cost;

            return (
              <div key={theme.id} className={`p-4 rounded-xl border transition-all ${isActive ? 'bg-white/10 border-neon-cyan shadow-[0_0_15px_rgba(0,242,255,0.1)]' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-white/20" style={{ backgroundColor: theme.color }}></div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{theme.name}</h3>
                      {!isUnlocked && <div className="text-xs text-white/50">{theme.cost} CWP</div>}
                    </div>
                  </div>
                  {isActive && <ShieldCheck className="w-5 h-5 text-neon-cyan" />}
                </div>

                {isActive ? (
                  <button disabled className="w-full py-2 bg-neon-cyan/10 text-neon-cyan text-[11px] font-bold uppercase tracking-widest rounded-lg border border-neon-cyan/20">
                    Active
                  </button>
                ) : isUnlocked ? (
                  <button 
                    onClick={() => handleSetActiveTheme(theme.id)}
                    className="w-full py-2 bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-white/20 transition-all"
                  >
                    Use Theme
                  </button>
                ) : (
                  <button 
                    onClick={() => handleBuyTheme(theme.id, theme.cost)}
                    disabled={!canAfford}
                    className={`w-full py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${canAfford ? 'bg-neon-cyan text-black shadow-[0_0_10px_rgba(0,242,255,0.3)] hover:bg-cyan-300' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
                  >
                    Buy Theme
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* UI Effects */}
        <div className="flex items-center gap-2 mt-8 mb-6 border-b border-white/10 pb-4">
          <Paintbrush className="w-5 h-5 text-neon-cyan" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">Visual Upgrades</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EFFECTS.map(effect => {
            const isUnlocked = profile.unlockedEffects.includes(effect.id);
            const isActive = profile.activeEffects.includes(effect.id);
            const canAfford = profile.ecoCoins >= effect.cost;

            return (
              <div key={effect.id} className={`p-4 flex flex-col justify-between rounded-xl border transition-all ${isActive ? 'bg-white/10 border-neon-cyan shadow-[0_0_15px_rgba(0,242,255,0.1)]' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}>
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-white">{effect.name}</h3>
                      {!isUnlocked && <div className="text-xs text-white/50">{effect.cost} CWP</div>}
                    </div>
                    {isActive && <ShieldCheck className="w-5 h-5 text-neon-cyan" />}
                  </div>
                  <p className="text-[10px] text-white/60 leading-relaxed">{effect.desc}</p>
                </div>

                {isUnlocked ? (
                  <div className="flex justify-between items-stretch gap-2">
                    <button 
                      onClick={() => {
                        handleToggleEffect(effect.id);
                        if (effect.id === 'custom_bg' && !isActive) {
                          setBgUrlInput(profile?.activeBackground && profile.activeBackground !== 'default' ? profile.activeBackground : '');
                          setShowBgModal(true);
                        }
                      }}
                      className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${isActive ? 'bg-neon-cyan/20 border border-neon-cyan text-neon-cyan' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                      {isActive ? 'Aktif' : 'Aktifkan'}
                    </button>
                    {effect.id === 'custom_bg' && showBgModal && (
                      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                        <div className="bg-moss-deep p-6 rounded-xl border border-neon-cyan max-w-sm w-full space-y-4">
                          <h3 className="font-bold">Set Custom Wallpaper</h3>
                          <input 
                            type="text" 
                            className="w-full bg-black/50 border border-white/20 rounded p-2 text-xs text-white" 
                            placeholder="https://image-url.com/a.jpg"
                            value={bgUrlInput}
                            onChange={e => setBgUrlInput(e.target.value)}
                          />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => { setShowBgModal(false); }} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-bold">Batal</button>
                            <button onClick={() => { handleUpdateBg('default'); setShowBgModal(false); }} className="px-3 py-1.5 bg-red-500/20 text-red-500 rounded text-xs font-bold">Hapus bg</button>
                            <button onClick={() => { handleUpdateBg(); setShowBgModal(false); }} className="px-3 py-1.5 bg-neon-cyan text-black rounded text-xs font-bold">Simpan</button>
                          </div>
                        </div>
                      </div>
                    )}
                    {effect.id === 'custom_bg' && isActive && (
                      <button onClick={() => { setBgUrlInput(profile?.activeBackground && profile.activeBackground !== 'default' ? profile.activeBackground : ''); setShowBgModal(true); }} className="px-3 bg-white/10 rounded-lg text-[10px] font-bold">⚙️ Edit</button>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => handleBuyEffect(effect.id, effect.cost)}
                    disabled={!canAfford}
                    className={`w-full py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${canAfford ? 'bg-neon-cyan text-black shadow-[0_0_10px_rgba(0,242,255,0.3)] hover:bg-cyan-300' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
                  >
                    Beli Fitur
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-[16px]">
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
          <Cat className="w-5 h-5 text-neon-cyan" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">Adopsi Kucing (Eco-Pets)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {PETS_DB.map(pet => {
            const isUnlocked = profile.unlockedPets.includes(pet.id);
            const isActive = profile.activePets.includes(pet.id);
            const canAfford = profile.ecoCoins >= pet.cost;

            return (
              <div key={pet.id} className={`p-4 rounded-xl border transition-all ${isActive ? 'bg-white/10 border-neon-cyan shadow-[0_0_15px_rgba(0,242,255,0.1)]' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-2xl border border-white/20">
                      {pet.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{pet.name}</h3>
                      {!isUnlocked && <div className="text-xs text-white/50">{pet.cost} CWP</div>}
                    </div>
                  </div>
                  {isActive && <ShieldCheck className="w-5 h-5 text-neon-cyan" />}
                </div>

                {isUnlocked ? (
                  <button 
                    onClick={() => handleTogglePet(pet.id, isActive)}
                    className={`w-full py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${isActive ? 'bg-neon-cyan/20 border border-neon-cyan text-neon-cyan' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    {isActive ? 'Masukkan Kandang' : 'Lepas Liarkan'}
                  </button>
                ) : (
                  <button 
                    onClick={() => handleBuyPet(pet.id, pet.cost)}
                    disabled={!canAfford}
                    className={`w-full py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${canAfford ? 'bg-neon-cyan text-black shadow-[0_0_10px_rgba(0,242,255,0.3)] hover:bg-cyan-300' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
                  >
                    Adopsi
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl border bg-black/40 border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Fish className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Pet Food (Ikan Segar)</h3>
              <div className="text-xs text-white/50">20 CWP (Kamu Punya: {profile.petFood})</div>
            </div>
          </div>
          <button 
            onClick={handleBuyFood}
            disabled={profile.ecoCoins < 20}
            className={`py-2 px-4 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all border ${profile.ecoCoins >= 20 ? 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20' : 'border-white/10 text-white/30 cursor-not-allowed'}`}
          >
            Beli
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {PET_ITEMS.map(item => {
            const isUnlocked = profile.unlockedPetItems.includes(item.id);
            const isActive = profile.activePetItems.includes(item.id);
            const canAfford = profile.ecoCoins >= item.cost;

            return (
              <div key={item.id} className={`p-4 flex flex-col justify-between rounded-xl border transition-all ${isActive ? 'bg-white/10 border-neon-cyan shadow-[0_0_15px_rgba(0,242,255,0.1)]' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}>
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{item.icon}</div>
                      <div>
                        <h3 className="font-bold text-sm text-white">{item.name}</h3>
                        {!isUnlocked && <div className="text-xs text-white/50">{item.cost} CWP</div>}
                      </div>
                    </div>
                    {isActive && <ShieldCheck className="w-5 h-5 text-neon-cyan" />}
                  </div>
                  <p className="text-[10px] text-white/60 leading-relaxed">{item.desc}</p>
                </div>

                {isUnlocked ? (
                  <button 
                    onClick={() => handleTogglePetItem(item.id)}
                    className={`w-full py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${isActive ? 'bg-neon-cyan/20 border border-neon-cyan text-neon-cyan' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    {isActive ? 'Simpan' : 'Gunakan'}
                  </button>
                ) : (
                  <button 
                    onClick={() => handleBuyPetItem(item.id, item.cost)}
                    disabled={!canAfford}
                    className={`w-full py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${canAfford ? 'bg-neon-cyan text-black shadow-[0_0_10px_rgba(0,242,255,0.3)] hover:bg-cyan-300' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
                  >
                    Beli Barang
                  </button>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </motion.div>
  );
}
