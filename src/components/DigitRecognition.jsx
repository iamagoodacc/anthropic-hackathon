import React, { useState, useRef, useEffect } from "react";
import { Eraser } from "lucide-react";

export default function DigitRecognition({ setOutput }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [predictions, setPredictions] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
        }
    }, []);

    // Utility to get proper canvas coords
    const getCanvasCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    };

    const startDrawing = (e) => {
        const ctx = canvasRef.current.getContext("2d");
        const { x, y } = getCanvasCoordinates(e);
        setIsDrawing(true);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current.getContext("2d");
        const { x, y } = getCanvasCoordinates(e);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 20;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            recognizeDigit();
        }
    };

    // Fake neural network prediction
    const recognizeDigit = async () => {
        setIsProcessing(true);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const grayscale = [];
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            grayscale.push(avg / 255);
        }

        await new Promise((r) => setTimeout(r, 300));

        const randomDigit = Math.floor(Math.random() * 10);
        const preds = Array.from({ length: 10 }, (_, i) => ({
            digit: i,
            confidence:
                i === randomDigit
                    ? 0.75 + Math.random() * 0.24
                    : Math.random() * 0.15,
        })).sort((a, b) => b.confidence - a.confidence);

        setPredictions(preds);
        setIsProcessing(false);

        if (setOutput) {
            setOutput({
                digit: preds[0].digit,
                confidence: preds[0].confidence,
                allPredictions: preds,
            });
        }
    };

    const clearCanvas = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setPredictions([]);
        if (setOutput) setOutput(null);
    };

    return (
        <div
            style={{
                background: "rgba(255,255,255,0.06)",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.15)",
                width: "100%",
                boxSizing: "border-box"
            }}
        >
            <h2 style={{ color: "white", marginBottom: "8px" }}>Draw a Digit</h2>
            <p style={{ color: "#ccc", marginBottom: "12px" }}>
                Draw the number <strong>7</strong> to pass this step.
            </p>

            {predictions.length > 0 && (
                <div
                    style={{
                        background: "rgba(34,197,94,0.15)",
                        border: "1px solid rgba(34,197,94,0.35)",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "16px",
                        textAlign: "center",
                    }}
                >
                    <p style={{ color: "#ccc", margin: 0 }}>Prediction:</p>
                    <p
                        style={{
                            color: "white",
                            fontSize: "48px",
                            margin: "4px 0",
                        }}
                    >
                        {predictions[0].digit}
                    </p>
                    <p style={{ color: "#4ade80", margin: 0 }}>
                        {(predictions[0].confidence * 100).toFixed(1)}%
                    </p>
                </div>
            )}

            {/* Canvas */}
            <div style={{ position: "relative" }}>
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    style={{
                        width: "100%",
                        borderRadius: "8px",
                        border: "3px solid rgba(255,255,255,0.25)",
                        display: "block",
                        cursor: "crosshair",
                    }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                />

                {isProcessing && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,0.4)",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "20px",
                        }}
                    >
                        Recognizing...
                    </div>
                )}
            </div>

            <button
                onClick={clearCanvas}
                style={{
                    width: "100%",
                    marginTop: "14px",
                    padding: "12px",
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                }}
            >
                <Eraser size={18} /> Clear
            </button>
        </div>
    );
}
