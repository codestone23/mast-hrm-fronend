import type { Metadata } from "next";
import StyledComponentsRegistry from "../components/StyledComponentsRegistry";
import { ToastProvider } from "../contexts/ToastContext";
import QueryProvider from "../components/providers/QueryProvider";
import "./globals.css";

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
    <html lang="vi">
      <body>
        <StyledComponentsRegistry>
          <QueryProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
