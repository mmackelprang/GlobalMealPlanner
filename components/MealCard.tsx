
import React, { useState } from 'react';
import { MealPart } from '../types';

interface MealCardProps {
  part: MealPart;
  label: string;
  icon: string;
  onSwap: (guidance?: string) => void;
  isSwapping: boolean;
}

const MealCard: React.FC<MealCardProps> = ({ part, label, icon, onSwap, isSwapping }) => {
  const [showGuidance, setShowGuidance] = useState(false);
  const [guidance, setGuidance] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guidance.trim()) return;
    onSwap(guidance);
    setGuidance('');
    setShowGuidance(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-stone-200 overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow relative">
      <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 flex justify-between items-center">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2">
          <i className={`${icon} text-orange-600`}></i>
          {label}
        </span>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowGuidance(!showGuidance)}
            className={`text-stone-400 hover:text-orange-600 transition-colors ${showGuidance ? 'text-orange-600' : ''}`}
            title="Add guidance for swap"
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </button>
          <button 
            onClick={() => onSwap()}
            disabled={isSwapping}
            className="text-stone-400 hover:text-orange-600 transition-colors disabled:opacity-50"
            title="Random swap"
          >
            <i className={`fa-solid fa-arrows-rotate ${isSwapping ? 'animate-spin' : ''}`}></i>
          </button>
        </div>
      </div>

      {showGuidance && (
        <div className="p-4 bg-orange-50 border-b border-stone-100 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <p className="text-[10px] uppercase font-bold text-orange-600 tracking-tight">Swap Guidance</p>
            <div className="flex gap-2">
              <input 
                autoFocus
                type="text"
                value={guidance}
                onChange={(e) => setGuidance(e.target.value)}
                placeholder="e.g. Tofu, spicy, etc."
                className="flex-1 px-3 py-1 text-sm rounded-lg border border-orange-200 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
              <button 
                type="submit"
                className="bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-orange-700 transition-colors"
              >
                Go
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-5 flex-1">
        <h3 className="text-xl font-bold text-stone-800 mb-2">{part.name}</h3>
        <p className="text-stone-600 text-sm leading-relaxed">{part.description}</p>
      </div>
    </div>
  );
};

export default MealCard;
