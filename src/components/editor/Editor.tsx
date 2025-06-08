import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { EditorProps } from './types';
import EditorHeader from './EditorHeader';

const Editor: React.FC<EditorProps> = ({ 
  initialView = 'code',
  views,
  isDark
}) => {
  const [currentView, setCurrentView] = useState(initialView);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(editorRef.current, {
        y: 30,
        opacity: 0
      });

      // Initial animation
      gsap.to(editorRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5
      });

      // Start floating animation after initial animation
      gsap.to(editorRef.current, {
        y: -10,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.5
      });
    }, editorRef);

    return () => ctx.revert();
  }, []);

  const startInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentView(prev => {
          const viewKeys = Object.keys(views);
          const currentIndex = viewKeys.indexOf(prev);
          const nextIndex = (currentIndex + 1) % viewKeys.length;
          return viewKeys[nextIndex];
        });
        setIsTransitioning(false);
      }, 300);
    }, 5000);
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleViewChange = (view: string) => {
    if (views[view]) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentView(view);
        setIsTransitioning(false);
      }, 300);
      startInterval();
    }
  };

  return (
    <div ref={editorRef} className="relative w-full h-full">
      {/* Main editor window */}
      <div className={`relative h-[300px] xs:h-[400px] sm:h-[450px] lg:h-[600px] ${
        isDark 
          ? 'bg-gray-900/90 border-teal-500/20' 
          : 'bg-white/90 border-teal-600/30'
        } rounded-xl sm:rounded-2xl border overflow-hidden backdrop-blur-xl shadow-2xl transition-colors duration-300`}>
        
        {/* Editor header */}
        <EditorHeader
          currentView={currentView}
          onViewChange={handleViewChange}
          isDark={isDark}
        />

        {/* Editor content */}
        <div className="relative h-[calc(100%-2rem)] sm:h-[calc(100%-3rem)] overflow-hidden">
          {Object.entries(views).map(([key, { component: ViewComponent }]) => (
            <ViewComponent
              key={key}
              isActive={currentView === key && !isTransitioning}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none">
          <div className={`absolute inset-0 rounded-xl sm:rounded-2xl ${
            isDark 
              ? 'bg-gradient-to-t from-teal-500/5 to-transparent' 
              : 'bg-gradient-to-t from-teal-600/5 to-transparent'
          }`}></div>
        </div>
      </div>
    </div>
  );
};

export default Editor; 