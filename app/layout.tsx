
import { getServerSession } from "next-auth";
import { authOption } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import "./globals.css";
import { Work_Sans } from 'next/font/google';





const workSans = Work_Sans({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerSession(authOption);

  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent("/")}`);
  }

  return (
    <html lang="en">

      <body>{children}</body>

    </html>
  );
}
