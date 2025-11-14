import React, { useState } from "react";
import UsernameStep from "./components/UsernameStep";
import PasswordStep from "./components/PasswordStep";
import CaptchaStep from "./components/CaptchaStep";
import CheckboxAvalancheStep from "./components/CheckboxAvalancheStep";
import DigitRecognition from "./components/DigitRecognition";
import VibeAlignmentStep from "./components/VibeAlignmentStep";
import SpinConfirmation from "./components/SpinConfirmation";
import FinalScreen from "./components/FinalScreen";
import "./index.css";

const STEP_FLOW = [
  { id: "username", component: UsernameStep },
  { id: "password", component: PasswordStep },
  { id: "captcha", component: CaptchaStep },
  { id: "checkbox", component: CheckboxAvalancheStep },
  { id: "digit", component: DigitRecognition },
  { id: "vibe", component: VibeAlignmentStep },
  { id: "spin", component: SpinConfirmation },
  { id: "final", component: FinalScreen, skippable: false, forwardNext: false },
];

export default function App() {
  const [step, setStep] = useState(0);
  const totalSteps = STEP_FLOW.length;

  const goToNextStep = () => setStep((current) => Math.min(current + 1, totalSteps - 1));
  const skipCurrentStep = () => goToNextStep();
  return (
    <div className="container">
      {STEP_FLOW.map((definition, index) => {
        if (index > step) return null;

        const StepComponent = definition.component;
        const componentProps = definition.forwardNext === false ? {} : { onNext: goToNextStep };
        const isActive = index === step;
        const isLastStep = index === totalSteps - 1;
        const showSkipButton =
          isActive && !isLastStep && definition.skippable !== false;

        return (
          <div key={definition.id} className="step-card">
            <StepComponent {...componentProps} />
            {showSkipButton && (
              <button
                type="button"
                className="skip-button"
                onClick={skipCurrentStep}
              >
                Skip this step (I thrive on impatience)
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
