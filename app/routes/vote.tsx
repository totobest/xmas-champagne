import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Fieldset } from "primereact/fieldset";
import { Message } from "primereact/message";
import type { SelectItemOptionsType } from "primereact/selectitem";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import db from "~/db";

export default function Page() {
  const [guess_1, setGuess_1] = useState("");
  const [guess_2, setGuess_2] = useState("");
  const [guess_3, setGuess_3] = useState("");
  const guesses: SelectItemOptionsType = ["Ruinard", "Bio", "Gosset"];
  const toast = useRef<Toast>(null);
  async function submit() {
    if (!toast.current) return;
    const { data, error } = await db
      .from("vote")
      .upsert({ guess_1: guess_1, guess_2: guess_2, guess_3: guess_3 })
      .select();
    if (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
      });
    } else {
      toast.current.show({
        severity: "info",
        summary: "Info",
        detail: "Message Content",
      });
    }
  }

  const isValid = guess_1 && guess_2 && guess_3;

  return (
    <>
      <Toast ref={toast} />
      <Fieldset legend="Votes">
        <p className="m-0">
          <div className="field grid">
            <label className="col" htmlFor="guess_1">
              Choix bleu :
            </label>
            <div className="col">
              <Dropdown
                showClear
                value={guess_1}
                onChange={(e) => setGuess_1(e.value)}
                options={guesses}
                placeholder="Fais ton choix"
              />
            </div>
          </div>
          <div className="field grid">
            <label className="col" htmlFor="guess_2">
              Choix rouge :
            </label>
            <div className="col">
              <Dropdown
                showClear
                value={guess_2}
                onChange={(e) => setGuess_2(e.value)}
                options={guesses}
                placeholder="Fais ton choix"
              />
            </div>
          </div>{" "}
          <div className="field grid">
            <label className="col" htmlFor="guess_3">
              Choix vert :
            </label>
            <div className="col">
              <Dropdown
                showClear
                value={guess_3}
                onChange={(e) => setGuess_3(e.value)}
                options={guesses}
                placeholder="Fais ton choix"
              />
            </div>
          </div>
          
          <Button disabled={!isValid} label="Valider" onClick={() => void submit()} />
        </p>
      </Fieldset>
    </>
  );
}
