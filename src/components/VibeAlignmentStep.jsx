import React, { useRef, useState, useEffect } from "react";

const prompts = [
  "Match the energy of a damp sock",
  "Tune yourself to chaotic neutral",
  "Align with the vibe of lukewarm tea",
  "Channel the enthusiasm of a bored raccoon",
  "Reach the exact chill level of office air conditioning"
];

export default function VibeAlignmentStep({ onNext }) {
  const [sliderValue, setSliderValue] = useState(50);
  const [status, setStatus] = useState("");
  const [showTarget, setShowTarget] = useState(false);
  const hideTimerRef = useRef(null);

  const [targetValue] = useState(
    () => Math.floor(Math.random() * 101)
  );

  const [prompt] = useState(
    () => prompts[Math.floor(Math.random() * prompts.length)]
  );


  const tolerance = 2; // because "precision" matters here
  const difference = Math.abs(sliderValue - targetValue);
  const aligned = difference <= tolerance;

  const revealTarget = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    setShowTarget(true);
    hideTimerRef.current = setTimeout(() => setShowTarget(false), 2000);
  };

  const checkAlignment = () => {
    if (aligned) {
      setStatus(
        "Perfect! The universe sighs in average satisfaction."
      );
    } else {
      setStatus(
        `Still off by ${difference} vibe points. Try squinting at the slider.`
      );
    }
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  return (
    <div>
      <h2>Step: Cosmic Vibe Alignment</h2>
      <p>{prompt}</p>

      <div
        style={{
          background: "#111",
          borderRadius: "12px",
          padding: "16px",
          marginTop: "16px",
          color: "#fff",
        }}
      >
        <p style={{ marginBottom: "8px" }}>
          Current vibe reading: <strong>{sliderValue}%</strong>
        </p>

        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          style={{ width: "100%" }}
        />

        <p style={{ marginTop: "10px", fontSize: "0.9rem", color: "#aaa" }}>
          Mystery vibe index: {showTarget ? `${targetValue}%` : "??%"}
        </p>
        <button style={{ width: "100%" }} onClick={revealTarget}>
          Peek at the Energy (for 2 seconds)
        </button>
      </div>

      <button
        style={{ marginTop: "12px", width: "100%" }}
        onClick={checkAlignment}
      >
        Check My Vibes
      </button>

      {status && (
        <p style={{ marginTop: "10px" }}>
          {status}
        </p>
      )}

      <button
        style={{
          marginTop: "20px",
          width: "100%",
          background: aligned ? "#45c46b" : "#888",
          color: "#000",
        }}
        onClick={onNext}
        disabled={!aligned}
      >
        Proceed With Perfect Alignment
      </button>
    </div>
  );
}
