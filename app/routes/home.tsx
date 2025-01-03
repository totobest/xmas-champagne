import db from "~/db";
import type { Route } from "./+types/home";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Fieldset } from "primereact/fieldset";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useEffect, useRef, useState } from "react";
import type { SelectItemOptionsType } from "primereact/selectitem";
import { useToastContext } from "~/ToastContext";
import { InputNumber } from "primereact/inputnumber";
import { Toolbar } from "primereact/toolbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Noël 2024 - champagne contest" },
    { name: "description", content: "champagne contest" },
  ];
}

async function getVote() {
  const response = await db.from("vote").select().maybeSingle();
  if (response.error) {
    throw response.error;
  }
  const vote = response.data;
  console.log(`clientLoader vote ${JSON.stringify(vote, null, 2)}`);
  return vote ? vote : { guess_1: "", guess_2: "", guess_3: "", gift_value: 0 };
}

export default function Page() {
  const guesses: SelectItemOptionsType = ["Ruinard", "Bio", "Gosset"];
  const toast = useToastContext();

  const [guess_1, setGuess_1] = useState("");
  const [guess_2, setGuess_2] = useState("");
  const [guess_3, setGuess_3] = useState("");
  const [giftValue, setGiftValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getVote()
      .then((vote) => {
        setGuess_1(vote.guess_1);
        setGuess_2(vote.guess_2);
        setGuess_3(vote.guess_3);
        setGiftValue(vote.gift_value);
      })
      .catch((error) => {
        toast.show({
          severity: "error",
          detail: error.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function submit() {
    toast.show({ severity: "info", detail: "Les votes sont figés" });
    // try {
    //   setSubmitLoading(true);

    //   const { data, error } = await db
    //     .from("vote")
    //     .upsert({
    //       guess_1: guess_1,
    //       guess_2: guess_2,
    //       guess_3: guess_3,
    //       gift_value: giftValue,
    //     })
    //     .select();
    //   if (error) {
    //     toast.show({
    //       severity: "error",
    //       detail: error.message,
    //     });
    //   } else {
    //     toast.show({
    //       severity: "info",
    //       detail: "Vote enregistré",
    //     });
    //   }
    // } finally {
    //   setSubmitLoading(false);
    // }
  }

  async function signOut() {
    setSignOutLoading(true);
    localStorage.clear();
    const resetSessionPromise = db.auth
      .setSession({ access_token: "", refresh_token: "" })
    const signOutPromise = db.auth.signOut({scope: "local"})
    Promise.all([resetSessionPromise, signOutPromise]).then(() => {
        window.location.reload();
      })
      .catch((error) => {
        toast.show({ severity: "error", detail: error.message });
      })
      .finally(() => setSignOutLoading(false));
      }

  const isValid = guess_1 && guess_2 && guess_3;

  return (
    <>
      <Fieldset legend="Vote">
        {loading ? (
          <ProgressSpinner />
        ) : (
          <>
            <div className="field grid">
              <label className="col" htmlFor="guess_1">
                <div
                  className="w-1rem h-1rem bg-cyan-500"
                  style={{ marginRight: "0.5rem" }}
                ></div>
                Choix turquoise :
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
                <div
                  className="w-1rem h-1rem bg-pink-500"
                  style={{ marginRight: "0.5rem" }}
                ></div>
                Choix rose :
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
                <div
                  className="w-1rem h-1rem bg-purple-500"
                  style={{ marginRight: "0.5rem" }}
                ></div>{" "}
                Choix violet :
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
            <div className="field grid">
              <label className="col" htmlFor="giftValue">
                Valeur du cadeau :
              </label>
              <div className="col">
                <div className="p-inputgroup">
                  <InputNumber
                    value={giftValue}
                    onValueChange={(e) => setGiftValue(e.value as number)}
                  />
                  <span className="p-inputgroup-addon">€</span>
                </div>
              </div>
            </div>
            <Button
              disabled={!isValid}
              loading={submitLoading}
              icon="pi pi-gift"
              label="Valider"
              onClick={() => void submit()}
            />
          </>
        )}
      </Fieldset>
      <Toolbar
        end={
          <Button
            icon="pi pi-sign-out"
            label=""
            loading={signOutLoading}
            onClick={signOut}
          />
        }
      />
    </>
  );
}
