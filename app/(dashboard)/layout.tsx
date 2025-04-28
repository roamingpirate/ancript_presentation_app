import { getServerSession } from "next-auth";
import { authOption } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardNavBar from "@/components/DashboardNavBar";
import NewProjectModal from "@/components/NewProjectComponents/NewProjectModal";
import SessionProviderWrapper from "@/components/utils/SessionProviderWrapper";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
        <SessionProviderWrapper>
          <div className="flex w-screen">
            <DashboardNavBar />
            {children}
            <NewProjectModal />
          </div>
        </SessionProviderWrapper>
  );
}
