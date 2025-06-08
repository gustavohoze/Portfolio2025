import React from 'react';
import { EditorHeaderProps, EditorTabProps } from './types';

const EditorTab: React.FC<EditorTabProps> = ({ label, icon, isActive, onClick, isDark }) => (
  <button
    onClick={onClick}
    className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-sm font-medium transition-all duration-300 ${
      isActive
        ? isDark 
          ? 'bg-teal-500/30 text-teal-300' 
          : 'bg-teal-600/20 text-teal-700'
        : isDark
          ? 'text-gray-400 hover:text-teal-300 hover:bg-teal-500/10' 
          : 'text-gray-500 hover:text-teal-700 hover:bg-teal-600/10'
    }`}
  >
    <span className="flex items-center gap-1 sm:gap-2">
      {icon}
      {label}
    </span>
  </button>
);

const EditorHeader: React.FC<EditorHeaderProps> = ({ currentView, onViewChange, isDark }) => {
  return (
    <div className={`relative h-8 sm:h-12 ${
      isDark 
        ? 'bg-gray-950 border-teal-500/20' 
        : 'bg-gray-100 border-teal-600/30'
      } border-b flex items-center px-2 sm:px-4 transition-colors duration-300`}>
      {/* Window controls */}
      <div className="flex gap-1.5 sm:gap-2">
        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
      </div>

      {/* Tabs */}
      <div className={`absolute left-1/2 -translate-x-1/2 flex items-center ${
        isDark ? 'bg-gray-900' : 'bg-white'
      } rounded-lg p-0.5 sm:p-1`}>
        <EditorTab
          label="Code"
          icon={
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          }
          isActive={currentView === 'code'}
          onClick={() => onViewChange('code')}
          isDark={isDark}
        />
        <EditorTab
          label="Design"
          icon={
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          }
          isActive={currentView === 'design'}
          onClick={() => onViewChange('design')}
          isDark={isDark}
        />
      </div>

      {/* File indicator */}
      <div className={`absolute right-2 sm:right-4 font-mono text-[10px] sm:text-sm ${
        isDark 
          ? 'text-teal-400/70' 
          : 'text-teal-700/90'
      }`}>
        {currentView === 'code' ? 'Portfolio.tsx' : 'Portfolio.fig'}
      </div>
    </div>
  );
};

export default EditorHeader; 