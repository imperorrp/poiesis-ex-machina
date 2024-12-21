import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { currentPrompt, currentArchetypeType } from '../../store/atom.js';

const ArchetypeSwitcher = ({ archetypeData }) => {
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { 
    eristicsPlaylists, 
    jungianPlaylists, 
    dndPlaylists 
  } = archetypeData;

  const archetypeTypes = [
    { name: "Eristics", playlists: eristicsPlaylists, tooltip: "Eristics Test archetypes" },
    { name: "Jungian", playlists: jungianPlaylists, tooltip: "Carl Jung's psychological archetypes" },
    { name: "Dungeons & Dragons", playlists: dndPlaylists, tooltip: "D&D class-based archetypes" }
  ];

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

  const currentType = archetypeTypes[currentTypeIndex];

  return (
    <div className="flex flex-col gap-4 bg-zinc-900 rounded-lg p-4">
      <div className="flex items-center justify-between px-4">
        <button 
          onClick={() => handleDirectionClick('left')}
          className="text-zinc-400 hover:text-zinc-200 hover:scale-125 transition-colors disabled:opacity-50"
          disabled={isTransitioning}
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="relative group">
          <span className="ascii-font cursor-help">
            {currentType.name}
          </span>
          
          <div className="absolute invisible group-hover:visible bg-zinc-800/95 
                         backdrop-blur-sm text-zinc-200 px-6 py-4 rounded-lg 
                         shadow-xl -bottom-24 left-1/2 transform -translate-x-1/2 
                         w-64 text-center text-sm z-50 border border-zinc-700">
            <div className="font-bold mb-2">{currentType.name}</div>
            <p>{currentType.tooltip}</p>
          </div>
        </div>

        <button 
          onClick={() => handleDirectionClick('right')}
          className="text-zinc-400 hover:text-zinc-200 hover:scale-125 transition-colors disabled:opacity-50"
          disabled={isTransitioning}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'}`}>
        <div className="space-y-2">
          {currentType.playlists?.map((playlist) => (
            <a
              key={playlist.id}
              href={`/archetype/${playlist.id}`}
              onClick={(e) => handleArchetypeClick(e, playlist)}
              onMouseEnter={() => handleArchetypeHover(playlist.color?.accent)}
              onMouseLeave={handleArchetypeLeave}
              className="playlist-item sidemenu-item flex group relative overflow-hidden items-center gap-5 
                       rounded-md shadow-lg hover:shadow-xl outline-none
                       p-4 hover:py-6 hover:scale-110 transition-all duration-300 ease-in-out
                       hover:bg-zinc-800/50"
              style={{ 
                '--hover-color': playlist.color?.accent,
                color: playlist.title === currentType.title ? playlist.color?.accent : undefined
              }}
              data-color={playlist.color?.accent}
              data-archetype-id={playlist.id}
            >
              <div className="flex flex-auto flex-col ">
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
  );
};

export default ArchetypeSwitcher;