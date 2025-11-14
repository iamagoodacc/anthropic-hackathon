import React, { useState } from "react";

export default function UsernameStep({ onNext }) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) onNext();
  };

  return (
    <div>
      <h2>Step 1: Enter Your Username</h2>
      <p>This does absolutely nothing, but we need it anyway.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Totally Necessary Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "8px", marginRight: "8px" }}
        />

        <button type="submit" disabled={!username}>
          Continue (for no reason)
        </button>
      </form>
    </div>
  );
}
