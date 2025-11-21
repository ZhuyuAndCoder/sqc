import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [isOpening, setIsOpening] = useState(false);
  const navigate = useNavigate();

  const handleEnvelopeClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      navigate('/letter');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-rose-200 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-rose-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-pink-400 rounded-full blur-2xl"></div>
      </div>

      {/* Envelope Container */}
      <div className="relative z-10">
        <div 
          className={`relative cursor-pointer transform transition-all duration-1000 hover:scale-105 ${
            isOpening ? 'animate-bounce' : ''
          }`}
          onClick={handleEnvelopeClick}
        >
          {/* Envelope Shadow */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-64 h-8 bg-pink-900 opacity-20 rounded-full blur-xl"></div>
          
          {/* Envelope Body */}
          <div className="relative w-80 h-56 bg-gradient-to-b from-pink-50 to-pink-100 rounded-lg shadow-2xl border border-pink-200">
            {/* Envelope Flap */}
            <div className={`absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-pink-100 to-pink-200 rounded-t-lg transform-origin-top transition-transform duration-1000 ${
              isOpening ? '-rotate-45 scale-110' : ''
            }`}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-300 opacity-30 rounded-t-lg"></div>
            </div>
            
            {/* Envelope Back Flap */}
            <div className={`absolute top-0 left-0 w-full h-28 bg-gradient-to-t from-pink-200 to-pink-300 rounded-b-lg transform-origin-top transition-transform duration-1000 delay-300 ${
              isOpening ? 'rotate-45 scale-110' : ''
            }`}></div>
            
            {/* Ribbon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-20 h-6 bg-gradient-to-r from-red-400 to-pink-500 rounded-full shadow-lg relative">
                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full"></div>
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-pink-500 rounded-full"></div>
              </div>
            </div>
            
            {/* Heart Seal */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className={`w-8 h-8 text-red-500 transition-all duration-500 ${
                isOpening ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
              }`}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
            
            {/* Inner Letter Preview */}
            <div className={`absolute inset-4 bg-pink-50 rounded opacity-0 transition-opacity duration-1000 ${
              isOpening ? 'opacity-100' : ''
            }`}>
              <div className="p-4 text-pink-800 text-sm font-serif">
                <div className="h-2 bg-pink-200 rounded mb-2"></div>
                <div className="h-2 bg-pink-200 rounded mb-2 w-3/4"></div>
                <div className="h-2 bg-pink-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Click Instruction */}
        <div className={`text-center mt-8 transition-opacity duration-500 ${
          isOpening ? 'opacity-0' : 'opacity-100'
        }`}>
          <p className="text-pink-700 text-lg font-medium animate-pulse">
            点击信封，开启浪漫之旅 💕
          </p>
        </div>
      </div>
    </div>
  );
}