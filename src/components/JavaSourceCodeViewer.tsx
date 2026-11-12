import React, { useState } from 'react';
import { JAVA_PROJECT_FILES } from '../data/javaProjectFiles';
import { JavaSourceFile } from '../types';
import JSZip from 'jszip';
import { useApp } from '../context/AppContext';
import {
  Code2,
  Download,
  Copy,
  Check,
  FileCode,
  FolderTree,
  Terminal,
  BookOpenCheck,
  Sparkles,
  Database,
  Shield,
  Layers,
  HelpCircle
} from 'lucide-react';

export const JavaSourceCodeViewer: React.FC = () => {
  const { showToast } = useApp();
  const [selectedFile, setSelectedFile] = useState<JavaSourceFile>(JAVA_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Config', 'Entity', 'Algorithm', 'Security', 'Database', 'Test'];

  const filteredFiles = activeCategory === 'ALL'
    ? JAVA_PROJECT_FILES
    : JAVA_PROJECT_FILES.filter(f => f.category === activeCategory);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    showToast(`Copied ${selectedFile.name} to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    showToast('Generating CineBook AI Java Spring Boot project ZIP...', 'info');

    try {
      const zip = new JSZip();

      // Add each file to the zip archive preserving its relative path
      JAVA_PROJECT_FILES.forEach(file => {
        zip.file(file.path, file.content);
      });

      // Generate the zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cinebook-ai-spring-boot-project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('Downloaded complete Java Spring Boot project ZIP!', 'success');
    } catch (err) {
      console.error('Error generating zip:', err);
      showToast('Failed to create ZIP archive', 'error');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Code2 className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Java 21 / Spring Boot 3 Full-Stack Source Code
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Pristine college mini-project code deliverable with Maven, Spring Data JPA, Spring Security 6, and MySQL
          </p>
        </div>

        {/* 1-Click ZIP Download Button */}
        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          {isZipping ? 'Packaging Project...' : 'Download Java Project (.ZIP)'}
        </button>
      </div>

      {/* College Project Architecture Guide Box */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <BookOpenCheck className="w-5 h-5 text-amber-400" />
          <span>College Evaluation & Local Setup Guide (IntelliJ IDEA / VS Code)</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              1. Quick Start Commands
            </h4>
            <pre className="text-[11px] font-mono text-cyan-300 bg-slate-900 p-2 rounded-lg mt-1 overflow-x-auto">
{`# 1. Unzip downloaded archive
unzip cinebook-ai-spring-boot-project.zip
cd cinebook-ai

# 2. Build and run
mvn clean install
mvn spring-boot:run`}
            </pre>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              2. MySQL Configuration
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Create a database named <code className="text-amber-300 font-mono">cinebook_db</code> with <code className="text-white font-mono">utf8mb4</code> charset. Flyway automatically executes migrations <code className="text-amber-300">V1</code> and <code className="text-amber-300">V2</code> on startup.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              3. Security & Endpoints
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Spring Security 6 protects administrative routes. Access the interactive Swagger UI at <code className="text-rose-300 font-mono">/swagger-ui.html</code> and Thymeleaf frontend at <code className="text-rose-300 font-mono">/</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Code Browser Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Category Pills & File List */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* File Selection List */}
          <div className="glass-card rounded-2xl p-2 border border-white/10 space-y-1 max-h-[600px] overflow-y-auto">
            {filteredFiles.map(file => {
              const isSelected = selectedFile.path === file.path;

              return (
                <div
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{file.path}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {file.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Code Viewer with Copy Button */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="glass-card rounded-3xl border border-white/10 overflow-hidden flex flex-col h-full">
            
            {/* Viewer Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-amber-300">{selectedFile.path}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 overflow-auto bg-slate-950 text-slate-200 font-mono text-xs max-h-[600px] leading-relaxed select-text">
              <pre>
                <code>{selectedFile.content}</code>
              </pre>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
