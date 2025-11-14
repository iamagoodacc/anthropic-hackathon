import React, { useState } from "react";
import UsernameStep from "./components/UsernameStep";
import PasswordStep from "./components/PasswordStep";
import CaptchaStep from "./components/CaptchaStep";
import DigitRecognition from "./components/DigitRecognition";
import SpinConfirmation from "./components/SpinConfirmation";
import FinalScreen from "./components/FinalScreen";
import "./index.css";

export default function App() {
  const [step, setStep] = useState(0);

  const next = () => setStep((s) => s + 1);

  const steps = [
    <UsernameStep onNext={next} />,
    <PasswordStep onNext={next} />,
    <CaptchaStep onNext={next} />,
    <DigitRecognition onNext={next} />,  // ← NEW STEP
    <SpinConfirmation onNext={next} />,
    <FinalScreen />
  ];


  return (
    <div className="container">
      {steps.map((component, index) => {
        if (index <= step) {
          return (
            <div key={index} className="step-card">
              {component}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
