import React from 'react';
import { AnalysisResult, HaircutSuggestion } from '../types';
import { Share2, RefreshCcw, Scissors, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisResult;
  imageSrc: string;
  onRetake: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, imageSrc, onRetake }) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 80) return 'text-emerald-400 border-emerald-500 from-emerald-500/20';
    if (rating >= 60) return 'text-yellow-400 border-yellow-500 from-yellow-500/20';
    return 'text-red-400 border-red-500 from-red-500/20';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 90) return 'Model Tier';
    if (rating >= 80) return 'Excellent';
    if (rating >= 70) return 'Good Looking';
    if (rating >= 60) return 'Average';
    return 'Needs Work';
  };

  return (
    <div className="min-h-screen bg-neutral-900 pb-20 overflow-y-auto no-scrollbar">
      {/* Header Image with Gradient Overlay */}
      <div className="relative h-96 w-full">
        <img 
          src={imageSrc} 
          alt="Selfie" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent"></div>
        
        {/* Floating Score Card */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm">
          <div className="bg-neutral-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 text-center">
             <div className="flex flex-col items-center">
                <div className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center mb-2 bg-gradient-to-br to-transparent ${getRatingColor(result.rating)}`}>
                  <span className="text-4xl font-bold text-white">{result.rating}</span>
                  <div className="absolute -bottom-2 px-3 py-1 bg-neutral-900 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-white/10">
                    Score
                  </div>
                </div>
                <h2 className={`text-xl font-bold ${getRatingColor(result.rating).split(' ')[0]}`}>
                  {getRatingLabel(result.rating)}
                </h2>
                <p className="text-neutral-400 text-sm mt-1">
                  Face Shape: <span className="text-white font-medium">{result.faceShape}</span>
                </p>
             </div>
          </div>
        </div>
      </div>

      <div className="mt-16 px-6 max-w-lg mx-auto space-y-8">
        
        {/* Critique Section */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="text-red-400" size={20} />
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">Areas for Improvement</h3>
          </div>
          <div className="bg-neutral-800/50 rounded-2xl p-5 border border-white/5 space-y-3">
            {result.critique.map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                <p className="text-neutral-300 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Best Features Section */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="text-emerald-400" size={20} />
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">Best Features</h3>
          </div>
          <div className="bg-neutral-800/50 rounded-2xl p-5 border border-white/5 space-y-3">
            {result.bestFeatures.map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                <p className="text-neutral-300 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Haircuts Section */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Scissors className="text-blue-400" size={20} />
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">Suggested Styles</h3>
          </div>
          <div className="space-y-4">
            {result.haircutSuggestions.map((cut, idx) => (
              <div key={idx} className="bg-neutral-800 rounded-2xl p-0 overflow-hidden border border-white/5 group">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-bold text-lg">{cut.name}</h4>
                    <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                      #{idx + 1}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-sm mb-3">{cut.description}</p>
                  <div className="bg-neutral-900/50 rounded-lg p-3">
                    <p className="text-blue-200/80 text-xs italic">
                      <span className="font-semibold text-blue-400">Why:</span> {cut.reason}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="h-8"></div> {/* Spacer */}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-neutral-900/80 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="flex gap-4 max-w-lg mx-auto">
          <button 
            onClick={onRetake}
            className="flex-1 bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 active:scale-95 transition-transform"
          >
            <RefreshCcw size={18} />
            <span>Scan New Face</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
