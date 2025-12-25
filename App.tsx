import React, { useState } from 'react';
import { AppState, AnalysisResult } from './types';
import Intro from './components/Intro';
import CameraCapture from './components/CameraCapture';
import AnalysisResults from './components/AnalysisResults';
import { analyzeFace } from './services/geminiService';
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('intro');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStart = () => {
    setState('camera');
    setErrorMsg(null);
  };

  const handleCapture = (capturedImage: string) => {
    setImageSrc(capturedImage);
    setState('preview');
  };

  const handleRetake = () => {
    setImageSrc(null);
    setAnalysisResult(null);
    setState('camera');
  };

  const handleConfirm = async () => {
    if (!imageSrc) return;
    
    setState('analyzing');
    setErrorMsg(null);
    
    try {
      const result = await analyzeFace(imageSrc);
      setAnalysisResult(result);
      setState('results');
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to analyze image. Please try again or use a clearer photo.");
      setState('error');
    }
  };

  const resetApp = () => {
    setState('intro');
    setImageSrc(null);
    setAnalysisResult(null);
    setErrorMsg(null);
  };

  // -- Render based on State --

  if (state === 'intro') {
    return <Intro onStart={handleStart} />;
  }

  if (state === 'camera') {
    return (
      <CameraCapture 
        onCapture={handleCapture} 
        onCancel={() => setState('intro')} 
      />
    );
  }

  if (state === 'preview') {
    return (
      <div className="h-screen bg-black flex flex-col relative">
        <div className="flex-1 relative">
           {imageSrc && (
             <img 
               src={imageSrc} 
               alt="Preview" 
               className="w-full h-full object-cover" 
             />
           )}
           <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/60 to-transparent">
             <button onClick={handleRetake} className="text-white p-2 bg-white/10 backdrop-blur-md rounded-full">
                <ArrowLeft size={24} />
             </button>
           </div>
        </div>
        <div className="bg-neutral-900 p-6 flex flex-col gap-3 border-t border-white/10">
           <h3 className="text-white font-bold text-lg text-center mb-2">Use this photo?</h3>
           <button 
             onClick={handleConfirm}
             className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
           >
             Analyze Now
           </button>
           <button 
             onClick={handleRetake}
             className="w-full bg-neutral-800 text-white font-medium py-4 rounded-xl active:scale-95 transition-transform border border-white/10"
           >
             Retake
           </button>
        </div>
      </div>
    );
  }

  if (state === 'analyzing') {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Animated gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 border-4 border-t-blue-500 border-white/10 rounded-full animate-spin mb-8"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Scanning Features</h2>
            <p className="text-neutral-400">Measuring symmetry, skin quality, and face geometry...</p>
        </div>
      </div>
    );
  }

  if (state === 'results' && analysisResult && imageSrc) {
    return (
      <AnalysisResults 
        result={analysisResult} 
        imageSrc={imageSrc} 
        onRetake={resetApp} 
      />
    );
  }

  if (state === 'error') {
     return (
        <div className="h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
            <p className="text-neutral-400 mb-8">{errorMsg || "Something went wrong."}</p>
            <button 
             onClick={handleRetake}
             className="px-8 py-3 bg-white text-black font-bold rounded-full active:scale-95 transition-transform"
           >
             Try Again
           </button>
        </div>
     );
  }

  return null;
};

export default App;
