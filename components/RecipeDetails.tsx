
import React, { useState } from 'react';
import { FullMealPlan } from '../types';

interface RecipeDetailsProps {
  plan: FullMealPlan;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ plan }) => {
  const [copied, setCopied] = useState(false);

  const generateMarkdown = () => {
    let md = `# Culinary Journey: ${plan.country}\n\n`;
    
    md += `## Menu Overview\n`;
    md += `- **Appetizer**: ${plan.appetizer.name}\n`;
    md += `- **Side Dish**: ${plan.sideDish.name}\n`;
    md += `- **Main Course**: ${plan.mainCourse.name}\n`;
    md += `- **Drink**: ${plan.drink.name}\n\n`;

    md += `## Shopping List\n`;
    plan.shoppingList.forEach(cat => {
      md += `### ${cat.category}\n`;
      cat.items.forEach(item => md += `- [ ] ${item}\n`);
      md += `\n`;
    });

    const parts = [
      { label: 'Appetizer', data: plan.appetizer },
      { label: 'Side Dish', data: plan.sideDish },
      { label: 'Main Course', data: plan.mainCourse },
      { label: 'Drink', data: plan.drink }
    ];

    parts.forEach(p => {
      md += `## ${p.label}: ${p.data.name}\n`;
      md += `${p.data.description}\n\n`;
      md += `### Ingredients\n`;
      p.data.ingredients.forEach(i => md += `- ${i}\n`);
      md += `\n### Instructions\n`;
      p.data.instructions.forEach((step, idx) => md += `${idx + 1}. ${step}\n`);
      md += `\n---\n\n`;
    });

    return md;
  };

  const handleCopy = () => {
    const md = generateMarkdown();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 space-y-12 pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Complete Recipes & Guide</h2>
          <p className="text-stone-500">Everything you need for your {plan.country} themed dinner.</p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-6 py-3 bg-stone-800 text-white rounded-xl hover:bg-stone-700 transition-colors font-medium shadow-md active:scale-95"
        >
          <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
          {copied ? 'Copied!' : 'Copy Markdown'}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-stone-100 p-6 rounded-2xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-basket-shopping text-orange-600"></i>
              Shopping List
            </h3>
            {plan.shoppingList.map((cat, i) => (
              <div key={i} className="mb-6 last:mb-0">
                <h4 className="text-sm font-bold text-stone-500 uppercase tracking-tighter mb-2">{cat.category}</h4>
                <ul className="space-y-1">
                  {cat.items.map((item, j) => (
                    <li key={j} className="text-sm text-stone-700 flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 bg-stone-400 rounded-full flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 space-y-10">
          {[
            { label: 'Appetizer', data: plan.appetizer },
            { label: 'Side Dish', data: plan.sideDish },
            { label: 'Main Course', data: plan.mainCourse },
            { label: 'Drink', data: plan.drink }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="bg-stone-50 px-6 py-4 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-stone-800">{item.data.name}</h3>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase tracking-widest">{item.label}</span>
              </div>
              <div className="p-6 grid sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-3">Ingredients</h4>
                  <ul className="space-y-2">
                    {item.data.ingredients.map((ing, k) => (
                      <li key={k} className="text-sm text-stone-700 flex items-center gap-2">
                        <i className="fa-solid fa-circle-check text-green-500 text-[10px]"></i>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-3">Preparation</h4>
                  <ol className="space-y-4">
                    {item.data.instructions.map((step, k) => (
                      <li key={k} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center text-xs font-bold">{k + 1}</span>
                        <p className="text-sm text-stone-600 leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
