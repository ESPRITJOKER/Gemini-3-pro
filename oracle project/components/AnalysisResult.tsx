import React from 'react';
import { OracleAnalysis, DecisionOption } from '../types';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Clock, CheckCircle, Target } from 'lucide-react';

interface AnalysisResultProps {
  analysis: OracleAnalysis;
  onReset: () => void;
}

const ScoreBadge = ({ label, value, type }: { label: string, value: number, type: 'risk' | 'good' | 'neutral' }) => {
  let colorClass = 'bg-oracle-600 text-gray-200';
  if (type === 'risk') {
    // High risk is red, low risk is green
    colorClass = value > 60 ? 'bg-oracle-risk/20 text-oracle-risk border-oracle-risk/50' : 'bg-oracle-safe/20 text-oracle-safe border-oracle-safe/50';
  } else if (type === 'good') {
    // High is good
    colorClass = value > 60 ? 'bg-oracle-safe/20 text-oracle-safe border-oracle-safe/50' : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
  } else {
    // Neutral/Cost - High cost is bad usually
    colorClass = value > 60 ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' : 'bg-blue-500/20 text-blue-400 border-blue-500/50';
  }

  return (
    <div className={`flex flex-col items-center p-2 rounded border ${colorClass} min-w-[80px]`}>
      <span className="text-xs font-mono uppercase opacity-75">{label}</span>
      <span className="text-lg font-bold">{value}</span>
    </div>
  );
};

interface OptionCardProps {
  option: DecisionOption;
  isRecommended: boolean;
}

const OptionCard: React.FC<OptionCardProps> = ({ option, isRecommended }) => {
  return (
    <div className={`relative p-6 rounded-lg border transition-all duration-300 hover:scale-[1.01] ${isRecommended ? 'bg-oracle-800 border-oracle-accent shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'bg-oracle-800/50 border-oracle-700 hover:border-oracle-500'}`}>
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-oracle-accent text-oracle-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
          <CheckCircle size={12} /> Recommended
        </div>
      )}
      
      <h3 className="text-xl font-bold text-white mb-2 font-mono flex items-center gap-2">
        {option.title}
      </h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">{option.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-oracle-900/50 p-3 rounded border border-oracle-700">
            <h4 className="text-xs text-oracle-400 uppercase font-mono mb-1 flex items-center gap-1">
                <Clock size={12} /> Short Term (0-1y)
            </h4>
            <p className="text-xs text-gray-300">{option.shortTermSimulation}</p>
        </div>
        <div className="bg-oracle-900/50 p-3 rounded border border-oracle-700">
            <h4 className="text-xs text-oracle-400 uppercase font-mono mb-1 flex items-center gap-1">
                <TrendingUp size={12} /> Long Term (3-5y)
            </h4>
            <p className="text-xs text-gray-300">{option.longTermSimulation}</p>
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <ScoreBadge label="Feasibility" value={option.scores.feasibility} type="good" />
        <ScoreBadge label="Risk" value={option.scores.risk} type="risk" />
        <ScoreBadge label="Impact" value={option.scores.longTermImpact} type="good" />
        <ScoreBadge label="Opp. Cost" value={option.scores.opportunityCost} type="neutral" />
      </div>
    </div>
  );
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, onReset }) => {
  // Map options to radar structure (requires transforming data shape)
  // Actually simpler: Let's make a bar chart comparing the options side-by-side for each metric.
  
  const chartData = analysis.options.map(opt => ({
    name: opt.title.length > 15 ? opt.title.substring(0, 15) + '...' : opt.title,
    Feasibility: opt.scores.feasibility,
    Risk: opt.scores.risk,
    Impact: opt.scores.longTermImpact,
    Cost: opt.scores.opportunityCost
  }));

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Header Section */}
      <div className="bg-oracle-800 border-l-4 border-oracle-accent p-6 rounded-r-lg shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-sm text-oracle-accent font-mono uppercase mb-1 flex items-center gap-2">
            <Target size={16} /> Analysis Complete
          </h2>
          <h1 className="text-2xl font-bold text-white">Objective Analysis</h1>
          <p className="text-gray-400 text-sm mt-1 max-w-2xl">
            {analysis.objective}
          </p>
        </div>
        <button 
          onClick={onReset}
          className="px-4 py-2 bg-oracle-700 hover:bg-oracle-600 text-white rounded border border-oracle-500 transition-colors text-sm font-mono"
        >
          NEW ANALYSIS
        </button>
      </div>

      {/* Constraints Summary */}
      <div className="flex flex-wrap gap-2">
        {analysis.identifiedConstraints.map((c, i) => (
          <span key={i} className="px-3 py-1 bg-oracle-900 border border-oracle-700 rounded-full text-xs text-gray-400 font-mono">
            {c}
          </span>
        ))}
      </div>

      {/* Recommendation Engine Highlight */}
      <div className="bg-gradient-to-r from-oracle-800 to-oracle-900 border border-oracle-700 rounded-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Target size={120} />
        </div>
        <h3 className="text-oracle-accent font-mono text-sm uppercase mb-4 tracking-widest">Oracle Recommendation</h3>
        <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                    {analysis.recommendation.bestOptionTitle}
                </h2>
                <p className="text-gray-300 leading-relaxed border-l-2 border-oracle-500 pl-4">
                    {analysis.recommendation.reasoning}
                </p>
            </div>
            <div className="w-full md:w-1/3 bg-oracle-950/50 rounded-lg p-4 border border-oracle-800">
                <h4 className="text-xs text-gray-500 uppercase mb-3 text-center">Comparative Metrics</h4>
                <div className="h-[200px] w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis dataKey="name" type="category" width={80} tick={{fill: '#9ca3af', fontSize: 10}} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0a1124', borderColor: '#1f2937', color: '#f3f4f6' }}
                                itemStyle={{ fontSize: '12px' }}
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            />
                            <Bar dataKey="Feasibility" fill="#05d5aa" radius={[0, 4, 4, 0]} barSize={8} />
                            <Bar dataKey="Impact" fill="#3e5aa8" radius={[0, 4, 4, 0]} barSize={8} />
                            <Bar dataKey="Risk" fill="#ff2a6d" radius={[0, 4, 4, 0]} barSize={8} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2 text-[10px] text-gray-500 uppercase">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-oracle-safe rounded-full"></div> Feasibility</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-oracle-400 rounded-full"></div> Impact</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-oracle-risk rounded-full"></div> Risk</span>
                </div>
            </div>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {analysis.options.map((option, idx) => (
          <OptionCard 
            key={idx} 
            option={option} 
            isRecommended={option.title === analysis.recommendation.bestOptionTitle} 
          />
        ))}
      </div>

    </div>
  );
};