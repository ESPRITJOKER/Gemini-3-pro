import React, { useState } from 'react';
import { UserInput } from '../types';
import { ArrowRight, AlertCircle, Cpu } from 'lucide-react';

interface InputFormProps {
  onSubmit: (input: UserInput) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    situation: '',
    financialConstraints: '',
    timeConstraints: '',
    riskTolerance: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.situation.length > 10;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-oracle-800/80 backdrop-blur-sm border border-oracle-700 rounded-xl p-8 shadow-2xl">
        <div className="mb-8 border-b border-oracle-700 pb-4">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Cpu className="text-oracle-accent" /> Initialization Parameters
          </h2>
          <p className="text-oracle-300 text-sm">
            Input detailed parameters to initialize the Oracle decision engine.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-oracle-300">
              Target Situation / Dilemma
            </label>
            <textarea
              name="situation"
              value={formData.situation}
              onChange={handleChange}
              placeholder="Describe the decision you need to make in detail..."
              className="w-full bg-oracle-900/50 border border-oracle-600 rounded-lg p-4 text-gray-200 placeholder-oracle-500/50 focus:border-oracle-accent focus:ring-1 focus:ring-oracle-accent outline-none transition-all h-32 resize-none font-sans text-sm"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-oracle-300">
                Financial Constraints
              </label>
              <input
                type="text"
                name="financialConstraints"
                value={formData.financialConstraints}
                onChange={handleChange}
                placeholder="e.g. $10k budget, Low liquidity"
                className="w-full bg-oracle-900/50 border border-oracle-600 rounded-lg p-3 text-gray-200 placeholder-oracle-500/50 focus:border-oracle-accent outline-none transition-all text-sm"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-oracle-300">
                Time Horizon / Deadline
              </label>
              <input
                type="text"
                name="timeConstraints"
                value={formData.timeConstraints}
                onChange={handleChange}
                placeholder="e.g. 6 months, Urgent, 5 years"
                className="w-full bg-oracle-900/50 border border-oracle-600 rounded-lg p-3 text-gray-200 placeholder-oracle-500/50 focus:border-oracle-accent outline-none transition-all text-sm"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-oracle-300">
              Risk Tolerance & Ethics
            </label>
            <input
              type="text"
              name="riskTolerance"
              value={formData.riskTolerance}
              onChange={handleChange}
              placeholder="e.g. Conservative, High-risk for high-reward, Ethical sourcing mandatory"
              className="w-full bg-oracle-900/50 border border-oracle-600 rounded-lg p-3 text-gray-200 placeholder-oracle-500/50 focus:border-oracle-accent outline-none transition-all text-sm"
              disabled={isLoading}
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full group relative flex items-center justify-center gap-2 p-4 rounded-lg font-bold tracking-widest uppercase transition-all duration-300 ${
                !isFormValid || isLoading
                  ? 'bg-oracle-900 text-oracle-600 cursor-not-allowed border border-oracle-800'
                  : 'bg-oracle-600 hover:bg-oracle-500 text-white border border-oracle-400 hover:border-oracle-accent shadow-[0_0_20px_rgba(38,59,117,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Running Simulation...</span>
                </>
              ) : (
                <>
                  <span>Initiate Analysis</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            {!isFormValid && (
              <p className="text-center text-xs text-oracle-500 mt-3 flex items-center justify-center gap-1">
                <AlertCircle size={12} /> Please describe the situation to enable analysis.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};