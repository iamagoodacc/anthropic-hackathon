import React from 'react';

export default function PasswordModal({
  isLocked,
  passwordLevel,
  attemptsLeft,
  passwordInput,
  setPasswordInput,
  passwordMessage,
  submitPassword,
  startPasswordGame,
  isLockout,
  password
  ,
  floatDigits
}) {
  if (!isLocked) return null;

  // Derive code length from password level to match generation logic in App
  const codeLength = 2 + Math.min(Math.max(passwordLevel, 1), 3); // level1->3, 2->4, 3->5

  const [floats, setFloats] = React.useState([]);
  const [selected, setSelected] = React.useState({});

  // Generate floating digits when modal opens
    React.useEffect(() => {
      if (!isLocked) return;
        // Create exactly one floating item per password digit (so the floats only contain the correct code)
        // Prefer `floatDigits` passed from App (guaranteed to match the generated password), fallback to password or generated digits
        const sourceDigits = (floatDigits && floatDigits.length) ? floatDigits : ((password && password.length) ? password.split('') : Array.from({ length: codeLength }, () => Math.floor(Math.random() * 10).toString()));
        const randPercent = (min, max) => `${(min + Math.random() * (max - min)).toFixed(2)}%`;
        const arr = sourceDigits.map((d, i) => {
          // place each float randomly along one of the four edges (top/right/bottom/left)
          const side = Math.floor(Math.random() * 4);
          let left, top;
          if (side === 0) {
            // top edge
            top = randPercent(2, 8);
            left = randPercent(5, 95);
          } else if (side === 1) {
            // right edge
            left = randPercent(88, 96);
            top = randPercent(5, 95);
          } else if (side === 2) {
            // bottom edge
            top = randPercent(88, 96);
            left = randPercent(5, 95);
          } else {
            // left edge
            left = randPercent(4, 12);
            top = randPercent(5, 95);
          }
          return {
            id: i,
            digit: d,
            left,
            top,
            delay: Math.random() * 2
          };
        });
      setFloats(arr);
      setSelected({});
    }, [isLocked, password, codeLength]);

  const onFloatClick = (f) => {
    if (isLockout) return;
    if (selected[f.id]) return; // already used
    if (passwordInput.length >= codeLength) return;
    setPasswordInput(prev => prev + f.digit);
    setSelected(s => ({ ...s, [f.id]: true }));
  };

  const clearSelection = () => {
    setPasswordInput('');
    setSelected({});
  };

  return (
    <div className={`fixed inset-0 z-60 flex items-center justify-center pointer-events-auto`}>
      <div className={`opacity-100 transition-opacity duration-200 absolute inset-0 bg-black/80 z-60`}></div>
      {/* floating digits layer: render above the modal box so floats are clickable */}
      <div className="absolute inset-0 z-90 pointer-events-auto">
        {floats.map(f => (
          <div
            key={f.id}
            onClick={() => onFloatClick(f)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 bg-white/10 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg select-none transition-opacity duration-150 ${selected[f.id] ? 'opacity-30 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
            style={{ left: f.left, top: f.top, animation: `float ${3 + f.delay}s ease-in-out infinite`, cursor: isLockout ? 'not-allowed' : 'pointer' }}
          >
            {f.digit}
          </div>
        ))}
      </div>

      <div className={`relative z-80 w-full max-w-md mx-4 p-6 bg-gray-900 border border-gray-700 rounded-lg text-white shadow-2xl scale-100 transition-transform duration-200`}>
        <div className="text-lg font-bold mb-2">PASSWORD PUZZLE — Level {passwordLevel} ({codeLength} digits)</div>
        <div className="text-sm text-gray-300 mb-3">Enter the {codeLength}-digit numeric code to re-enable the center click. Attempts left: {attemptsLeft}</div>
        <div className="mb-3">
          <input
            type="text"
            inputMode="numeric"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value.replace(/[^0-9]/g, '').slice(0, codeLength))}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-xl text-center tracking-widest"
            placeholder={`${'_'.repeat(codeLength)}`}
            disabled={isLockout}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={submitPassword}
            disabled={isLockout}
            className="bg-green-700 disabled:opacity-50 px-4 py-2 rounded"
          >
            Submit
          </button>
          <button
            onClick={clearSelection}
            disabled={isLockout}
            className="bg-red-700 disabled:opacity-50 px-3 py-2 rounded"
          >
            Clear
          </button>
          <button
            onClick={() => {
              if (isLockout) return;
              startPasswordGame();
            }}
            disabled={isLockout}
            className="bg-yellow-700 disabled:opacity-50 px-3 py-2 rounded"
          >
            Regenerate
          </button>
          <div className="ml-auto text-sm text-gray-300">{passwordMessage}</div>
        </div>
        <div className="mt-4 text-xs text-gray-500">Hint: numeric code; higher levels increase length.</div>
      </div>
    </div>
  );
}
