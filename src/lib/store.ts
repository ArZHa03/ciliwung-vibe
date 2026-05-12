export interface Report {
  id: string;
  imageUrl: string;
  trashType: string;
  pollutionImpact: 'Low' | 'Moderate' | 'High' | 'Critical';
  weightEstimateKg: number;
  latitude: number;
  longitude: number;
  status: 'Pending' | 'Collected';
  createdAt: number;
}

export interface RecyclerHub {
  id: string;
  name: string;
  address: string;
  acceptedMaterials: string[];
}

export interface UserVibe {
  userId: string;
  score: number;
  reportsCount: number;
  badges: string[];
}

export interface DailyQuest {
  id: string;
  desc: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
}

export interface PetState {
  trait: string;
  hunger: number;
  energy: number;
  fun: number;
}

export interface UserProfile {
  id: string;
  name: string;
  isGuest: boolean;
  ecoCoins: number;
  unlockedThemes: string[];
  activeTheme: string;
  unlockedPets: string[];
  activePets: string[];
  petFood: number;
  unlockedPetItems: string[];
  activePetItems: string[];
  petStates: Record<string, PetState>;
  petRelationships: Record<string, string>;
  unlockedEffects: string[];
  activeEffects: string[];
  unlockedBackgrounds: string[];
  activeBackground: string | null;
  dailyQuests: DailyQuest[];
  lastLoginDate: string;
}

export const PETS_DB = [
  { id: 'oren', name: 'Kucing Oren (Harimau Ciliwung)', type: 'Kucing', cost: 500, icon: '🐱' },
  { id: 'hitam', name: 'Kucing Hitam (Ninja Malam)', type: 'Kucing', cost: 750, icon: '🐈‍⬛' },
  { id: 'putih', name: 'Kucing Putih (Awan Suci)', type: 'Kucing', cost: 1000, icon: '😸' },
  { id: 'chihuahua', name: 'Chihuahua (Kecil Ganas)', type: 'Anjing', cost: 600, icon: '🐕' },
  { id: 'bulldog', name: 'Bulldog (Si Kekar)', type: 'Anjing', cost: 800, icon: '🐶' },
  { id: 'golden', name: 'Golden Retriever (Si Ramah)', type: 'Anjing', cost: 1200, icon: '🦮' },
  { id: 'berang_berang', name: 'Berang-berang Ciliwung (Si Lincah)', type: 'Endemik', cost: 1500, icon: '🦦' },
  { id: 'elang_bondol', name: 'Elang Bondol (Maskot Jakarta)', type: 'Endemik', cost: 2000, icon: '🦅' },
  { id: 'monyet', name: 'Monyet Ekor Panjang (Si Jahil)', type: 'Endemik', cost: 1300, icon: '🐒' },
];

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  badges: string[];
}

const generateDailyQuests = (): DailyQuest[] => [
  { id: 'report_any_3', desc: 'Laporkan 3 titik tumpukan sampah jenis apapun', progress: 0, target: 3, reward: 50, completed: false },
  { id: 'report_critical', desc: 'Laporkan 1 titik sampah dengan status CRITICAL', progress: 0, target: 1, reward: 100, completed: false },
];

