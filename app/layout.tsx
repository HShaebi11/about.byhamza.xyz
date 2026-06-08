import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#ebebeb',
};

export const metadata: Metadata = {
  title: "Hamza Shaebi | Portfolio",
  description: "Anti-disciplinarity & Design Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="safari-safearea-shim top" aria-hidden="true" />
        <div className="safari-safearea-shim bottom" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}

