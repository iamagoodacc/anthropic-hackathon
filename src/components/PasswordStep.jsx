import React, { useState } from "react";

export default function PasswordStep({ onNext }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password) onNext();
  };

  return (
    <div>
      <h2>Step 2: Enter Your Password</h2>
      <p>Don't worry, this password doesn't actually do anything.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Super Secure (not really)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "8px", marginRight: "8px" }}
        />

        <button type="submit" disabled={!password}>
          Continue
        </button>
      </form>
    </div>
  );
}
