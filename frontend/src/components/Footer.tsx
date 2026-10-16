import React from 'react';
import Link from 'next/link';
import { HeartHandshake, Code2, Database, BrainCircuit, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-lg">
              <HeartHandshake className="w-6 h-6 text-brand-500" />
              <span>NGO Requirement Analyzer</span>
            </div>
            <p className="text-slate-400 max-w-md text-xs sm:text-sm leading-relaxed">
              An intelligent full-stack AI/NLP solution that bridges the gap between grassroots non-profit 
              needs and volunteer talent through explainable ranking and semantic skill matching.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                Hybrid NLP Engine
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                FastAPI + Next.js
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                SQLite / PostgreSQL
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home & Overview</Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-white transition-colors">Analyze Requirement</Link>
              </li>
              <li>
                <Link href="/requests" className="hover:text-white transition-colors">Request History</Link>
              </li>
              <li>
                <Link href="/volunteers" className="hover:text-white transition-colors">Volunteers Directory</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">Analytics Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* College Mini Project Info */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">System Attributes</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed as a complete, self-contained academic & production prototype with 100% offline fallback capabilities.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-500">
              API Status: <span className="text-emerald-400 font-medium">Online & Healthy</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 NGO Requirement Analyzer. Built with Next.js, TypeScript & FastAPI.</p>
          <p className="mt-2 sm:mt-0">College Mini-Project Working Prototype</p>
        </div>
      </div>
    </footer>
  );
}
