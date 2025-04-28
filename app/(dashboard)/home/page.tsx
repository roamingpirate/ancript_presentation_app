import { getServerSession } from "next-auth";
import { authOption } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Signout from "@/components/Signout";


export default async function Page() {
  const session = await getServerSession(authOption);

  return (
      <>
      <h1>Welcome, {session?.user?.id}!</h1>
      <Signout/>
      </>
  );
}
