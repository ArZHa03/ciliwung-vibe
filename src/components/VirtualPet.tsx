import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';
import { store, UserProfile } from '../lib/store';

// Helper custom hook for screen size and mouse tracking
function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    
    // Only track mouse if not on mobile touch screen
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener('mousemove', updateMousePosition);
    }
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
}

export function VirtualPetsOverlay() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bubbles, setBubbles] = useState<{ id: string; x: number }[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    // Poll for changes effectively (in a real app we'd use a context or subscribe)
    const interval = setInterval(() => {
      store.getUserProfile().then(setProfile);
    }, 1000);
    
    const bubbleInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        setBubbles(prev => {
          if (prev.length >= 10) return prev;
          return [...prev, { id: Math.random().toString(), x: Math.random() * (window.innerWidth - 60) + 30 }];
        });
      }
    }, 4000);

    const handleToast = (e: any) => {
      setToast(e.detail.message);
      setTimeout(() => setToast(null), 4000);
    };
    window.addEventListener('pet-toast', handleToast);
    
    return () => {
      clearInterval(interval);
      clearInterval(bubbleInterval);
      window.removeEventListener('pet-toast', handleToast);
    };
  }, []);

  const handlePop = (id: string, x: number, y: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    
    if (y > 0) {
      store.addEcoCoins(1).catch(e => console.log(e));
      
      // Create pop effect
      const pop = document.createElement('div');
      pop.innerText = '+1 CWP 🫧';
      pop.className = 'fixed text-neon-cyan font-black text-lg pointer-events-none drop-shadow-[0_0_10px_rgba(0,242,255,0.8)] z-[60] select-none';
      pop.style.left = `${x}px`;
      pop.style.top = `${y}px`;
      pop.animate([
        { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'hue-rotate(0deg)' },
        { opacity: 0, transform: 'translateY(-60px) scale(1.5)', filter: 'hue-rotate(180deg)' }
      ], { duration: 1000, easing: 'ease-out' });
      document.body.appendChild(pop);
      
      // Add some tiny sparkles
      for(let i=0; i<5; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerText = '✨';
        sparkle.className = 'fixed pointer-events-none z-[59] text-xs';
        sparkle.style.left = `${x + (Math.random()-0.5)*40}px`;
        sparkle.style.top = `${y + (Math.random()-0.5)*40}px`;
        sparkle.animate([
            { opacity: 1, transform: 'translate(0,0) scale(1)' },
            { opacity: 0, transform: `translate(${(Math.random()-0.5)*100}px, ${(Math.random()-0.5)*100}px) scale(0)` }
        ], { duration: 800 + Math.random()*400, easing: 'ease-out' });
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1200);
      }

      setTimeout(() => pop.remove(), 1000);
    }
  };

  if (!profile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 20, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className="fixed top-0 left-1/2 bg-red-500/90 text-white px-4 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(239,68,68,0.5)] z-[100] text-sm whitespace-nowrap"
        >
          {toast}
        </motion.div>
      )}

      {bubbles.map(b => (
        <Bubble key={b.id} id={b.id} x={b.x} onPop={(y) => handlePop(b.id, b.x, y)} />
      ))}
      
      {profile.activePets.includes('oren') && <Cat petId="oren" icon="🐱" speed={2} profile={profile} />}
      {profile.activePets.includes('hitam') && <Cat petId="hitam" icon="🐈‍⬛" speed={3} profile={profile} />}
      {profile.activePets.includes('putih') && <Cat petId="putih" icon="😸" speed={1.5} profile={profile} />}
      {profile.activePets.includes('chihuahua') && <Cat petId="chihuahua" icon="🐕" speed={4} profile={profile} />}
      {profile.activePets.includes('bulldog') && <Cat petId="bulldog" icon="🐶" speed={1} profile={profile} />}
      {profile.activePets.includes('golden') && <Cat petId="golden" icon="🦮" speed={2.5} profile={profile} />}
      {profile.activePets.includes('berang_berang') && <Cat petId="berang_berang" icon="🦦" speed={3.5} profile={profile} />}
      {profile.activePets.includes('elang_bondol') && <Cat petId="elang_bondol" icon="🦅" speed={5} profile={profile} />}
      {profile.activePets.includes('monyet') && <Cat petId="monyet" icon="🐒" speed={4.5} profile={profile} />}
      
      {profile.activePetItems?.includes('toy_yarn') && <PetItem itemId="toy_yarn" icon="🧶" />}
      {profile.activePetItems?.includes('cat_bed') && <PetItem itemId="cat_bed" icon="🛏️" />}
      {profile.activePetItems?.includes('litter_box') && <PetItem itemId="litter_box" icon="📦" />}
      {profile.activePetItems?.includes('cat_tree') && <PetItem itemId="cat_tree" icon="🌴" />}
      {profile.activePetItems?.includes('dog_bone') && <PetItem itemId="dog_bone" icon="🦴" />}
      {profile.activePetItems?.includes('dog_frisbee') && <PetItem itemId="dog_frisbee" icon="🥏" />}
      {profile.activePetItems?.includes('dog_house') && <PetItem itemId="dog_house" icon="🛖" />}
      {profile.activePetItems?.includes('otter_pool') && <PetItem itemId="otter_pool" icon="🛁" />}
      {profile.activePetItems?.includes('eagle_perch') && <PetItem itemId="eagle_perch" icon="🪵" />}
      {profile.activePetItems?.includes('monkey_rope') && <PetItem itemId="monkey_rope" icon="🪢" />}
    </div>
  );
}

