import db from "~/db";
import type { Route } from "./+types/home";
import { ProgressSpinner } from "primereact/progressspinner";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Noël 2024 - champagne contest" },
    { name: "description", content: "champagne contest" },
  ];
}

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  const response = await db.from('vote').select()
  if (response.error) {
      throw response.error
  }
  return response.data;
}

export default function Page({loaderData: votes}: Route.ComponentProps) {
  
  if (!votes) {
    return <ProgressSpinner/>
  }
  return <>
    <h1>Champagne contest</h1>    
    { votes.map(vote => {
      return <div>
        <h2>{vote.created_at}</h2>
        <ul>
          <li>{vote.guess_1}</li>
          <li>{vote.guess_2}</li>
          <li>{vote.guess_3}</li>          
        </ul>
      </div>
    }) }
  </>
}
