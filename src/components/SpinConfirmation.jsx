import React, { useState } from "react";

export default function SpinConfirmation({ onNext }) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div>
      <h2>Step 4: Spin in a Circle</h2>
      <p>
        Please stand up, spin in a full circle, then check the box below to confirm you definitely did it.
      </p>

      <label style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          style={{ marginRight: "8px" }}
        />
        I solemnly swear I spun in a circle.
      </label>

      <button style={{ marginTop: "10px" }} disabled={!confirmed} onClick={onNext}>
        Continue (I believe you… probably)
      </button>
    </div>
  );
}