const getStoredProfile = (): UserProfile => {
  const stored = localStorage.getItem('ciliwung_user_profile');
  const today = new Date().toISOString().split('T')[0];

  if (stored) {
    try { 
      const parsed = JSON.parse(stored);
      if (typeof parsed.ecoCoins !== 'number') parsed.ecoCoins = 50; // Welcome gift
      if (!parsed.unlockedThemes) parsed.unlockedThemes = ['default'];
      if (!parsed.activeTheme) parsed.activeTheme = 'default';
      if (!parsed.unlockedPets) parsed.unlockedPets = [];
      if (!parsed.activePets) parsed.activePets = [];
      if (typeof parsed.petFood !== 'number') parsed.petFood = 0;
      if (!parsed.unlockedEffects) parsed.unlockedEffects = [];
      if (!parsed.activeEffects) parsed.activeEffects = [];
      if (!parsed.unlockedPetItems) parsed.unlockedPetItems = [];
      if (!parsed.activePetItems) parsed.activePetItems = [];
      if (!parsed.petStates) {
        parsed.petStates = {};
        parsed.petRelationships = {};
        if (parsed.unlockedPets) {
          parsed.unlockedPets.forEach((petId: string) => {
            parsed.petStates[petId] = { trait: 'Normal', hunger: 50, energy: 50, fun: 50 };
          });
        }
      }
      if (!parsed.unlockedBackgrounds) parsed.unlockedBackgrounds = ['default'];
      if (!parsed.activeBackground) parsed.activeBackground = null;
      if (!parsed.lastLoginDate || parsed.lastLoginDate !== today) {
        parsed.dailyQuests = generateDailyQuests();
        parsed.lastLoginDate = today;
      }
      return parsed;
    } catch (e) {}
  }
  return { 
    id: 'demo-user', 
    name: 'Guest ' + Math.floor(Math.random() * 1000), 
    isGuest: true,
    ecoCoins: 50,
    unlockedThemes: ['default'],
    activeTheme: 'default',
    unlockedPets: [],
    activePets: [],
    petFood: 3,
    unlockedPetItems: [],
    activePetItems: [],
    petStates: {},
    petRelationships: {},
    unlockedEffects: [],
    activeEffects: [],
    unlockedBackgrounds: ['default'],
    activeBackground: null,
    dailyQuests: generateDailyQuests(),
    lastLoginDate: today
  };
};

const saveStoredProfile = (profile: UserProfile) => {
  localStorage.setItem('ciliwung_user_profile', JSON.stringify(profile));
  // Apply theme to document
  document.documentElement.setAttribute('data-theme', profile.activeTheme);
};

let currentUserProfile = getStoredProfile();
// Initially apply theme
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-theme', currentUserProfile.activeTheme);
}

// Memory Store for Demo Resilience
let reports: Report[] = [
  {
    id: "r1",
    imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&q=80&w=600",
    trashType: "Plastik & Botol PET",
    pollutionImpact: "High",
    weightEstimateKg: 12.5,
    latitude: -6.2088,
    longitude: 106.8456,
    status: "Pending",
    createdAt: Date.now() - 3600000
  }
];

let userStats: UserVibe = {
  userId: "demo-user",
  score: 120,
  reportsCount: 4,
  badges: []
};

let leaderboardData: LeaderboardEntry[] = [
  { id: '1', name: 'Budi (Sektor 2)', score: 850, badges: ['Pahlawan Ciliwung'] },
  { id: '2', name: 'Siti (Bantaran)', score: 620, badges: ['Pahlawan Ciliwung'] },
  { id: 'demo-user', name: 'Kamu', score: 120, badges: [] },
  { id: '4', name: 'Agus (Sektor 5)', score: 90, badges: [] },
];

