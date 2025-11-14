import React, { useState } from "react";

export default function CaptchaStep({ onNext }) {
  const [input, setInput] = useState("");
  const correctAnswer = "ANANAB"; // banana backwards

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === correctAnswer) onNext();
  };

  return (
    <div>
      <h2>Step 3: Totally Legitimate Custom CAPTCHA</h2>
      <p>Please type the word <strong>BANANA</strong> backwards.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your masterpiece"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: "8px", marginRight: "8px" }}
        />

        <button type="submit" disabled={input !== correctAnswer}>
          Verify My Humanity (lol)
        </button>
      </form>
    </div>
  );
}
