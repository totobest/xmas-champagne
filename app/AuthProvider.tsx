import db from "~/db";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { use, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputOtp } from "primereact/inputotp";
import type { Session } from "@supabase/supabase-js";
import { useToastContext } from "./ToastContext";

export function LoginFormPhoneOTP() {
  const toast = useToastContext();

  const [step, setStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOpt] = useState("");

  const isValid = phoneNumber !== "" && step === 0  || otp !== "";
  const [loading, setLoading] = useState(false);

  async function signInWithOtp() {
    setLoading(true);
    try {
      const { data, error } = await db.auth.signInWithOtp({
        phone: phoneNumber,
      });
      if (error) {
        toast.show({ severity: "error", detail: error.message });
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
        toast.show({ severity: "error", detail: error.message });
        throw error;
      }
      if (!session) {
        toast.show({ severity: "error", detail: "No session" });
        throw new Error("No session");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Fieldset legend="Connexion">
      <div className="field grid">
        <label className="col" htmlFor="guess_1">
          {step !== 2 ? <>Ton num</> : <>Ton email</>}
        </label>
        <div className="col">
          <InputText
            disabled={step === 1}
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
        icon="pi pi-heart"
        loading={loading}
        label="Valider"
        onClick={() => (step === 0 ? void signInWithOtp() : void verifyOtp())}
      />
    </Fieldset>
  );
}

export function LoginFormPhonePW() {
  const toast = useToastContext();

  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");

  const isValid = phone !== "" && pw !== "";
  const [loading, setLoading] = useState(false);

  async function verifyPw() {
    setLoading(true);
    try {
      const {
        data: { session },
        error,
      } = await db.auth.signInWithPassword({
        phone: phone,
        password: pw,
      });
      if (error) {
        toast.show({ severity: "error", detail: error.message });
        throw error;
      }
      if (!session) {
        toast.show({ severity: "error", detail: "No session" });
        throw new Error("No session");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Fieldset legend="Connexion">
      <div className="field grid">
        <label className="col" htmlFor="guess_1">
          {<>Ton num</>}
        </label>
        <div className="col">
          <InputText value={phone} onChange={(e) => setPhone(e.target.value)} />{" "}
        </div>
      </div>
      <div className="field grid">
        <label className="col" htmlFor="guess_1">
          Ton mdp :
        </label>
        <div className="col">
          <InputText value={pw} onChange={(e) => setPw(e.target.value)} />{" "}
        </div>
      </div>

      <Button
        disabled={!isValid}
        icon="pi pi-heart"
        loading={loading}
        label="Valider"
        onClick={() => void verifyPw()}
      />
    </Fieldset>
  );
}

export function NameForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const isValid = name !== "";
  const toast = useToastContext();
  async function submit() {
    setLoading(true);
    try {
      const {data, error} = await db.auth.updateUser({ data: { name } });
      if (error) {
        toast.show({ severity: "error", detail: error.message });
        return
      } 
      console.log("user updated", JSON.stringify(data));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Fieldset legend="Ton nom?">
      <div className="field grid">
        <label className="col" htmlFor="guess_1">
          {<>Ton nom</>}
        </label>
        <div className="col">
          <InputText value={name} onChange={(e) => setName(e.target.value)} />{" "}
        </div>
      </div>

      <Button
        disabled={!isValid}
        icon="pi pi-heart"
        loading={loading}
        label="Valider"
        onClick={() => void submit()}
      />
    </Fieldset>
  );
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [name, setName] = useState("");
  useEffect(() => {
    const { data } = db.auth.onAuthStateChange((event, session) => {
      console.log("auth event", event);
      if (event === "INITIAL_SESSION") {
        // handle initial session
      } else if (event === "SIGNED_IN") {
        // handle sign in event
        setSession(session);
        setName(session?.user?.user_metadata.name);
      } else if (event === "SIGNED_OUT") {
        // handle sign out event
        setSession(null);
        setName("");
      } else if (event === "PASSWORD_RECOVERY") {
        // handle password recovery event
      } else if (event === "TOKEN_REFRESHED") {
        // handle token refreshed event
      } else if (event === "USER_UPDATED") {
        // handle user updated event
        console.log("user updated", JSON.stringify(session?.user?.user_metadata));
        setName(session?.user?.user_metadata.name);

      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  if (session) {
    if (!name) {
      return <NameForm />;
    }
    return children;
  }
  return <LoginFormPhoneOTP />;
}
