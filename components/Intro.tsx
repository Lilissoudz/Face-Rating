import React from 'react';
import { Camera, ScanFace, Sparkles } from 'lucide-react';

interface IntroProps {
  onStart: () => void;
}

const Intro: React.FC<IntroProps> = ({ onStart }) => {
  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-between p-8 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="mt-12 text-center z-10">
        <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-6 backdrop-blur-md border border-white/10 ring-1 ring-white/20">
          <ScanFace className="text-white w-8 h-8" />
        </div>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400 mb-4 tracking-tight">
          FaceRate
        </h1>
        <p className="text-neutral-400 text-lg max-w-xs mx-auto leading-relaxed">
          AI-powered facial aesthetics analysis and personalized style recommendations.
        </p>
      </div>

      <div className="w-full max-w-xs z-10 space-y-6">
        <div className="space-y-4">
            <div className="flex items-center space-x-4 bg-neutral-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="p-2 bg-blue-500/20 rounded-full text-blue-400">
                    <ScanFace size={20} />
                </div>
                <div className="text-left">
                    <h3 className="text-white font-bold text-sm">Face Shape Scan</h3>
                    <p className="text-neutral-500 text-xs">Precise geometric analysis</p>
                </div>
            </div>
            <div className="flex items-center space-x-4 bg-neutral-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="p-2 bg-purple-500/20 rounded-full text-purple-400">
                    <Sparkles size={20} />
                </div>
                <div className="text-left">
                    <h3 className="text-white font-bold text-sm">Aesthetic Rating</h3>
                    <p className="text-neutral-500 text-xs">Objective 0-100 score</p>
                </div>
            </div>
        </div>

        <button 
          onClick={onStart}
          className="w-full bg-white text-black font-bold text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 transition-all flex items-center justify-center space-x-2 group hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
        >
          <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>Start Analysis</span>
        </button>
        
        <p className="text-neutral-600 text-xs text-center">
            By continuing, you agree to our Terms. Photos are processed temporarily and not stored.
        </p>
      </div>
    </div>
  );
};

export default Intro;
