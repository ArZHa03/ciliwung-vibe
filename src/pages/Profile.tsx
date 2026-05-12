import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, Check, UserCircle2 } from 'lucide-react';
import { Cat, Heart } from 'lucide-react';
import { store, UserProfile, PETS_DB } from '../lib/store';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const getPetData = (petId: string) => PETS_DB.find(p => p.id === petId);

  useEffect(() => {
    store.getUserProfile().then(p => {
      setProfile(p);
      setNameInput(p.name);
    });
  }, []);

  const handleSave = async () => {
    if (!nameInput.trim()) return;
    const updated = await store.updateUserProfile(nameInput);
    setProfile(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!profile) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="glass-panel p-6 rounded-[16px]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-cyan-900/40 border border-cyan-400/20 flex items-center justify-center mb-4 relative">
            <UserCircle2 className="w-12 h-12 text-neon-cyan" />
            {profile.isGuest && (
              <div className="absolute -bottom-2 px-2 py-0.5 bg-white/10 text-[10px] font-bold text-white rounded-full border border-white/20">
                GUEST
              </div>
            )}
          </div>
          
          {isEditing ? (
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              <input 
                type="text" 
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="w-full bg-black/60 border border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan text-white text-center rounded-lg px-4 py-2 font-bold"
                placeholder="Masukkan Namamu"
              />
              <div className="flex gap-2 w-full">
                <button 
                  onClick={() => { setIsEditing(false); setNameInput(profile.name); }}
                  className="flex-1 py-2 text-xs font-bold text-white/50 hover:bg-white/5 rounded-lg border border-transparent transition-all"
                >
                  BATAL
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 py-2 text-xs font-bold bg-neon-cyan text-black rounded-lg hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(10,212,139,0.3)]"
                >
                  SIMPAN
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-black text-white">{profile.name}</h2>
              <div className="flex items-center gap-2 mt-1 mb-2 text-neon-cyan bg-neon-cyan/10 px-3 py-1 rounded-full border border-neon-cyan/20">
                <span className="font-bold">{profile.ecoCoins} CWP</span>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="text-[11px] uppercase tracking-widest text-white/50 hover:text-neon-cyan transition-colors mt-2 underline underline-offset-4"
              >
                Ganti Nama
              </button>
            </div>
          )}
          
          {saveSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mt-4 flex items-center gap-2 text-eco-green text-xs font-bold bg-eco-green/10 px-3 py-1.5 rounded-full border border-eco-green/20"
            >
              <Check className="w-4 h-4" /> PROFIL DIPERBARUI
            </motion.div>
          )}
        </div>

        <div className="space-y-4 pt-6 border-t border-white/10">
          <h3 className="text-xs uppercase tracking-widest text-white/50 font-bold mb-4">Pengaturan Akun (Opsional)</h3>
          
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-start gap-4 transition-all hover:bg-white/5 cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white mb-1">Hubungkan Google (Gmail)</h4>
              <p className="text-[11px] text-white/50 leading-relaxed mb-3">Simpan progres dan skormu secara permanen lintas perangkat. Bebas login tanpa buat password baru.</p>
              <button className="px-4 py-2 bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                Login dengan Google
              </button>
            </div>
          </div>
          
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-900/40 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-neon-cyan" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white mb-1">Sistem Guest</h4>
              <p className="text-[11px] text-white/50 leading-relaxed">Saat ini kamu menggunakan mode Guest. Data masih tersimpan di perangkat ini (Local Storage) dan bisa hilang jika cache dihapus.</p>
            </div>
          </div>
        </div>
      </div>

      {profile.unlockedPets.length > 0 && (
        <div className="glass-panel p-6 rounded-[16px] space-y-4 mt-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-200 fill-mode-both">
          <div className="flex items-center gap-2 mb-2">
            <Cat className="w-5 h-5 text-neon-cyan" />
            <h3 className="text-xl font-bold text-white">Statistik Fauna</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.unlockedPets.map(petId => {
              const state = profile.petStates?.[petId];
              const petData = getPetData(petId);
              if (!state || !petData) return null;
              return (
                <div key={petId} className="p-4 rounded-xl border border-white/10 bg-black/40 text-left">
                  <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
                    <div className="text-3xl bg-white/5 w-12 h-12 flex items-center justify-center rounded-full border border-white/10">{petData.icon}</div>
                    <div>
                      <div className="font-bold text-sm text-white">{petData.name}</div>
                      <div className="text-[11px] text-neon-cyan tracking-widest uppercase mt-0.5">{state.trait}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest text-white/50 w-16">Lapar</span>
                      <div className="flex-1 h-1.5 bg-black rounded-full mx-2 overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${state.hunger}%` }} />
                      </div>
                      <span className="text-[10px] text-white/80 w-6 text-right">{state.hunger}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest text-white/50 w-16">Energi</span>
                      <div className="flex-1 h-1.5 bg-black rounded-full mx-2 overflow-hidden">
                        <div className="h-full bg-blue-400" style={{ width: `${state.energy}%` }} />
                      </div>
                      <span className="text-[10px] text-white/80 w-6 text-right">{state.energy}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest text-white/50 w-16">Mood</span>
                      <div className="flex-1 h-1.5 bg-black rounded-full mx-2 overflow-hidden">
                        <div className="h-full bg-pink-400" style={{ width: `${state.fun}%` }} />
                      </div>
                      <span className="text-[10px] text-white/80 w-6 text-right">{state.fun}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {Object.entries(profile.petRelationships || {}).length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-pink-500" />
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Hubungan Antar Fauna</h4>
              </div>
              <div className="space-y-2">
                {Object.entries(profile.petRelationships).map(([pairStr, relationship]) => {
                  const [p1, p2] = pairStr.split('-');
                  const d1 = getPetData(p1);
                  const d2 = getPetData(p2);
                  if (!d1 || !d2) return null;
                  return (
                    <div key={pairStr} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                      <div className="flex items-center gap-2 text-xl bg-white/5 px-3 py-1 rounded border border-white/5">
                        <span title={d1.name}>{d1.icon}</span>
                        <span className="mx-1 text-[10px] text-white/50">⇄</span>
                        <span title={d2.name}>{d2.icon}</span>
                      </div>
                      <div className="text-xs font-medium bg-pink-500/10 text-pink-400 px-3 py-1 rounded-full border border-pink-500/20">
                        {relationship}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
