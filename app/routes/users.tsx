import db from "~/db";
import { ProgressSpinner } from "primereact/progressspinner";
import type { Route } from "./+types/users";


export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const {
    data: { users },
    error,
  } = await db.auth.admin.listUsers();
  if (error) {
    throw error;
  }
  return users;
}

export default function Page({ loaderData: users }: Route.ComponentProps) {
  if (!users) {
    return <ProgressSpinner />;
  }

  return (
    <>
      {users.map((user) => {
        return <li>{user.id}</li>;
      })}
    </>
  );
}
