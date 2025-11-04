import type { Metadata } from "next";
import StyledComponentsRegistry from "../components/StyledComponentsRegistry";
import { ToastProvider } from "../contexts/ToastContext";
import { AuthProvider } from "../contexts/AuthContext";
import QueryProvider from "../components/providers/QueryProvider";
import ReduxProvider from "../components/providers/ReduxProvider";
import "./globals.css";
import 'react-datepicker/dist/react-datepicker.css';

export const metadata: Metadata = {
  title: "Mast HRM - Hệ thống quản lý nhân sự",
  description: "Hệ thống quản lý nhân sự hiện đại và hiệu quả",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StyledComponentsRegistry>
          <ReduxProvider>
            <QueryProvider>
              <AuthProvider>
                <ToastProvider>
                  {children}
                </ToastProvider>
              </AuthProvider>
            </QueryProvider>
          </ReduxProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
