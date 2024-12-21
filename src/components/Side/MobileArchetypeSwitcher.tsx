import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { currentPrompt, currentArchetypeType } from '../../store/atom.js';

const MobileArchetypeSwitcher = ({ archetypeData }) => {
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { eristicsPlaylists, jungianPlaylists, dndPlaylists } = archetypeData;

  const archetypeTypes = [
    { name: "Eristics", playlists: eristicsPlaylists, tooltip: "Eristics Test archetypes" },
    { name: "Jungian", playlists: jungianPlaylists, tooltip: "Carl Jung's psychological archetypes" },
    { name: "Dungeons & Dragons", playlists: dndPlaylists, tooltip: "D&D class-based archetypes" }
  ];

  // ... keep same useEffect and handler functions from ArchetypeSwitcher ...
  // Initialize from stored state
    useEffect(() => {
      const unsubscribe = currentArchetypeType.subscribe(type => {
        const index = archetypeTypes.findIndex(t => t.name === type);
        if (index !== -1) {
          setCurrentTypeIndex(index);
        }
      });
      return () => unsubscribe();
    }, []);
  
    const handleDirectionClick = (direction) => {
      if (isTransitioning) return;
      
      setIsTransitioning(true);
      const newIndex = direction === 'left'
        ? (currentTypeIndex - 1 + archetypeTypes.length) % archetypeTypes.length
        : (currentTypeIndex + 1) % archetypeTypes.length;
      
      setCurrentTypeIndex(newIndex);
      // Update the global archetype type state
      currentArchetypeType.set(archetypeTypes[newIndex].name);
      setTimeout(() => setIsTransitioning(false), 300);
    };
  
    const getCurrentValue = (store) => {
      let value;
      const unsubscribe = store.subscribe((v) => {
        value = v;
      });
      unsubscribe();
      return value;
    };
  
    const handleArchetypeClick = (e, playlist) => {
      const prompt = getCurrentValue(currentPrompt);
      if (prompt === "") {
        e.preventDefault();
        const toastId = toast.error("No prompt set yet", {
          description: "Enter a prompt first!",
          duration: 2000,
          action: {
            label: "X",
            onClick: () => {
              console.log("Closing Toast");
              toast.dismiss(toastId);
            },
          },
        });
      }
    };
  
    const handleArchetypeHover = (color) => {
      // Find the main section element and update its background
      const mainSection = document.querySelector('.main-section');
      if (mainSection) {
        mainSection.style.setProperty('--hover-bg-color', color);
        mainSection.classList.add('focused-bg');
      }
    };
  
    const handleArchetypeLeave = () => {
      // Remove the background color when mouse leaves
      const mainSection = document.querySelector('.main-section');
      if (mainSection) {
        mainSection.classList.remove('focused-bg');
      }
    };

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const currentType = archetypeTypes[currentTypeIndex];

  return (
    <div className="lg:hidden xl:hidden w-full px-4">
      <button 
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between p-4 bg-zinc-800 rounded-lg"
      >
        <span className="ascii-font">Archetypes</span>
        <ChevronRight 
          size={24} 
          className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="mt-4 bg-zinc-900 rounded-lg p-4 transition-all duration-300">
          <div className="flex items-center justify-between px-4 mb-4">
            <button 
              onClick={() => handleDirectionClick('left')}
              className="text-zinc-400 hover:text-zinc-200 hover:scale-125 transition-all"
              disabled={isTransitioning}
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="relative group">
              <span className="ascii-font cursor-help">{currentType.name}</span>
              {/* ... keep tooltip div ... */}
            </div>

            <button 
              onClick={() => handleDirectionClick('right')}
              className="text-zinc-400 hover:text-zinc-200 hover:scale-125 transition-all"
              disabled={isTransitioning}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'}`}>
            <div className="grid grid-cols-1 gap-4">
            {currentType.playlists?.map((playlist) => (
            <a
                key={playlist.id}
                href={`/archetype/${playlist.id}`}
                onClick={(e) => handleArchetypeClick(e, playlist)}
                onMouseEnter={() => handleArchetypeHover(playlist.color?.accent)}
                onMouseLeave={handleArchetypeLeave}
                className="playlist-item sidemenu-item flex group relative overflow-hidden items-center gap-5 
                        rounded-md shadow-lg hover:shadow-xl outline-none
                        p-4 hover:py-6 hover:scale-105 transition-all duration-300 ease-in-out
                        hover:bg-zinc-800/50"
                style={{ 
                '--hover-color': playlist.color?.accent,
                color: playlist.title === currentType.title ? playlist.color?.accent : undefined
                }}
                data-color={playlist.color?.accent}
                data-archetype-id={playlist.id}
            >
                <div className="flex flex-auto flex-col">
                <div className={`w-full ascii-font flex-none group-hover:text-[var(--hover-color)]
                                ${playlist.title === currentType.title ? 'font-bold ascii-font-lg' : ''}`}>
                    {playlist.title}
                </div>
                <div className={`text-zinc-400 ascii-font text-xs gap-1
                                ${playlist.title === currentType.title ? 'font-bold' : ''}`}>
                    {playlist.artists.join(', ')}
                </div>
                </div>
            </a>
            ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileArchetypeSwitcher;