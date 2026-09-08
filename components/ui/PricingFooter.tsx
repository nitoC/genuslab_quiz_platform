import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="pt-16 pb-8 text-center space-y-3">
      <div className="flex items-center justify-center gap-6 text-sm text-slate-400 font-medium">
        <a href="#terms" className="hover:text-white transition-colors">
          Terms of Service
        </a>
        <a href="#privacy" className="hover:text-white transition-colors">
          Privacy Policy
        </a>
        <a href="#support" className="hover:text-white transition-colors">
          Support
        </a>
      </div>
      <p className="text-[14px] text-slate-500">
        © 2024 Genuslab Systems. Built for the next generation of learners.
      </p>
    </footer>
  );
};
