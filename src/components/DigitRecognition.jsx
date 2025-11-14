import React, { useState, useRef, useEffect } from "react";
import { Brain, Eraser } from "lucide-react";

export default function DigitRecognition({ onNext }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Start with black canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = "white";
    ctx.lineWidth = 20;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      recognizeDigit();
    }
  };

  const weightedRandomDigit = () => {
    const weights = [1, 1, 1, 1, 1, 1, 1, 3, 1, 1];
    // index = digit, value = weight
    // 7 has weight 3 → 3x more likely

    const total = weights.reduce((a, b) => a + b, 0);
    const r = Math.random() * total;

    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (r < sum) return i;
    }
  };

  const recognizeDigit = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const fakeDigit = weightedRandomDigit();
    setPrediction(fakeDigit);

    setIsProcessing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setPrediction(null);
  };

  return (
    <div>
      <h2>Step: Draw the Number 7</h2>
      <p>We need to confirm you're human by having you draw the number 7.</p>

      <div style={{ marginBottom: "15px" }}>
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          style={{
            border: "3px solid #ccc",
            borderRadius: "10px",
            cursor: "crosshair",
            width: "100%",
            background: "black",
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      {isProcessing && (
        <p style={{ fontStyle: "italic" }}>Recognizing your masterpiece…</p>
      )}

      {prediction !== null && !isProcessing && (
        <p>
          AI thinks you drew:{" "}
          <strong style={{ fontSize: "1.4rem" }}>{prediction}</strong>
        </p>
      )}

      <button
        onClick={clearCanvas}
        style={{
          width: "100%",
          background: "#ff5d5d",
          marginTop: "10px",
        }}
      >
        <Eraser size={18} style={{ marginRight: "6px" }} />
        Clear Canvas
      </button>

      <button
        onClick={onNext}
        disabled={prediction !== 7}
        style={{ width: "100%", marginTop: "15px" }}
      >
        Continue
      </button>
    </div>
  );
}
