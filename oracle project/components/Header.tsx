import React from 'react';
import { Hexagon } from 'lucide-react';

export const Header = () => {
  return (
    <header className="w-full py-6 px-8 flex items-center justify-center border-b border-oracle-800 bg-oracle-900/50 backdrop-blur sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="relative">
            <Hexagon className="text-oracle-accent fill-oracle-900/50" size={32} strokeWidth={1.5} />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-oracle-accent rounded-full animate-pulse shadow-[0_0_10px_#00f0ff]"></div>
            </div>
        </div>
        <h1 className="text-2xl font-mono font-bold tracking-[0.2em] text-white">
          ORACLE
          <span className="text-xs text-oracle-400 ml-2 tracking-normal font-sans opacity-70">
            SYSTEM v3.0
          </span>
        </h1>
      </div>
    </header>
  );
};