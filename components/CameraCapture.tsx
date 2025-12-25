import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, X } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please ensure permissions are granted.");
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Flip horizontally if using front camera for natural mirror effect
        if (facingMode === 'user') {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageSrc = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageSrc);
      }
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        {error ? (
          <div className="text-center p-6">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={startCamera}
              className="bg-white text-black px-6 py-2 rounded-full font-medium"
            >
              Retry
            </button>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            className={`absolute w-full h-full object-cover transition-transform ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} 
            playsInline 
            muted 
          />
        )}
        
        {/* Overlay Guides */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="border-2 border-white/50 w-64 h-80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-dashed"></div>
        </div>

        {/* Top Controls */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-10">
          <button onClick={onCancel} className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
            <X size={24} />
          </button>
          <div className="text-white/80 font-medium text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
            Align face in oval
          </div>
          <button onClick={switchCamera} className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
            <RefreshCw size={24} />
          </button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-32 bg-black flex items-center justify-center pb-4">
        <button 
          onClick={captureImage}
          disabled={!isStreaming || !!error}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-16 h-16 bg-white rounded-full"></div>
        </button>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
