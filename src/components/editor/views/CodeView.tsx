import React from 'react';
import { EditorViewProps, CodeLine } from '../types';

const defaultCodeLines: CodeLine[] = [
  { indent: 0, text: 'import { useState, useEffect } from "react"', color: 'text-purple-400' },
  { indent: 0, text: 'import { motion } from "framer-motion"', color: 'text-purple-400' },
  { indent: 0, text: '', color: '' },
  { indent: 0, text: 'export default function Portfolio() {', color: 'text-blue-400' },
  { indent: 1, text: 'const [projects, setProjects] = useState([])', color: 'text-teal-400' },
  { indent: 1, text: 'const [loading, setLoading] = useState(true)', color: 'text-teal-400' },
  { indent: 0, text: '', color: '' },
  { indent: 1, text: 'useEffect(() => {', color: 'text-yellow-400' },
  { indent: 2, text: 'fetchProjects().then(data => {', color: 'text-green-400' },
  { indent: 3, text: 'setProjects(data)', color: 'text-white' },
  { indent: 3, text: 'setLoading(false)', color: 'text-white' },
  { indent: 2, text: '})', color: 'text-green-400' },
  { indent: 1, text: '}, [])', color: 'text-yellow-400' },
  { indent: 0, text: '', color: '' },
  { indent: 1, text: 'return (', color: 'text-blue-400' },
  { indent: 2, text: '<motion.div', color: 'text-red-400' },
  { indent: 3, text: 'initial={{ opacity: 0 }}', color: 'text-teal-400' },
  { indent: 3, text: 'animate={{ opacity: 1 }}', color: 'text-teal-400' },
  { indent: 3, text: 'className="portfolio-grid"', color: 'text-amber-400' },
  { indent: 2, text: '>', color: 'text-red-400' },
  { indent: 3, text: '{/* Portfolio content */}', color: 'text-gray-500' },
  { indent: 2, text: '</motion.div>', color: 'text-red-400' },
  { indent: 1, text: ')', color: 'text-blue-400' },
  { indent: 0, text: '}', color: 'text-blue-400' },
];

const CodeView: React.FC<EditorViewProps> = ({ isActive, isDark }) => {
  return (
    <div className={`absolute inset-0 transition-all duration-500 ${
      isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'
    }`}>
      <div className="h-full flex">
        {/* Line numbers */}
        <div className={`w-8 sm:w-10 ${
          isDark ? 'bg-black/20' : 'bg-gray-100/50'
        } border-r ${
          isDark ? 'border-teal-500/10' : 'border-teal-600/10'
        } flex flex-col pt-3 ${
          isDark ? 'text-teal-500/30' : 'text-teal-600/30'
        } text-[8px] sm:text-[10px] font-mono`}>
          {defaultCodeLines.map((_, i) => (
            <div key={i} className="h-4 sm:h-5 flex items-center justify-center">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code content */}
        <div className="flex-1 overflow-hidden">
          <div className="p-3 font-mono text-[9px] sm:text-xs">
            {defaultCodeLines.map((line, i) => (
              <div
                key={i}
                className="h-4 sm:h-5 flex items-center transition-all duration-500"
                style={{
                  paddingLeft: `${line.indent * 12}px`,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateX(0)' : 'translateX(-20px)',
                  transitionDelay: `${i * 30}ms`
                }}
              >
                <span className={line.color || (isDark ? 'text-gray-400' : 'text-gray-600')}>
                  {line.text}
                </span>
              </div>
            ))}
            
            {/* Blinking cursor */}
            <div 
              className={`inline-block w-1 h-3 sm:h-4 ${
                isDark ? 'bg-teal-400' : 'bg-teal-600'
              } ml-0.5`}
              style={{
                animation: isActive ? 'blink 1s infinite' : 'none',
                verticalAlign: 'text-bottom'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeView; 