interface BubbleProps {
  id: string;
  x: number;
  onPop: (y: number) => void;
  key?: React.Key;
}

function Bubble({ id, x, onPop }: BubbleProps) {
  const duration = 10 + Math.random() * 8;
  const drift = (Math.random() - 0.5) * 100;

  return (
    <motion.div
      id={`bubble-${id}`}
      data-x={x}
      className="absolute bottom-[-50px] pointer-events-auto cursor-crosshair flex flex-col items-center group"
      initial={{ y: 0, x, opacity: 0.8, scale: 0.5 }}
      animate={{ 
        y: -window.innerHeight - 100, 
        x: x + drift,
        opacity: [0.8, 1, 1, 0]
      }}
      transition={{ duration, ease: "linear" }}
      onAnimationComplete={() => onPop(-100)}
      onMouseDown={(e: React.MouseEvent) => onPop(e.pageY)}
      onTouchStart={(e: React.TouchEvent) => onPop(e.touches[0].pageY)}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.8 }}
    >
      <div className="text-3xl drop-shadow-[0_0_8px_rgba(0,242,255,0.6)] select-none">🫧</div>
    </motion.div>
  );
}

function PetItem({ itemId, icon }: { itemId: string, icon: string }) {
  const [pos, setPos] = useState({ 
    x: Math.random() * (window.innerWidth - 100) + 50, 
    y: window.innerHeight - 150 - (Math.random() * 50) 
  });
  
  const vel = useRef({ x: 0, y: 0 });
  const posRef = useRef(pos);
  const isDragging = useRef(false);

  useEffect(() => {
    let frame: number;
    const tick = () => {
       if (!isDragging.current) {
         vel.current.x *= 0.95;
         vel.current.y *= 0.95;
         
         if (Math.abs(vel.current.x) > 0.1 || Math.abs(vel.current.y) > 0.1) {
            posRef.current.x += vel.current.x;
            posRef.current.y += vel.current.y;
            
            if (posRef.current.x < 0) { posRef.current.x = 0; vel.current.x *= -0.7; }
            if (posRef.current.x > window.innerWidth - 50) { posRef.current.x = window.innerWidth - 50; vel.current.x *= -0.7; }
            if (posRef.current.y < 0) { posRef.current.y = 0; vel.current.y *= -0.7; }
            if (posRef.current.y > window.innerHeight - 50) { posRef.current.y = window.innerHeight - 50; vel.current.y *= -0.7; }
            
            setPos({ ...posRef.current });
         }
       }
       frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handlePetMoved = (e: any) => {
       if (isDragging.current) return;
       const pet = e.detail;
       const dx = pet.x - posRef.current.x;
       const dy = pet.y - posRef.current.y;
       const dist = Math.sqrt(dx * dx + dy * dy);
       // Collision!
       if (dist < 40 && dist > 0) { 
          const pushForce = (pet.speed || 2);
          const pushX = (dx / dist) * pushForce;
          const pushY = (dy / dist) * pushForce;
          vel.current.x -= pushX * 1.5;
          vel.current.y -= pushY * 1.5;
       }
    };
    window.addEventListener('pet-moved', handlePetMoved);
    return () => window.removeEventListener('pet-moved', handlePetMoved);
  }, []);

  return (
    <motion.div
      id={`pet-item-${itemId}`}
      className="absolute pointer-events-auto cursor-grab active:cursor-grabbing"
      style={{ left: pos.x, top: pos.y, transform: `rotate(${vel.current.x * 3}deg)` }}
      onPanStart={() => isDragging.current = true}
      onPan={(e, info) => {
        posRef.current.x += info.delta.x;
        posRef.current.y += info.delta.y;
        vel.current.x = info.delta.x;
        vel.current.y = info.delta.y;
        setPos({ ...posRef.current });
      }}
      onPanEnd={(e, info) => {
        isDragging.current = false;
        vel.current.x = info.velocity.x / 50;
        vel.current.y = info.velocity.y / 50;
      }}
    >
      <div className="text-4xl drop-shadow-lg pointer-events-none">
        {icon}
      </div>
    </motion.div>
  );
}

function Cat({ petId, icon, speed, profile }: { petId: string, icon: string, speed: number, profile: UserProfile }) {
  const mouse = useMousePosition();
  const [pos, setPos] = useState({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight });
  const [isFeeding, setIsFeeding] = useState(false);
  const [isHappy, setIsHappy] = useState(false);
  const [isConfused, setIsConfused] = useState(false);
  const [petState, setPetState] = useState<'IDLE' | 'WANDER' | 'FOLLOW' | 'GO_HOME' | 'INTERACT' | 'CHASE_BUBBLE'>('WANDER');
  const [activeItem, setActiveItem] = useState<string | null>(null);
  
  const targetRef = useRef({ x: pos.x, y: pos.y, itemId: null as string | null, bubbleId: null as string | null });
  const viewRef = useRef({ moving: true, facing: 1 }); // 1 = right, -1 = left
  const [renderTick, setRenderTick] = useState(0);

  const hunger = profile.petStates?.[petId]?.hunger ?? 100;
  const energy = profile.petStates?.[petId]?.energy ?? 100;
  const fun = profile.petStates?.[petId]?.fun ?? 100;

  // Recall logic
  useEffect(() => {
    const handleRecall = (e: any) => {
      if (e.detail.petId !== petId) return;

      const requiredItems: Record<string, string[]> = {
        oren: ['cat_bed', 'cat_tree', 'litter_box'],
        hitam: ['cat_bed', 'cat_tree', 'litter_box'],
        putih: ['cat_bed', 'cat_tree', 'litter_box'],
        chihuahua: ['dog_house'],
        bulldog: ['dog_house'],
        golden: ['dog_house'],
        berang_berang: ['otter_pool'],
        elang_bondol: ['eagle_perch'],
        monyet: ['monkey_rope']
      };

      const items = requiredItems[petId] || [];
      const foundItem = items.find(item => profile.activePetItems.includes(item));
      
      if (!foundItem) {
        setIsConfused(true);
        setTimeout(() => setIsConfused(false), 3000);
        window.dispatchEvent(new CustomEvent('pet-toast', { 
          detail: { message: `Kandang/tempat istirahat untuk fauna ini belum dipasang!` } 
        }));
        return;
      }

      // Find DOM node of the item
      const node = document.getElementById(`pet-item-${foundItem}`);
      if (node) {
        const rect = node.getBoundingClientRect();
        targetRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, itemId: null };
        setPetState('GO_HOME');
      } else {
        // Fallback if not found on screen for some reason
        store.togglePet(petId);
      }
    };

    window.addEventListener('recall-pet', handleRecall);
    return () => window.removeEventListener('recall-pet', handleRecall);
  }, [petId, profile.activePetItems]);

  // Behavior state machine
  useEffect(() => {
    const interval = setInterval(() => {
      if (petState === 'GO_HOME' || petState === 'CHASE_BUBBLE') return;

      const rand = Math.random();
      
      // Chance to chase a bubble if any exist
      const bubbleNodes = document.querySelectorAll('[id^="bubble-"]');
      if (bubbleNodes.length > 0 && Math.random() < 0.4) {
        const randomBubble = bubbleNodes[Math.floor(Math.random() * bubbleNodes.length)] as HTMLElement;
        const rect = randomBubble.getBoundingClientRect();
        targetRef.current = { 
          x: rect.left + rect.width / 2, 
          y: rect.top + rect.height / 2, 
          itemId: null,
          bubbleId: randomBubble.id.replace('bubble-', '') 
        };
        setPetState('CHASE_BUBBLE');
        return;
      }

      if (rand < 0.2) {
        setPetState('FOLLOW');
      } else if (rand < 0.35) {
        // Find a random pet item to play with
        const itemNodes = document.querySelectorAll('[id^="pet-item-"]');
        if (itemNodes.length > 0) {
           const randomNode = itemNodes[Math.floor(Math.random() * itemNodes.length)];
           const rect = randomNode.getBoundingClientRect();
           targetRef.current = { 
             x: rect.left + rect.width / 2, 
             y: rect.top + rect.height / 2, 
             itemId: randomNode.id.replace('pet-item-', ''),
             bubbleId: null
           };
        } else {
           targetRef.current = {
             x: Math.random() * (window.innerWidth - 150) + 75,
             y: Math.random() * (window.innerHeight - 150) + 75,
             itemId: null,
             bubbleId: null
           };
        }
        setPetState('WANDER');
      } else if (rand < 0.7) {
        setPetState('WANDER');
        targetRef.current = {
          x: Math.random() * (window.innerWidth - 150) + 75,
          y: Math.random() * (window.innerHeight - 150) + 75,
          itemId: null,
          bubbleId: null
        };
      } else {
        setPetState('IDLE');
        if (viewRef.current.moving) {
          viewRef.current.moving = false;
          setRenderTick(t => t + 1);
        }
      }
    }, 4000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [petState]);

  useEffect(() => {
    if (petState !== 'INTERACT') setActiveItem(null);
  }, [petState]);

  // Physics loop
  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      setPos(prev => {
        let tx = targetRef.current.x;
        let ty = targetRef.current.y;

        // If chasing a bubble, update its position dynamically
        if (petState === 'CHASE_BUBBLE' && targetRef.current.bubbleId) {
          const bubbleNode = document.getElementById(`bubble-${targetRef.current.bubbleId}`);
          if (bubbleNode) {
            const rect = bubbleNode.getBoundingClientRect();
            tx = rect.left + rect.width / 2;
            ty = rect.top + rect.height / 2;
            targetRef.current.x = tx;
            targetRef.current.y = ty;
          } else {
            // Bubble gone, go back to wander
            setPetState('WANDER');
            return prev;
          }
        }

        // If following, use mouse. If mobile and no mouse move, defaults to center, which we can ignore
        if (petState === 'FOLLOW') {
           // Skip if mouse is exactly at center (initial state and unbroken)
           if (mouse.x === window.innerWidth / 2 && mouse.y === window.innerHeight / 2) {
             tx = prev.x; ty = prev.y;
           } else {
             tx = mouse.x; ty = mouse.y;
           }
        } else if (petState === 'IDLE' || petState === 'INTERACT') {
          if (viewRef.current.moving) {
            viewRef.current.moving = false;
            setRenderTick(t => t + 1);
          }
          return prev;
        }

        const dx = tx - prev.x;
        const dy = ty - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const currentSpeed = (petState === 'CHASE_BUBBLE') ? speed * 2 : speed;

        if (dist < 40) {
          if (petState === 'GO_HOME') {
             store.togglePet(petId); // finally remove
             return prev;
          }
          if (petState === 'CHASE_BUBBLE' && targetRef.current.bubbleId) {
            const bubbleNode = document.getElementById(`bubble-${targetRef.current.bubbleId}`);
            if (bubbleNode) {
               // Trigger click effect on the bubble node
               bubbleNode.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
            }
            setPetState('WANDER');
            return prev;
          }
          if (petState === 'WANDER' && targetRef.current.itemId) {
              setPetState('INTERACT');
              setActiveItem(targetRef.current.itemId);
          }
          if (viewRef.current.moving) {
             viewRef.current.moving = false;
             setRenderTick(t => t + 1);
          }
          return prev; // Reached target
        }

        const vx = (dx / dist) * currentSpeed;
        const vy = (dy / dist) * currentSpeed;
        
        let changed = false;
        if (!viewRef.current.moving) {
          viewRef.current.moving = true; changed = true;
        }
        if (vx > 0.5 && viewRef.current.facing !== 1) {
          viewRef.current.facing = 1; changed = true;
        } else if (vx < -0.5 && viewRef.current.facing !== -1) {
          viewRef.current.facing = -1; changed = true;
        }
        
        if (changed) setRenderTick(t => t + 1);

        const nx = prev.x + vx;
        const ny = prev.y + vy;
        
        window.dispatchEvent(new CustomEvent('pet-moved', { 
           detail: { petId, x: nx, y: ny, vx, vy, speed } 
        }));

        return { x: nx, y: ny };
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(animationFrameId);
  }, [mouse, speed, petState]);

  const { moving, facing } = viewRef.current;

  let customAnimate: any = null;
  let customTransition: any = null;
  
  if (petState === 'INTERACT' && activeItem) {
     if (petId === 'monyet' && activeItem === 'monkey_rope') {
         customAnimate = { rotate: [0, 20, -20, 0], y: [-10, -30, -10] };
         customTransition = { repeat: Infinity, duration: 2.5, ease: 'easeInOut' };
     } else if (petId === 'berang_berang' && activeItem === 'otter_pool') {
         customAnimate = { y: [0, 5, 0], rotate: [-5, 5, -5] };
         customTransition = { repeat: Infinity, duration: 1.5, ease: 'easeInOut' };
     } else if (petId === 'elang_bondol' && activeItem === 'eagle_perch') {
         customAnimate = { scaleY: [1, 0.8, 1], y: [-30, -30, -30] };
         customTransition = { repeat: Infinity, duration: 1, ease: 'easeInOut' };
     } else if (petId.includes('putih') || petId.includes('oren') || petId.includes('hitam')) {
         if (activeItem === 'cat_bed') {
             customAnimate = { scale: [1, 1.05, 1], rotate: [90, 90, 90] };
             customTransition = { repeat: Infinity, duration: 3, ease: 'easeInOut' };
         } else if (activeItem === 'cat_tree') {
             customAnimate = { y: [-50, -50, -50] };
         } else {
             // touching default
             customAnimate = { rotate: [0, 10, -10, 0] };
             customTransition = { repeat: Infinity, duration: 0.5 };
         }
     } else {
         // touching default
         customAnimate = { rotate: [0, 10, -10, 0] };
         customTransition = { repeat: Infinity, duration: 0.5 };
     }
  }

  const animateProps = customAnimate || (moving 
    ? { y: [0, -10, 0], rotate: [-10, 10, -10] } // walking animation
    : { scale: [1, 1.05, 1] }); // idle breathing

  const transitionProps = customTransition || (moving 
    ? { repeat: Infinity, duration: 0.4 / (speed / 2), ease: 'linear' } 
    : { repeat: Infinity, duration: 2, ease: 'easeInOut' });

  return (
    <motion.div
      className="absolute pointer-events-auto cursor-pointer flex flex-col items-center"
      animate={{ 
        x: pos.x - 20, 
        y: pos.y - 20, 
        scaleX: facing 
      }}
      transition={{ type: 'tween', ease: 'linear', duration: 0 }}
      onClick={() => {
        setIsHappy(true);
        setTimeout(() => setIsHappy(false), 2000);
        
        if (profile.petFood > 0) {
          setIsFeeding(true);
          store.feedPet(petId).catch(e => console.log(e));
          setTimeout(() => setIsFeeding(false), 2000);
        } else {
          window.dispatchEvent(new CustomEvent('pet-toast', { 
            detail: { message: `Kamu tidak punya Makanan!` } 
          }));
        }
      }}
    >
      {(isFeeding || isHappy) && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.5 }}
          animate={{ opacity: 1, y: -40, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="text-lg absolute -top-8 select-none"
          style={{ transform: `scaleX(${facing})` }} // invert back so emoji isn't reversed
        >
          {isFeeding ? '🍖' : '❤️'}
        </motion.div>
      )}

      {isConfused && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: -20 }}
          exit={{ opacity: 0 }}
          className="text-lg absolute -top-8 font-bold"
          style={{ transform: `scaleX(${facing})` }}
        >
          ❓
        </motion.div>
      )}
      
      {!isFeeding && !isConfused && hunger < 30 && (
         <div className="absolute -top-6 bg-white text-black text-[10px] px-1 rounded-sm font-bold shadow-md" style={{ transform: `scaleX(${facing})` }}>
            Lapar!
         </div>
      )}
      {!isFeeding && hunger >= 30 && energy < 30 && (
         <div className="absolute -top-6 bg-white text-black text-[10px] px-1 rounded-sm font-bold shadow-md" style={{ transform: `scaleX(${facing})` }}>
            Ngantuk 💤
         </div>
      )}
      {!isFeeding && hunger >= 30 && energy >= 30 && fun < 30 && (
         <div className="absolute -top-6 bg-white text-black text-[10px] px-1 rounded-sm font-bold shadow-md" style={{ transform: `scaleX(${facing})` }}>
            Bosan 😒
         </div>
      )}

      <motion.div 
        className="text-4xl drop-shadow-lg"
        animate={animateProps}
        transition={transitionProps}
        whileHover={{ scale: 1.2, rotate: 0 }}
        whileTap={{ scale: 0.9 }}
      >
        {icon}
      </motion.div>
    </motion.div>
  );
}