export const store = {
  getReports: async () => {
    // In production, this maps to: getDocs(collection(db, 'reports'))
    return [...reports].sort((a, b) => b.createdAt - a.createdAt);
  },
  
  getLeaderboard: async () => {
    // Sync demo user score before returning
    const userIndex = leaderboardData.findIndex(u => u.id === 'demo-user');
    if (userIndex > -1) {
      leaderboardData[userIndex].score = userStats.score;
      leaderboardData[userIndex].badges = [...userStats.badges];
      leaderboardData[userIndex].name = currentUserProfile.name; // Dynamically show updated name
    }
    return [...leaderboardData].sort((a, b) => b.score - a.score);
  },
  
  getUserProfile: async () => {
    return { ...currentUserProfile };
  },

  buyTheme: async (themeId: string, cost: number) => {
    if (currentUserProfile.ecoCoins >= cost && !currentUserProfile.unlockedThemes.includes(themeId)) {
      currentUserProfile.ecoCoins -= cost;
      currentUserProfile.unlockedThemes.push(themeId);
      currentUserProfile.activeTheme = themeId;
      saveStoredProfile(currentUserProfile);
      return { ...currentUserProfile };
    }
    throw new Error('Not enough CWP or already unlocked.');
  },

  buyPet: async (petId: string, cost: number) => {
    if (currentUserProfile.ecoCoins >= cost && !currentUserProfile.unlockedPets.includes(petId)) {
      currentUserProfile.ecoCoins -= cost;
      currentUserProfile.unlockedPets.push(petId);
      if (!currentUserProfile.activePets.includes(petId)) {
        currentUserProfile.activePets.push(petId);
      }
      
      const traits = ['Pemalas 🥱', 'Agresif 💢', 'Manja ✨', 'Pecicilan ⚡', 'Cerdas 🧠', 'Penakut 🫣', 'Rakus 🍖'];
      currentUserProfile.petStates[petId] = {
        trait: traits[Math.floor(Math.random() * traits.length)],
        hunger: 100, energy: 100, fun: 100
      };

      const statuses = ['Acuh tak acuh 😒', 'Sahabat sejati 🫂', 'Pasangan romantis 💖', 'Teman biasa 🙂', 'Sedang marahan 😤', 'Musuh bebuyutan ⚔️'];
      currentUserProfile.unlockedPets.forEach(existingPet => {
        if (existingPet !== petId) {
          const pairId = [petId, existingPet].sort().join('-');
          if (!currentUserProfile.petRelationships[pairId]) {
            currentUserProfile.petRelationships[pairId] = statuses[Math.floor(Math.random() * statuses.length)];
          }
        }
      });

      saveStoredProfile(currentUserProfile);
      return { ...currentUserProfile };
    }
    throw new Error('Not enough CWP or already adopted.');
  },

  feedPet: async (petId: string) => {
    if (currentUserProfile.petFood > 0 && currentUserProfile.petStates[petId]) {
      currentUserProfile.petFood -= 1;
      currentUserProfile.petStates[petId].hunger = 100;
      saveStoredProfile(currentUserProfile);
      return { ...currentUserProfile };
    }
    throw new Error('No food or pet not found.');
  },

  tickPets: async () => {
    let changed = false;
    currentUserProfile.activePets.forEach(petId => {
      const p = currentUserProfile.petStates[petId];
      if (p) {
        if (Math.random() < 0.05 && p.hunger > 0) { p.hunger -= 1; changed = true; }
        if (Math.random() < 0.05 && p.energy > 0) { p.energy -= 1; changed = true; }
        if (Math.random() < 0.05 && p.fun > 0) { p.fun -= 1; changed = true; }
      }
    });

    // Check interaction with items
    if (currentUserProfile.activePetItems.length > 0) {
      currentUserProfile.activePets.forEach(petId => {
        const p = currentUserProfile.petStates[petId];
        if (p) {
          const hasBed = currentUserProfile.activePetItems.includes('cat_bed') || currentUserProfile.activePetItems.includes('dog_house') || currentUserProfile.activePetItems.includes('eagle_perch');
          const hasToy = currentUserProfile.activePetItems.includes('toy_yarn') || currentUserProfile.activePetItems.includes('cat_tree') || currentUserProfile.activePetItems.includes('dog_bone') || currentUserProfile.activePetItems.includes('dog_frisbee') || currentUserProfile.activePetItems.includes('otter_pool') || currentUserProfile.activePetItems.includes('monkey_rope');
          
          if (hasBed && Math.random() < 0.05 && p.energy < 100) { p.energy += 2; changed = true; }
          if (hasToy && Math.random() < 0.05 && p.fun < 100) { p.fun += 2; changed = true; }
        }
      });
    }

    if (changed) saveStoredProfile(currentUserProfile);
    return { ...currentUserProfile };
  },

  addEcoCoins: async (amount: number) => {
    currentUserProfile.ecoCoins += amount;
    saveStoredProfile(currentUserProfile);
    return { ...currentUserProfile };
  },

  togglePet: async (petId: string) => {
    if (currentUserProfile.unlockedPets.includes(petId)) {
      const idx = currentUserProfile.activePets.indexOf(petId);
      if (idx > -1) {
        currentUserProfile.activePets.splice(idx, 1);
      } else {
        currentUserProfile.activePets.push(petId);
      }
      saveStoredProfile(currentUserProfile);
      return { ...currentUserProfile };
    }
    throw new Error('Pet not unlocked.');
  },

  buyFood: async (amount: number, cost: number) => {
    if (currentUserProfile.ecoCoins >= cost) {
      currentUserProfile.ecoCoins -= cost;
      currentUserProfile.petFood += amount;
      saveStoredProfile(currentUserProfile);
      return { ...currentUserProfile };
    }
    throw new Error('Not enough CWP.');
  },

  buyPetItem: async (itemId: string, cost: number) => {
    if (currentUserProfile.ecoCoins >= cost && !currentUserProfile.unlockedPetItems.includes(itemId)) {
      currentUserProfile.ecoCoins -= cost;
      currentUserProfile.unlockedPetItems.push(itemId);
      saveStoredProfile(currentUserProfile);
      return { ...currentUserProfile };
    }
    throw new Error('Not enough CWP or already unlocked.');
  },

  togglePetItem: async (itemId: string) => {
    if (currentUserProfile.unlockedPetItems.includes(itemId)) {
      const idx = currentUserProfile.activePetItems.indexOf(itemId);
      if (idx > -1) {
        currentUserProfile.activePetItems.splice(idx, 1);
      } else {
        currentUserProfile.activePetItems.push(itemId);
      }
      saveStoredProfile(currentUserProfile);
      return { ...currentUserProfile };
    }
    throw new Error('Item not unlocked.');
  },

  setActiveTheme: async (themeId: string) => {
    if (currentUserProfile.unlockedThemes.includes(themeId)) {
      currentUserProfile.activeTheme = themeId;
      saveStoredProfile(currentUserProfile);
      return { ...currentUserProfile };
    }
    throw new Error('Theme not unlocked.');
  },

  buyEffect: async (effectId: string, cost: number) => {
    if (currentUserProfile.ecoCoins >= cost && !currentUserProfile.unlockedEffects.includes(effectId)) {
      currentUserProfile.ecoCoins -= cost;
      currentUserProfile.unlockedEffects.push(effectId);
      saveStoredProfile(currentUserProfile);
      return { ...currentUserProfile };
    }
    throw new Error('Not enough CWP or already unlocked.');
  },

  toggleEffect: async (effectId: string) => {
    if (currentUserProfile.unlockedEffects.includes(effectId)) {
      const idx = currentUserProfile.activeEffects.indexOf(effectId);
      if (idx > -1) {
        currentUserProfile.activeEffects.splice(idx, 1);
      } else {
        currentUserProfile.activeEffects.push(effectId);
      }
      saveStoredProfile(currentUserProfile);
      return { ...currentUserProfile };
    }
    throw new Error('Effect not unlocked.');
  },

  updateBackground: async (url: string | null) => {
    currentUserProfile.activeBackground = url;
    saveStoredProfile(currentUserProfile);
    return { ...currentUserProfile };
  },

  updateUserProfile: async (name: string) => {
    currentUserProfile.name = name;
    currentUserProfile.isGuest = false;
    saveStoredProfile(currentUserProfile);
    return { ...currentUserProfile };
  },

  addReport: async (reportData: Omit<Report, 'id' | 'createdAt' | 'status'>) => {
    // In production, this maps to: addDoc(collection(db, 'reports'), data)
    const newReport: Report = {
      ...reportData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      createdAt: Date.now()
    };
    reports.push(newReport);
    
    // Gamification update
    userStats.reportsCount += 1;
    userStats.score += 50; // Points for reporting
    
    currentUserProfile.ecoCoins += 50; // Points to spend

    // Update Quests
    currentUserProfile.dailyQuests.forEach(quest => {
      if (!quest.completed) {
        if (quest.id === 'report_any_3') {
          quest.progress += 1;
        } else if (quest.id === 'report_critical' && newReport.pollutionImpact === 'Critical') {
          quest.progress += 1;
        }

        if (quest.progress >= quest.target) {
          quest.progress = quest.target;
          quest.completed = true;
          currentUserProfile.ecoCoins += quest.reward;
          alert(`🎉 Quest Selesai! Kamu mendapatkan ${quest.reward} CWP dari: ${quest.desc}`);
        }
      }
    });

    saveStoredProfile(currentUserProfile);
    
    // Give badge for every 5 reports
    if (userStats.reportsCount > 0 && userStats.reportsCount % 5 === 0) {
      if (!userStats.badges.includes('Pahlawan Ciliwung')) {
        userStats.badges.push('Pahlawan Ciliwung');
      }
    }
    
    return newReport;
  },
  
  markAsCollected: async (id: string) => {
    // In production, maps to: updateDoc(doc(db, 'reports', id), { status: 'Collected' })
    const idx = reports.findIndex(r => r.id === id);
    if (idx > -1) {
      reports[idx].status = 'Collected';
    }
  },
  
  getUserStats: async () => {
    return { ...userStats };
  }
};
