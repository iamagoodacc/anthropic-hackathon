import React, { useState, useEffect, useRef } from 'react';
import PasswordModal from './components/PasswordModal';

export default function App() {
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

  const [isPrimedOverlayVisible, setPrimedOverlayVisible] = useState(false);
  const primedTimeoutRef = useRef(null);
  const lastPrimeRef = useRef(null);
  // Configurable durations (milliseconds)
  const PRIME_OVERLAY_DURATION = 2000;
  const PRIME_FADE_MS = 300;
  // Locking/password game config
  const LOCK_CHANCE = 0.02; // ~2% chance per click to lock the center
  // Activation config: center starts inactive and activates randomly
  const ACTIVATION_CHANCE = 0.05; // chance per interval to activate center
  const ACTIVATION_INTERVAL_MS = 1500; // check every 1.5s

  const [isLocked, setIsLocked] = useState(false);
  const [centerActive, setCenterActive] = useState(true); // does center accept clicks (enabled by default)
  const [othersDisabled, setOthersDisabled] = useState(false); // disable other UI when center active
  const [passwordLevel, setPasswordLevel] = useState(1);
  const [password, setPassword] = useState('');
  const [floatDigits, setFloatDigits] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isLockout, setIsLockout] = useState(false);
  const [failureCycles, setFailureCycles] = useState(0);
  const [deepFryLevel, setDeepFryLevel] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  // Random deep-fry configuration
  const DEEP_FRY_CHANCE = 0.15; // 15% per interval (higher frequency)
  const DEEP_FRY_INTERVAL_MS = 10000; // every 10s
  const DEEP_FRY_DECAY_MS = 8000; // decay interval (gradual decay)

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
    "CAUGHT IN 4K",
    "67"
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

  // Prime helper
  const isPrime = (n) => {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i * i <= n; i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  };

  const handleVoidClick = () => {
    // If locked or center not active, ignore clicks
    if (isLocked || !centerActive) return;

    setVoidCount(prev => {
      const newCount = prev + 1;
      if (isPrime(newCount) && lastPrimeRef.current !== newCount) {
        lastPrimeRef.current = newCount;
        setPrimedOverlayVisible(true);
        if (primedTimeoutRef.current) clearTimeout(primedTimeoutRef.current);
        primedTimeoutRef.current = setTimeout(() => {
          setPrimedOverlayVisible(false);
        }, PRIME_OVERLAY_DURATION);
      }

      // Randomly trigger password lock on click
      try {
        if (!isLocked && !isLockout && Math.random() < LOCK_CHANCE) {
          startPasswordGame();
        }
      } catch (e) {
        // ignore
      }

      return newCount;
    });
  };

  // Password game helpers
  const generatePassword = (level) => {
    // level 1 -> 3 digits, level 2 -> 4 digits, level 3 -> 5 digits
    const length = 2 + Math.min(Math.max(level, 1), 3);
    let s = '';
    for (let i = 0; i < length; i++) s += Math.floor(Math.random() * 10).toString();
    return s;
  };

  const startPasswordGame = () => {
    const level = Math.floor(Math.random() * 3) + 1; // 1..3
    const pwd = generatePassword(level);
    const attempts = 3;
    setPasswordLevel(level);
    setPassword(pwd);
    setFloatDigits(pwd.split(''));
    setAttemptsLeft(attempts);
    setPasswordInput('');
    setPasswordMessage('');
    setIsLocked(true);
    setIsLockout(false);
    setOthersDisabled(true);
  };

  // Ensure that if modal opens it's properly initialized (prevents 0 attempts stuck state)
  useEffect(() => {
    if (isLocked) {
      // If attempts haven't been initialized, start a new password game
      if (!attemptsLeft || attemptsLeft <= 0) {
        startPasswordGame();
      }
      // Also ensure there's a password generated
      if (!password) {
        startPasswordGame();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocked]);

  // Activation loop: periodically attempt to activate the center if it's inactive
  useEffect(() => {
    const id = setInterval(() => {
      if (!centerActive && !isLocked) {
        if (Math.random() < ACTIVATION_CHANCE) {
          // activate center and disable other UI
          setCenterActive(true);
          setOthersDisabled(true);
        }
      }
    }, ACTIVATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [centerActive, isLocked]);

  const submitPassword = () => {
    if (!isLocked) return;
    if (passwordInput === password) {
      // success
      setPasswordMessage('Unlocked!');
      // Do NOT reset the void counter on success — keep progress intact
      setTimeout(() => {
        setIsLocked(false);
        setPassword('');
        setPasswordInput('');
        setPasswordMessage('');
        setOthersDisabled(false);
      }, 600);
      return;
    }

    setAttemptsLeft(prev => {
      const next = prev - 1;
      if (next <= 0) {
        // failed-out: trigger temporary lockout and deep-fry progression
        setPasswordMessage('Too many failures — locked out for 5s');
        setIsLockout(true);
        setFailureCycles(fc => {
          const newFc = fc + 1;
          // Every 3 failure cycles, increase deep-fry level
          if (newFc % 3 === 0) {
            setDeepFryLevel(d => d + 1);
          }
          return newFc;
        });

        // Trigger a short shake effect
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 800);

        // After lockout duration, allow attempts again
        setTimeout(() => {
          setIsLockout(false);
          setAttemptsLeft(3);
          setPasswordMessage('You may try again');
        }, 5000);

        return 0;
      }
      setPasswordMessage('Incorrect — try again');
      return next;
    });
    setPasswordInput('');
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

  // Cleanup for prime overlay timeout when component unmounts
  useEffect(() => {
    return () => {
      if (primedTimeoutRef.current) clearTimeout(primedTimeoutRef.current);
    };
  }, []);

  // Periodically, randomly increase deep-fry level to make the UI degrade over time
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < DEEP_FRY_CHANCE) {
        setDeepFryLevel(d => Math.min(10, d + 1));
      }
    }, DEEP_FRY_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // decay the deep-fry level gradually over time so it isn't permanent and reduces slowly
  useEffect(() => {
    const id = setInterval(() => {
      setDeepFryLevel(d => Math.max(0, d - 1));
    }, DEEP_FRY_DECAY_MS);
    return () => clearInterval(id);
  }, []);

  const counterColor = upgrades.moreNothing ? 'text-gray-400' : 'text-white';
  const voidColor = upgrades.aesthetics ? 'bg-black' : 'bg-gray-900';

  // Compute inline styles to apply a "deep-fry" visual distortion based on level
  const getDeepFryStyle = (level) => {
    if (!level) return {};
    const blur = Math.min(4, level * 1.5);
    const hue = (level * 30) % 360;
    const saturate = 1 + level * 0.25;
    const contrast = 1 + level * 0.1;
    return {
      filter: `blur(${blur}px) hue-rotate(${hue}deg) saturate(${saturate}) contrast(${contrast})`,
    };
  };

  return (
    <div
      className={`min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8 relative overflow-hidden ${isShaking ? 'shake' : ''}`}
      style={getDeepFryStyle(deepFryLevel)}
    >
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
          disabled={!centerActive || isLocked}
          className={`w-64 h-64 rounded-full ${voidColor} border-2 border-gray-800 transition-all duration-300 hover:border-gray-700 active:scale-95 ${(!centerActive || isLocked) ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          aria-label="The Void"
        >
          <span className="text-gray-700 text-sm">The Void</span>
        </button>
        <p className="mt-4 text-gray-600 text-xs">
          {centerActive ? 'Center active — click for void' : 'Center inactive — waiting for activation'}
        </p>
      </div>

      {/* Upgrades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
        <button
          onClick={() => buyUpgrade('moreNothing')}
          disabled={upgrades.moreNothing || voidCount < 10 || othersDisabled}
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
          disabled={upgrades.slightlyFaster || voidCount < 50 || othersDisabled}
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
          disabled={upgrades.aesthetics || voidCount < 100 || othersDisabled}
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
          disabled={upgrades.existentialDread || voidCount < 200 || othersDisabled}
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
          disabled={upgrades.brainrot || voidCount < 150 || othersDisabled}
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
            disabled={othersDisabled}
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
          disabled={othersDisabled}
          className="mt-8 bg-gradient-to-r from-purple-900 to-blue-900 border-2 border-purple-500 px-8 py-4 rounded-lg hover:from-purple-800 hover:to-blue-800 animate-pulse disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Prime blackout overlay (always rendered to allow fade/transition) */}
      <div
        aria-hidden={!isPrimedOverlayVisible}
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-${Math.min(Math.max(PRIME_FADE_MS,100),1000)} ${isPrimedOverlayVisible ? 'opacity-100 pointer-events-auto bg-black' : 'opacity-0 pointer-events-none bg-black/0'}`}
      >
        <div className="text-5xl md:text-8xl font-extrabold text-white uppercase tracking-widest text-center px-4 animate-pulse drop-shadow-lg">
          PRIMED FOR NOTHING
        </div>
      </div>

      {/* Password lock modal (separated component) */}
      <PasswordModal
        isLocked={isLocked}
        passwordLevel={passwordLevel}
        attemptsLeft={attemptsLeft}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        passwordMessage={passwordMessage}
        submitPassword={submitPassword}
        startPasswordGame={startPasswordGame}
        isLockout={isLockout}
        password={password}
        floatDigits={floatDigits}
      />

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-gray-700 text-xs">
        <div>Void Clicker™ - Nothing Inc.</div>
        <div className="mt-1">You are here: 🔴 You are clicking nothing</div>
        <div className="mt-1">Achievement Progress: {Math.min(100, Math.floor(voidCount / 10))}% to Meaninglessness</div>
      </div>
    </div>
  );
}
