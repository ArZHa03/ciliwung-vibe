import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Upload, Mic, Trash2, ShieldAlert, Zap, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeTrashImage, TrashAnalysisResult } from '../lib/gemini';
import { store } from '../lib/store';
import { useVoiceAssistant } from '../lib/useVoiceAssistant';
import { cn } from '../lib/utils';
import useSound from 'use-sound';

export default function ReporterPage() {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<TrashAnalysisResult | null>(null);
  const [reportSuccess, setReportSuccess] = useState(false);
  
  // Voice command handling
  const handleVoiceCommand = (text: string) => {
    const cmd = text.toLowerCase();
    if (cmd.includes('foto') || cmd.includes('jepret') || cmd.includes('ambil')) {
      capture();
    } else if (cmd.includes('kirim') || cmd.includes('lapor')) {
      if (result) submitReport();
    }
  };
  
  const { isListening, startListening, supported: voiceSupported } = useVoiceAssistant(handleVoiceCommand);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      processImage(imageSrc);
    }
  }, [webcamRef]);

  const processImage = async (base64Img: string) => {
    setIsAnalyzing(true);
    try {
      const data = await analyzeTrashImage(base64Img);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Gagal memproses gambar lingkungan");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const submitReport = async () => {
    if (!image || !result) return;
    
    // Auto geo-tagging simulation
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await store.addReport({
          imageUrl: image,
          trashType: result.trashType,
          pollutionImpact: result.pollutionImpact,
          weightEstimateKg: result.weightEstimateKg,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setReportSuccess(true);
      },
      async () => {
        // Fallback to central Ciliwung coordinate
        await store.addReport({
          imageUrl: image,
          trashType: result.trashType,
          pollutionImpact: result.pollutionImpact,
          weightEstimateKg: result.weightEstimateKg,
          latitude: -6.2088,
          longitude: 106.8456
        });
        setReportSuccess(true);
      }
    );
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setReportSuccess(false);
  };

  if (reportSuccess && result) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 mt-6">
        
        {/* WOW FACTOR: Self-Purification calculation initiated after report submitted */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-neon-cyan mb-4">Self-Purification Simulation</h2>
            <p className="text-sm text-white/70 mb-4">AI prediction based on current flow rate and <strong>{result.weightEstimateKg}kg</strong> of pollution removed from this coordinate.</p>
          </div>
          <div className="flex items-center gap-4 bg-cyan-400/10 p-4 rounded-xl border border-cyan-400/20">
            <div className="text-4xl font-bold stat-value text-neon-cyan">{String(result.selfPurificationDays).padStart(2, '0')}</div>
            <div className="text-[11px] uppercase leading-tight font-bold text-cyan-200">Days until<br/>Water Clarity</div>
          </div>
        </div>

        <div className="glass-panel flex flex-col items-center justify-center p-8 space-y-6 text-center">
          <div className="w-24 h-24 bg-eco-green/10 rounded-full flex items-center justify-center border border-eco-green/20">
            <Award className="w-12 h-12 text-eco-green neon-text-green" />
          </div>
          <h2 className="text-3xl font-black text-white neon-text-cyan uppercase">REPORT RECEIVED</h2>
          <p className="text-white/70 italic text-sm max-w-sm">You earned +50 Vibe Score! Keep helping the community clean up the Ciliwung River to earn the Hero Badge.</p>
          <button onClick={reset} className="px-6 py-3 bg-neon-cyan text-black font-black text-[12px] uppercase tracking-tighter rounded-md neon-border hover:bg-cyan-300 transition-all">
            REPORT ANOTHER ZONE
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neon-cyan">AI Vision Reporter</h2>
          <p className="text-[10px] uppercase font-mono tracking-widest text-white/30 mt-1">Gemini 2.5 Flash Integrated</p>
        </div>
        
        {voiceSupported && (
          <button 
            onClick={startListening}
            className={cn(
              "px-3 py-1 font-black text-[10px] uppercase tracking-tighter rounded-md flex items-center gap-2 transition-all duration-300 border",
              isListening ? "bg-red-500/20 border-red-500/50 text-red-400" : "bg-cyan-400/20 text-cyan-400 border-cyan-400/30 hover:border-cyan-400"
            )}
          >
            <Mic className={cn("w-3 h-3", isListening && "animate-pulse")} />
            {isListening ? 'Mendengarkan...' : 'Voice Mode'}
          </button>
        )}
      </div>

      <div className="glass-panel overflow-hidden relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {!image ? (
            <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
              {/* @ts-ignore */}
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                className="w-full h-full object-cover aspect-[4/3] sm:aspect-video rounded-t-2xl"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
                <button 
                  onClick={capture}
                  className="w-16 h-16 rounded-full bg-white/20 border-4 border-neon-cyan flex items-center justify-center hover:bg-white/30 transition-all backdrop-blur-md group"
                >
                  <Camera className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/20">
                <img src={image} alt="Captured" className="w-full h-full object-cover" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                    <RefreshCw className="w-8 h-8 text-neon-cyan animate-spin" />
                    <p className="text-neon-cyan font-mono text-sm tracking-widest animate-pulse">GEMINI_MENGANALISIS_CITRA...</p>
                  </div>
                )}
              </div>

              {!isAnalyzing && result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                      <div className="flex justify-between text-[11px] font-mono mb-2">
                        <span className="text-white/60">TIPE SAMPAH</span>
                      </div>
                      <p className="font-mono text-[10px] leading-relaxed text-eco-green uppercase">{result.trashType}</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                      <div className="flex justify-between text-[11px] font-mono mb-2">
                        <span className="text-white/60">DAMPAK AREA</span>
                      </div>
                      <p className={cn(
                        "font-mono text-[10px] leading-relaxed uppercase",
                        result.pollutionImpact === 'Critical' ? 'text-red-400' :
                        result.pollutionImpact === 'High' ? 'text-orange-400' :
                        result.pollutionImpact === 'Moderate' ? 'text-yellow-400' : 'text-eco-green'
                      )}>{result.pollutionImpact}</p>
                    </div>
                  </div>

                  {/* AI Action Recommendation */}
                  <div className="bg-black/40 p-3 rounded-lg border border-cyan-900/40 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan"></div>
                     <div className="text-[11px] font-mono mb-1 text-neon-cyan/80">REKOMENDASI AKSI (AI)</div>
                     <p className="font-mono text-[10px] leading-relaxed text-cyan-50">
                       {result.actionRecommendation || "Pilah dan laporkan ke pengepul terdekat."}
                     </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={reset} className="px-4 py-2 bg-white/5 text-white/70 font-bold text-[11px] uppercase tracking-tighter rounded-md border border-white/10 hover:bg-white/10 transition-colors flex-1 text-center">
                      RE-SCAN
                    </button>
                    <button onClick={submitReport} className="flex-[2] py-2 px-4 rounded-md bg-neon-cyan text-black font-black text-[11px] uppercase tracking-tighter transition-all flex items-center justify-center gap-2 neon-border">
                      <Upload className="w-4 h-4" /> REPORT TO CIRCULAR HUB
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
