import React, { useState, useEffect, useRef } from 'react';

export default function VoidClicker() {
  const [voidCount, setVoidCount] = useState(0);
  const [upgrades, setUpgrades] = useState({
    moreNothing: false,
    slightlyFaster: false,
    aesthetics: false,
    existentialDread: false,
    brainrot: false
  });
  const [prestigeLevel, setPrestigeLevel] = useState(0);
  const [showPrestige, setShowPrestige] = useState(false);
  const [showMeme, setShowMeme] = useState(false);
  const [currentMeme, setCurrentMeme] = useState('');
  const [showDreadMessage, setShowDreadMessage] = useState(false);
  const [dreadMessage, setDreadMessage] = useState('');
  const audioRef = useRef(null);

  const dreadMessages = [
    "You've been clicking for a while now.",
    "This button does nothing. You know that, right?",
    "Your time is literally becoming void.",
    "There are 8,760 hours in a year. You're spending some here.",
    "The void doesn't care about your clicks.",
    "Achievement Unlocked: Questioning Life Choices",
    "Fun fact: Nothing is happening.",
    "Still here?",
    "The void is proud of you (it's not).",
    "Congratulations on wasting electricity.",
    "Your FBI agent is concerned.",
    "Peak productivity right here.",
    "Main character energy: 0",
    "Are you winning, son?",
    "Touch grass DLC coming soon."
  ];

  const memes = [
    "IS THIS RIZZ?",
    "ONLY IN OHIO 💀",
    "SIGMA GRINDSET",
    "BING CHILLING 🥶",
    "GYATT",
    "SKIBIDI TOILET",
    "FANUM TAX",
    "WHOPPER WHOPPER",
    "MISTAKE ❌ MASTERPIECE ✓",
    "NO CAP FR FR",
    "IT'S GIVING ___",
    "SLAY QUEEN",
    "BUSSIN'",
    "SHEESH",
    "CAUGHT IN 4K"
  ];

  // Play audio loop every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          // Ignore autoplay errors
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Auto-voiding (barely)
  useEffect(() => {
    if (upgrades.slightlyFaster) {
      const interval = setInterval(() => {
        setVoidCount(prev => prev + 1);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [upgrades.slightlyFaster]);

  // Existential dread messages
  useEffect(() => {
    if (upgrades.existentialDread) {
      const interval = setInterval(() => {
        const randomMessage = dreadMessages[Math.floor(Math.random() * dreadMessages.length)];
        setDreadMessage(randomMessage);
        setShowDreadMessage(true);
        setTimeout(() => setShowDreadMessage(false), 4000);
      }, 45000);
      return () => clearInterval(interval);
    }
  }, [upgrades.existentialDread]);

  // Check for prestige availability
  useEffect(() => {
    if (voidCount >= 1000 && !showPrestige) {
      setShowPrestige(true);
    }
  }, [voidCount, showPrestige]);

  const handleVoidClick = () => {
    setVoidCount(prev => prev + 1);
  };

  const buyUpgrade = (upgradeName) => {
    setUpgrades(prev => ({
      ...prev,
      [upgradeName]: true
    }));
    // Deduct cost (but it doesn't really matter)
    setVoidCount(prev => Math.max(0, prev - 1));
  };

  const transcend = () => {
    setPrestigeLevel(prev => prev + 1);
    setVoidCount(0);
    setShowPrestige(false);
  };

  const showBrainrot = () => {
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];
    setCurrentMeme(randomMeme);
    setShowMeme(true);
    setTimeout(() => setShowMeme(false), 5000);
  };

  const counterColor = upgrades.moreNothing ? 'text-gray-400' : 'text-white';
  const voidColor = upgrades.aesthetics ? 'bg-black' : 'bg-gray-900';

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Audio element */}
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=" />
      
      {/* Fake audio indicator for the "vibe" */}
      <div className="absolute top-4 right-4 text-xs text-gray-600 font-mono">
        ♪ rizz.mp3 (10s loop)
      </div>

      {/* Counter */}
      <div className={`absolute top-8 left-8 text-6xl font-bold ${counterColor} transition-colors duration-1000`}>
        {voidCount.toLocaleString()}
      </div>

      {/* Prestige indicator */}
      {prestigeLevel > 0 && (
        <div className="absolute top-8 right-8 text-sm text-gray-500">
          Transcendence Level: {prestigeLevel}
          <div className="text-xs text-gray-600">
            (This means nothing)
          </div>
        </div>
      )}

      {/* The Void */}
      <div className="flex flex-col items-center justify-center mb-12">
        <button
          onClick={handleVoidClick}
          className={`w-64 h-64 rounded-full ${voidColor} border-2 border-gray-800 transition-all duration-300 hover:border-gray-700 active:scale-95 cursor-pointer`}
          aria-label="The Void"
        >
          <span className="text-gray-700 text-sm">The Void</span>
        </button>
        <p className="mt-4 text-gray-600 text-xs">Click for meaning (there is none)</p>
      </div>

      {/* Upgrades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
        <button
          onClick={() => buyUpgrade('moreNothing')}
          disabled={upgrades.moreNothing || voidCount < 10}
          className="bg-gray-900 border border-gray-800 p-4 rounded-lg hover:bg-gray-850 disabled:opacity-50 disabled:cursor-not-allowed text-left"
        >
          <div className="font-bold text-sm">More Nothing</div>
          <div className="text-xs text-gray-500 mt-1">
            Changes counter color to slightly different gray
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Cost: 10 voids {upgrades.moreNothing && '✓ OWNED'}
          </div>
        </button>

        <button
          onClick={() => buyUpgrade('slightlyFaster')}
          disabled={upgrades.slightlyFaster || voidCount < 50}
          className="bg-gray-900 border border-gray-800 p-4 rounded-lg hover:bg-gray-850 disabled:opacity-50 disabled:cursor-not-allowed text-left"
        >
          <div className="font-bold text-sm">Slightly Faster Nothing</div>
          <div className="text-xs text-gray-500 mt-1">
            Auto-voiding technology! +1 void every 30 seconds!
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Cost: 50 voids {upgrades.slightlyFaster && '✓ OWNED'}
          </div>
        </button>

        <button
          onClick={() => buyUpgrade('aesthetics')}
          disabled={upgrades.aesthetics || voidCount < 100}
          className="bg-gray-900 border border-gray-800 p-4 rounded-lg hover:bg-gray-850 disabled:opacity-50 disabled:cursor-not-allowed text-left"
        >
          <div className="font-bold text-sm">Aesthetics 💎 PREMIUM</div>
          <div className="text-xs text-gray-500 mt-1">
            Now 10% more void-like. Darker black technology.
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Cost: 100 voids {upgrades.aesthetics && '✓ OWNED'}
          </div>
        </button>

        <button
          onClick={() => buyUpgrade('existentialDread')}
          disabled={upgrades.existentialDread || voidCount < 200}
          className="bg-gray-900 border border-gray-800 p-4 rounded-lg hover:bg-gray-850 disabled:opacity-50 disabled:cursor-not-allowed text-left"
        >
          <div className="font-bold text-sm">Existential Dread</div>
          <div className="text-xs text-gray-500 mt-1">
            Unlock occasional messages questioning your life choices
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Cost: 200 voids {upgrades.existentialDread && '✓ OWNED'}
          </div>
        </button>

        <button
          onClick={() => {
            buyUpgrade('brainrot');
          }}
          disabled={upgrades.brainrot || voidCount < 150}
          className="bg-gray-900 border border-gray-800 p-4 rounded-lg hover:bg-gray-850 disabled:opacity-50 disabled:cursor-not-allowed text-left"
        >
          <div className="font-bold text-sm">Brainrot Generator</div>
          <div className="text-xs text-gray-500 mt-1">
            Displays random internet meme for 5 seconds
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Cost: 150 voids {upgrades.brainrot && '✓ OWNED'}
          </div>
        </button>

        {upgrades.brainrot && (
          <button
            onClick={showBrainrot}
            className="bg-purple-900 border border-purple-700 p-4 rounded-lg hover:bg-purple-800 text-left"
          >
            <div className="font-bold text-sm">🧠 Activate Brainrot</div>
            <div className="text-xs text-purple-300 mt-1">
              Click for instant regret
            </div>
          </button>
        )}
      </div>

      {/* Prestige Button */}
      {showPrestige && (
        <button
          onClick={transcend}
          className="mt-8 bg-gradient-to-r from-purple-900 to-blue-900 border-2 border-purple-500 px-8 py-4 rounded-lg hover:from-purple-800 hover:to-blue-800 animate-pulse"
        >
          <div className="font-bold text-lg">⭐ TRANSCEND THE VOID ⭐</div>
          <div className="text-xs text-gray-400 mt-1">
            Reset everything for... basically nothing
          </div>
        </button>
      )}

      {/* Existential Dread Popup */}
      {showDreadMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-900 border-2 border-red-500 p-6 rounded-lg shadow-2xl z-50 max-w-md animate-pulse">
          <div className="text-center text-lg font-bold">{dreadMessage}</div>
        </div>
      )}

      {/* Brainrot Meme Display */}
      {showMeme && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-6xl md:text-8xl font-black text-white animate-pulse text-center px-4">
            {currentMeme}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-gray-700 text-xs">
        <div>Void Clicker™ - Nothing Inc.</div>
        <div className="mt-1">You are here: 🔴 You are clicking nothing</div>
        <div className="mt-1">Achievement Progress: {Math.min(100, Math.floor(voidCount / 10))}% to Meaninglessness</div>
      </div>
    </div>
  );
}
