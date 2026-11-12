import React from 'react';
import { Film, BookOpen, Heart, Code2, Sparkles, Shield, Database } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & College Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center text-cyan-400 font-bold">
                  CB
                </div>
              </div>
              <span className="font-extrabold text-sm text-white">
                CineBook <span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              AI-Powered Unified Book and Movie Recommendation System. College Mini-Project by Ukeshwari S.
            </p>
            <div className="pt-1">
              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Java 21 • Spring Boot 3 • MySQL 8
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateTab('home')} className="hover:text-cyan-300 transition-colors">
                  Home Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('books')} className="hover:text-cyan-300 transition-colors">
                  Books Catalogue
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('movies')} className="hover:text-cyan-300 transition-colors">
                  Movies Catalogue
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('discover')} className="hover:text-cyan-300 transition-colors">
                  Recommendation Engine
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('assistant')} className="hover:text-cyan-300 transition-colors">
                  AI Discovery Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Multilingual & Algorithms */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Recommendation Architecture</h4>
            <ul className="space-y-2 text-[11px]">
              <li className="text-slate-400">Content-Based Jaccard Similarity</li>
              <li className="text-slate-400">Bayesian Weighted Popularity (WR)</li>
              <li className="text-slate-400">Hybrid Weighted Scoring</li>
              <li className="text-slate-400">Native Unicode Tamil, Telugu, Hindi, Malayalam, Japanese Scripts</li>
              <li className="text-slate-400">Gemini Grounded Assistant</li>
            </ul>
          </div>

          {/* Col 4: Full-Stack Java Deliverable */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Java Spring Boot Project</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Full Maven source project with entities, repositories, Flyway migrations, and unit tests ready to export.
            </p>
            <button
              onClick={() => onNavigateTab('java-export')}
              className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Code2 className="w-3.5 h-3.5" />
              Inspect & Download Code (.ZIP)
            </button>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 CineBook AI — Developed for College Mini-Project Submission.
          </div>
          <div className="flex items-center gap-4">
            <span>Spring Security 6 (BCrypt)</span>
            <span>•</span>
            <span>MySQL 8 UTF-8</span>
            <span>•</span>
            <span>REST & Thymeleaf</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
