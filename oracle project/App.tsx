import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { AnalysisResult } from './components/AnalysisResult';
import { OracleAnalysis, AnalysisStatus, UserInput } from './types';
import { analyzeDecision } from './services/geminiService';
import { TriangleAlert } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysis, setAnalysis] = useState<OracleAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisRequest = async (input: UserInput) => {
    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    try {
      const result = await analyzeDecision(input.situation, {
        financial: input.financialConstraints || "None specified",
        time: input.timeConstraints || "None specified",
        risk: input.riskTolerance || "Balanced"
      });
      setAnalysis(result);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during simulation.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setStatus(AnalysisStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-oracle-900 text-white font-sans selection:bg-oracle-accent selection:text-oracle-900 flex flex-col">
      <Header />

      <main className="flex-grow p-6 md:p-12 flex flex-col items-center justify-start relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-oracle-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-oracle-accent/5 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-6xl">
          {status === AnalysisStatus.IDLE && (
            <div className="animate-fade-in-up">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-oracle-300">
                        Strategic Decision Engine
                    </h2>
                    <p className="text-oracle-200 max-w-2xl mx-auto text-lg leading-relaxed">
                        ORACLE utilizes Gemini 3.0 advanced reasoning to simulate outcomes, 
                        calculate risks, and provide structured strategic recommendations for complex scenarios.
                    </p>
                </div>
                <InputForm onSubmit={handleAnalysisRequest} isLoading={false} />
            </div>
          )}

          {status === AnalysisStatus.ANALYZING && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
                <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-oracle-700 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-oracle-accent border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-4 bg-oracle-800 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-oracle-accent rounded-full animate-ping"></div>
                    </div>
                </div>
                <h3 className="text-2xl font-mono text-white mb-2">PROCESSING DATA</h3>
                <div className="flex flex-col items-center gap-1 text-oracle-400 font-mono text-sm">
                    <span>Extracting variables...</span>
                    <span className="animate-pulse delay-75">Simulating outcomes (0-5y)...</span>
                    <span className="animate-pulse delay-150">Calculating risk vectors...</span>
                </div>
            </div>
          )}

          {status === AnalysisStatus.ERROR && (
             <div className="w-full max-w-2xl mx-auto bg-red-900/20 border border-red-500/50 rounded-lg p-8 text-center animate-fade-in">
                <TriangleAlert className="mx-auto text-red-500 mb-4" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">Analysis Failed</h3>
                <p className="text-gray-300 mb-6">{error}</p>
                <button 
                  onClick={resetAnalysis}
                  className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded transition-colors"
                >
                  Return to Input
                </button>
             </div>
          )}

          {status === AnalysisStatus.COMPLETE && analysis && (
            <AnalysisResult analysis={analysis} onReset={resetAnalysis} />
          )}
        </div>
      </main>

      <footer className="w-full py-6 text-center text-oracle-500 text-xs font-mono border-t border-oracle-900">
        POWERED BY GEMINI 3 PRO PREVIEW • ORACLE DECISION SYSTEMS
      </footer>
    </div>
  );
};

export default App;