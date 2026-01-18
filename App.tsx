
import React, { useState, useEffect } from 'react';
import { FullMealPlan, MealConstraints, MealPart } from './types';
import { generateFullMealPlan, swapMealPart, updateShoppingList } from './services/geminiService';
import MealCard from './components/MealCard';
import RecipeDetails from './components/RecipeDetails';

const App: React.FC = () => {
  const [country, setCountry] = useState('');
  const [constraints, setConstraints] = useState<MealConstraints>({
    glutenFree: false,
    lowCarb: false,
    noAlcohol: false,
    noCoffee: false,
  });
  const [loading, setLoading] = useState(false);
  const [swappingId, setSwappingId] = useState<string | null>(null);
  const [plan, setPlan] = useState<FullMealPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!country.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await generateFullMealPlan(country, constraints);
      setPlan(result);
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async (
    category: keyof Pick<FullMealPlan, 'appetizer' | 'sideDish' | 'mainCourse' | 'drink'>,
    guidance?: string
  ) => {
    if (!plan) return;
    setSwappingId(category);
    try {
      const newPart = await swapMealPart(plan.country, category, plan[category].name, constraints, guidance);
      
      const updatedPlan = { ...plan, [category]: newPart };
      
      // Update shopping list to reflect the new item
      const newShoppingList = await updateShoppingList(updatedPlan);
      setPlan({ ...updatedPlan, shoppingList: newShoppingList });
    } catch (err) {
      console.error(err);
      setError('Failed to swap dish. Please try again.');
    } finally {
      setSwappingId(null);
    }
  };

  const toggleConstraint = (key: keyof MealConstraints) => {
    setConstraints(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-black text-stone-900 mb-4 tracking-tight">
          Global <span className="text-orange-600">Kitchen</span> Planner
        </h1>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Embark on a culinary adventure around the world. Choose a country, set your preferences, and we'll handle the rest.
        </p>
      </header>

      {/* Input Section */}
      <section className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 mb-12">
        <form onSubmit={handleGenerate} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <i className="fa-solid fa-earth-americas absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-xl"></i>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter a country (e.g., Japan, Italy, Ethiopia...)"
                className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-lg font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !country.trim()}
              className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg hover:bg-orange-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200 active:scale-95"
            >
              {loading ? (
                <><i className="fa-solid fa-spinner animate-spin"></i> Exploring...</>
              ) : (
                <><i className="fa-solid fa-wand-magic-sparkles"></i> Plan My Feast</>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { id: 'glutenFree', label: 'Gluten Free', icon: 'fa-wheat-awn-circle-exclamation' },
              { id: 'lowCarb', label: 'Low Carb', icon: 'fa-bread-slice' },
              { id: 'noAlcohol', label: 'No Alcohol', icon: 'fa-wine-glass-slash' },
              { id: 'noCoffee', label: 'No Coffee', icon: 'fa-mug-hot' },
            ].map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleConstraint(c.id as keyof MealConstraints)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold transition-all ${
                  constraints[c.id as keyof MealConstraints]
                    ? 'bg-orange-600 border-orange-600 text-white'
                    : 'bg-white border-stone-200 text-stone-400 hover:border-orange-200'
                }`}
              >
                <i className={`fa-solid ${c.icon}`}></i>
                {c.label}
              </button>
            ))}
          </div>
        </form>
      </section>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-8 flex items-center gap-3">
          <i className="fa-solid fa-circle-exclamation"></i>
          {error}
        </div>
      )}

      {plan && (
        <section className="animate-in fade-in duration-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <MealCard 
              label="Appetizer" 
              icon="fa-solid fa-utensils" 
              part={plan.appetizer} 
              onSwap={(guidance) => handleSwap('appetizer', guidance)}
              isSwapping={swappingId === 'appetizer'}
            />
            <MealCard 
              label="Side Dish" 
              icon="fa-solid fa-bowl-food" 
              part={plan.sideDish} 
              onSwap={(guidance) => handleSwap('sideDish', guidance)}
              isSwapping={swappingId === 'sideDish'}
            />
            <MealCard 
              label="Main Course" 
              icon="fa-solid fa-plate-wheat" 
              part={plan.mainCourse} 
              onSwap={(guidance) => handleSwap('mainCourse', guidance)}
              isSwapping={swappingId === 'mainCourse'}
            />
            <MealCard 
              label="Drink" 
              icon="fa-solid fa-glass-water" 
              part={plan.drink} 
              onSwap={(guidance) => handleSwap('drink', guidance)}
              isSwapping={swappingId === 'drink'}
            />
          </div>

          <RecipeDetails plan={plan} />
        </section>
      )}

      {!plan && !loading && (
        <div className="text-center py-20 border-2 border-dashed border-stone-200 rounded-3xl">
          <i className="fa-solid fa-map-location-dot text-6xl text-stone-200 mb-6"></i>
          <p className="text-stone-400 font-medium">Your world culinary tour starts here.</p>
        </div>
      )}
    </div>
  );
};

export default App;
