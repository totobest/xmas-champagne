import db from "~/db";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { useContext, useState } from "react";
import { Button } from "primereact/button";
import { InputOtp } from "primereact/inputotp";
import { SessionContext } from "~/sessionContext";
import type { Session } from "@supabase/supabase-js";


export function LoginForm(props : {sessionCallback : (session: Session) => void  }) {
  const [step, setStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("+33601020304");
  const [otp, setOpt] = useState("123456");

  const isValid = step === 0 ? phoneNumber !== "" : otp !== "";
  const [loading, setLoading] = useState(false);

  async function signInWithOtp() {
    setLoading(true);
    try {
      const { data, error } = await db.auth.signInWithOtp({
        phone: phoneNumber,
      });
      if (error) {
        throw error;
      }
      setStep(1);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    try {
      const {
        data: { session },
        error,
      } = await db.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: "sms",
      });
      if (error) {
        throw error;
      }
      if (!session) {
        throw new Error("No session");
      }
      props.sessionCallback(session)
    } finally {
      setLoading(false);
    }
  }
  return (
    <Fieldset legend="Connexion">
        <div className="field grid">
          <label className="col" htmlFor="guess_1">
            Ton num :
          </label>
          <div className="col">
            <InputText
              disabled={step !== 0}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />{" "}
          </div>
        </div>
        {step === 1 && (
          <div className="field grid">
            <label className="col" htmlFor="guess_1">
              Regarde ton téléphone et tape le code :
            </label>
            <div className="col">
              <InputOtp
                value={otp}
                length={6}
                integerOnly
                onChange={(e) => setOpt(e.value as string)}
              />{" "}
            </div>
          </div>
        )}

        <Button
          disabled={!isValid}
          loading={loading}
          label="Valider"
          onClick={() => (step === 0 ? void signInWithOtp() : void verifyOtp())}
        />
    </Fieldset>
  );
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  
  if (session) 
    return children 

  return <LoginForm sessionCallback={setSession} />


}