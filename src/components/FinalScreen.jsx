import React from "react";

export default function FinalScreen() {
  return (
    <div>
      <h2>🎉 Congratulations! 🎉</h2>
      <p>
        You completed all the useless steps!  
        Unfortunately, your login has been denied for absolutely no reason.
      </p>

      <p style={{ marginTop: "20px", fontStyle: "italic" }}>
        (Try again? It won’t help.)
      </p>
    </div>
  );
}
