
import { useState } from "react";
import CodeStep from "../../components/Auth/CodeStep";
import EmailStep from "../../components/Auth/EmailStep";
import RegistrationStep from "../../components/Auth/RegistrationStep";
import { AuthProvider } from "../../contexts/AuthContext";

export default function AuthPage() {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep(prev => prev + 1);

  return (
    <AuthProvider>
      {step === 0 && <EmailStep onNext={nextStep} />}
      {step === 1 && <CodeStep onNext={nextStep} />}
      {step === 2 && <RegistrationStep />}
    </AuthProvider>
  );
}
