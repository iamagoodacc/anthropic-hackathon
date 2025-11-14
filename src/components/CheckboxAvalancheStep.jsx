import React, { useMemo, useState } from "react";

const clauses = [
  "I will whisper compliments to my router every Sunday.",
  "I agree that left socks outrank right socks.",
  "I shall not feed the office printer after midnight.",
  "I confirm that pigeons might be government interns.",
  "I promise to water my houseplants with motivational speeches.",
  "I appreciate that this checkbox has infinite authority.",
  "I swear to only binge snacks clockwise around the bowl.",
  "I consent to being mildly inconvenienced for science.",
  "I will not challenge the toaster to a duel.",
  "I understand the moon is on the onboarding committee."
];

const INITIAL_COUNT = 3;
const REQUIRED_COUNT = 5;

const pickInitialClauses = () => {
  const pool = [...clauses];
  const picked = [];
  while (picked.length < INITIAL_COUNT && pool.length) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
};

export default function CheckboxAvalancheStep({ onNext }) {
  const [visibleClauses, setVisibleClauses] = useState(() => pickInitialClauses());
  const [checked, setChecked] = useState({});

  const remainingClauses = useMemo(
    () => clauses.filter((clause) => !visibleClauses.includes(clause)),
    [visibleClauses]
  );

  const addClause = () => {
    if (!remainingClauses.length) return;
    const nextIndex = Math.floor(Math.random() * remainingClauses.length);
    const nextClause = remainingClauses[nextIndex];
    setVisibleClauses((prev) => [...prev, nextClause]);
  };

  const toggleClause = (clause) => {
    setChecked((prev) => ({ ...prev, [clause]: !prev[clause] }));
  };

  const allChecked = visibleClauses.every((clause) => checked[clause]);
  const metQuota = visibleClauses.length >= REQUIRED_COUNT;
  const ready = allChecked && metQuota;

  return (
    <div>
      <h2>Step: Checkbox Avalanche</h2>
      <p>
        Please acknowledge an escalating number of wildly unnecessary clauses.
        Legal says it "sets the tone."
      </p>

      <div
        style={{
          border: "2px dashed #c084fc",
          borderRadius: "12px",
          padding: "16px",
          margin: "16px 0",
          background: "#120021",
          color: "#fff",
        }}
      >
        {visibleClauses.map((clause) => (
          <label
            key={clause}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={!!checked[clause]}
              onChange={() => toggleClause(clause)}
            />
            <span>{clause}</span>
          </label>
        ))}
      </div>

      <button
        style={{ width: "100%", marginBottom: "10px" }}
        onClick={addClause}
        disabled={!remainingClauses.length}
      >
        Generate More Paperwork ({remainingClauses.length || "0"} left)
      </button>

      <p style={{ fontSize: "0.9rem", color: "#666" }}>
        Need at least {REQUIRED_COUNT} signed clauses. Currently at {visibleClauses.length}.
      </p>

      <button
        style={{
          width: "100%",
          marginTop: "12px",
          background: ready ? "#8ef08e" : "#bbb",
        }}
        disabled={!ready}
        onClick={onNext}
      >
        Proceed With Excessive Compliance
      </button>
    </div>
  );
}
