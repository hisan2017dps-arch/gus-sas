import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="mb-6 flex flex-col lg:flex-row items-center justify-between border-b-2 border-emerald-600 pb-4 gap-4">
      <div className="logo-container">
        <svg viewBox="0 0 650 125" xmlns="http://www.w3.org/2000/svg" style={{ height: '70px', width: 'auto' }}>
          <defs>
            <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#064e3b', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <rect x="10" y="20" width="70" height="70" rx="20" fill="url(#mainGrad)" />
          <path d="M34 42 L56 42 L56 64 L34 64 Z" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" />
          <text x="100" y="60" fontFamily="Arial" fontSize="48" fontWeight="900" fill="#064e3b">GUS</text>
          <text x="205" y="60" fontFamily="Arial" fontSize="48" fontWeight="900" fill="#10b981">SAS</text>
          <text x="102" y="85" fontFamily="Arial" fontSize="12" fontWeight="700" fill="#64748b">Global Unified System for Syllabus Automation Structure</text>
        </svg>
      </div>

      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-black text-emerald-900 uppercase">BALAI DIKLAT KEAGAMAAN DENPASAR</h1>
        <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em]">GENERATOR RBPMP & RENCANA PEMBELAJARAN</p>
      </div>
      <div className="hidden lg:block w-[80px]"></div>
    </header>
  );
};

export default Header;