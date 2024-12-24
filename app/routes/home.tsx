import db from "~/db";
import type { Route } from "./+types/home";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Fieldset } from "primereact/fieldset";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useRef, useState } from "react";
import type { SelectItemOptionsType } from "primereact/selectitem";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Noël 2024 - champagne contest" },
    { name: "description", content: "champagne contest" },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const response = await db
    .from("vote")
    .select()
    .order("created_at", { ascending: false })
    .maybeSingle();
  if (response.error) {
    throw response.error;
  }
  const vote = response.data
   
  return vote ? vote : { guess_1: "", guess_2: "", guess_3: "" };
}

export default function Page({ loaderData: vote }: Route.ComponentProps) {
    const [guess_1, setGuess_1] = useState(vote.guess_1);
    const [guess_2, setGuess_2] = useState(vote.guess_2);
    const [guess_3, setGuess_3] = useState(vote.guess_3);
  
  const guesses: SelectItemOptionsType = ["Ruinard", "Bio", "Gosset"];
  const toast = useRef<Toast>(null);

  async function submit() {
    if (!toast.current) return;
    const { data, error } = await db
      .from("vote")
      .upsert({
        guess_1: guess_1,
        guess_2: guess_2,
        guess_3: guess_3,
      })
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
      <h1>Champagne contest</h1>
      <Toast ref={toast} />
      <Fieldset legend="Votes">
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
        <Button
          disabled={!isValid}
          label="Valider"
          onClick={() => void submit()}
        />
      </Fieldset>
    </>
  );
}
