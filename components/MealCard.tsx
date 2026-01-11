
import React from 'react';
import { MealPart } from '../types';

interface MealCardProps {
  part: MealPart;
  label: string;
  icon: string;
  onSwap: () => void;
  isSwapping: boolean;
}

const MealCard: React.FC<MealCardProps> = ({ part, label, icon, onSwap, isSwapping }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-stone-200 overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
      <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 flex justify-between items-center">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2">
          <i className={`${icon} text-orange-600`}></i>
          {label}
        </span>
        <button 
          onClick={onSwap}
          disabled={isSwapping}
          className="text-stone-400 hover:text-orange-600 transition-colors disabled:opacity-50"
          title="Swap this dish"
        >
          <i className={`fa-solid fa-arrows-rotate ${isSwapping ? 'animate-spin' : ''}`}></i>
        </button>
      </div>
      <div className="p-5 flex-1">
        <h3 className="text-xl font-bold text-stone-800 mb-2">{part.name}</h3>
        <p className="text-stone-600 text-sm leading-relaxed">{part.description}</p>
      </div>
    </div>
  );
};

export default MealCard;
