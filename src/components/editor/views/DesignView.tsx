import React from 'react';
import { EditorViewProps } from '../types';

const DesignView: React.FC<EditorViewProps> = ({ isActive, isDark }) => {
  return (
    <div className={`absolute inset-0 transition-all duration-500 ${
      isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
    }`}>
      <div className="h-full flex flex-col p-3 sm:p-4">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className={`w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br ${
              isDark ? 'from-teal-400 to-blue-500' : 'from-teal-600 to-blue-600'
            } rounded-lg`}></div>
            <div className="flex gap-3 sm:gap-4">
              {['Home', 'About', 'Work', 'Contact'].map((item, i) => (
                <div key={i} className={`h-1.5 w-10 sm:w-12 ${
                  isDark ? 'bg-teal-500/20' : 'bg-teal-600/20'
                } rounded-full`}></div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <div className={`w-5 h-5 sm:w-6 sm:h-6 ${
              isDark ? 'bg-teal-500/10' : 'bg-teal-600/10'
            } rounded-lg`}></div>
            <div className={`w-12 h-5 sm:w-14 sm:h-6 bg-gradient-to-r ${
              isDark ? 'from-teal-500 to-blue-500' : 'from-teal-600 to-blue-600'
            } rounded-lg`}></div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex-1 grid grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className={`h-8 sm:h-10 w-full bg-gradient-to-r ${
                isDark ? 'from-teal-500/30' : 'from-teal-600/30'
              } to-transparent rounded-lg`}></div>
              <div className={`h-6 sm:h-8 w-4/5 bg-gradient-to-r ${
                isDark ? 'from-blue-500/20' : 'from-blue-600/20'
              } to-transparent rounded-lg`}></div>
            </div>
            <div className={`h-12 sm:h-16 w-full ${
              isDark ? 'bg-teal-500/10' : 'bg-teal-600/10'
            } rounded-lg p-2 sm:p-3`}>
              <div className={`h-1 w-3/4 ${
                isDark ? 'bg-teal-500/20' : 'bg-teal-600/20'
              } rounded mb-1.5`}></div>
              <div className={`h-1 w-1/2 ${
                isDark ? 'bg-teal-500/20' : 'bg-teal-600/20'
              } rounded`}></div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <div className={`h-7 sm:h-8 w-20 sm:w-24 bg-gradient-to-r ${
                isDark ? 'from-teal-500 to-blue-500' : 'from-teal-600 to-blue-600'
              } rounded-lg shadow-lg shadow-teal-500/20`}></div>
              <div className={`h-7 sm:h-8 w-20 sm:w-24 border ${
                isDark ? 'border-teal-500/30' : 'border-teal-600/30'
              } rounded-lg`}></div>
            </div>
          </div>
          
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${
              isDark ? 'from-teal-500/20 to-blue-500/10' : 'from-teal-600/20 to-blue-600/10'
            } rounded-xl`}></div>
            <div className={`absolute inset-3 bg-gradient-to-br ${
              isDark ? 'from-teal-500/10' : 'from-teal-600/10'
            } to-transparent rounded-lg`}></div>
            <div className={`absolute bottom-3 left-3 right-3 h-12 sm:h-16 ${
              isDark ? 'bg-black/20' : 'bg-black/10'
            } backdrop-blur rounded-lg`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignView; 