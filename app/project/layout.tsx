"use client"
import { store } from "@/store/store";
import { Toaster } from 'sonner'
import { Provider } from "react-redux";



export default function ProjectLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
          <>
          <Provider store={store}>
          <Toaster position="bottom-center" />
          {children} {/* No DashboardNavBar or NewProjectModal */}
          </Provider>
          </>
    );
  }
  